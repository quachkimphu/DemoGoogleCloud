var express = require('express');
const customSearch = require('../api/service/customSearch');
var router = express.Router();
var lstResult = [];

/* POST add product. */
router.post('/searching', function (req, res, next) {
    let name = req.body.name;
    let manufacture = req.body.manufacture;
    let siteSearch = '&siteSearch=' + manufacture + '.*';

    /* const option = {
        query: name.trim() + siteSearch
    } */

    /* customSearch.find_all_pdf(option, async function(err, result) {
        if (err) res.status(403).send(result);
        //console.log('result', result);
        if (result)
        {
            lstResult = await customSearch.save_pdf_file(result);
        }
        res.send(lstResult);

    }); */

    let option = {
        query: name.trim() + ' ' + manufacture.trim() + ' pdf'
        // query: 'kiwi newzel pdf'
    }
    customSearch.search_pdf_file(option, async function (err, result) {
        if (err) res.status(403).send(result);
        console.log('result', result);

        customSearch.save_pdf_file_new(result, function (err, pdfLink) {
            if (err) res.status(403).send(err);

            res.send(pdfLink);
        });

    });



});


module.exports = router;
