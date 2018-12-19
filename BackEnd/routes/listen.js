var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
var db = admin.firestore();

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

    if (content.action && content.action === 'processUpdateProduct' && content.projectId) {
        console.log(`Received request to process projectId ${content.projectId}`);
        console.log(`Received pdfLink ${content.pdfLink}`);
        
        const projectId = content.projectId;
        const pdfLink = content.pdfLink;

        // handle update product here        
        const data = {
            msds: pdfLink
        };

        db.collection("products").doc(projectId).set(data, { merge: true })
            .then(function () {
                console.log("Document successfully background update!");
                
            })
            .catch(function (error) {
                console.error("Error backgroud update document: ", error);
            });
        
    } else {
        console.log('Bad request', content);
        return res.sendStatus(400);
    }

    res.send(data);

});

module.exports = router;
