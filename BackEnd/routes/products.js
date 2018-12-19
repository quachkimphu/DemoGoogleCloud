var express = require('express');
var router = express.Router();

const admin = require('firebase-admin');
const customSearch = require('../api/service/customSearch');
const pubsubService = require('../api/googleapis/pubsubService');
const Res = require('../api/service/Res');
var request = require('request');
const background = require('../api/lib/background');

//var serviceAccount = require("../think-products-224421-38a90383f129.json");
var serviceAccount = require("../api/config/think-products-224421-38a90383f129.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    //storageBucket: "think-e7103.appspot.com"
});

/* config something */
var db = admin.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true };
db.settings(settings);

/* POST add product. */
router.post('/create', function (req, res, next) {

    const data = {
        name: req.body.name || 'Default name',
        manufacturer: req.body.manufacturer || 'Default manufacturer',
        productId: req.body.productId || 'Default productId',
        msds: req.body.msds || null,
    };

    /* Test save data to firestore */
    db.collection('products').add(data).then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);

        /* Test gg searching file pdf */
        let option = {
            query: data.name.trim() + ' ' + data.manufacturer.trim() + ' pdf'
            // query: 'kiwi newzel pdf'
        }

        background.queueFindPdf(docRef.id, option.query);
        //pubsubService.getSubscription();

        /* customSearch.search_pdf_file(option, function (pdfUrl) {
            console.log('pdfUrl', pdfUrl);
            // Add a new document in collection "cities"

            db.collection("products").doc(docRef.id).set({
                msds: pdfUrl
            }, { merge: true })
                .then(function () {
                    console.log("Document successfully written!");
                })
                .catch(function (error) {
                    console.error("Error writing document: ", error);
                });
        }); */

        res.send(data);
    })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });;


});

/* GET products listing. */
router.get('/listing', function (req, res, next) {

    var productsRef = db.collection('products');

    productsRef.get()
        .then(snapshot => {

            let data = [];
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                let temp = doc.data();
                temp.id = doc.id;

                data.push(temp);
            });

            res.send(data);
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

/* POST update product. */
router.put('/update', function (req, res, next) {

    const data = {
        name: req.body.name || 'Default name',
        manufacturer: req.body.manufacturer || 'Default manufacturer',
        productId: req.body.productId || 'Default productId',
        msds: req.body.msds || null,
    };

    /* Test gg searching file pdf */
    let option = {
        query: data.name.trim() + ' ' + data.manufacturer.trim() + ' pdf'
        // query: 'kiwi newzel pdf'
    }

    background.queueFindPdf(req.query.id.toString(), option.query);


    db.collection("products").doc(req.query.id.toString()).set(data, { merge: true })
        .then(function () {
            console.log("Document successfully written!");

        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });


    res.send(data);

});

/* GET remove product. */
router.delete('/delete', function (req, res, next) {

    db.collection("products").doc(req.query.id.toString()).delete().then(function () {
        console.log("Document successfully deleted!");

        res.send(Res.success(undefined, { message: 'Product successfully deleted!' }));
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
});


module.exports = router;
