var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const customSearch = require('../api/service/customSearch');
const background = require('../api/lib/background');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

const jsonParser = bodyParser.json();
router.post('/endpoint', jsonParser, function (req, res, next) {
    const data = req.body;
    console.log('dataX', data);

    if (!req.body || !req.body.message || !req.body.message.data) {
        console.log('Bad request');
        return res.sendStatus(400);
    }

    const dataUtf8encoded = Buffer.from(req.body.message.data, 'base64').toString(
        'utf8'
    );
    var content;
    try {
        content = JSON.parse(dataUtf8encoded);
    } catch (ex) {
        console.log('Bad request');
        return res.sendStatus(400);
    }

    if (content.action && content.action === 'processFindPdf' && content.projectId) {
        console.log(`Received request to process projectId ${content.projectId}`);
        console.log(`Received searchString ${content.searchString}`);

        const projectId = content.projectId;
        const searchString = content.searchString;

        // handle searching file pdf here
        const option = {
            query: searchString
        }

        customSearch.search_pdf_file(option, async function (err, result) {
            if (err) res.status(403).send(result);
            console.log('originalLinkXXX', result);
    
            customSearch.save_pdf_file_new(result, function (err, pdfLink) {
                if (err) res.status(403).send(err);
                console.log('uploadLinkXXX', pdfLink);
    
                background.queueUpdateProduct(projectId, pdfLink)
            });
    
        });

    } else {
        console.log('Bad request', content);
        return res.sendStatus(400);
    }

    res.send(data);

});

module.exports = router;
