var request = require('request');
const constValues = require('../config/const').const;

module.exports = {


    search_pdf_file: function (option, callback) {

        const customSearchURL = constValues.customSearchURL;
        const apiKey = constValues.googleApiKey;
        const cx = constValues.searchEngineID;
        const q = option.query;

        const url = customSearchURL + '/v1?key=' + apiKey + '&cx=' + cx + '&q=' + q;

        request(url, function (error, response, body) {
            /* console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', typeof (body)); // Print the HTML for the Google homepage.     */
            const data = JSON.parse(body);

            let pdfUrl = null;
            for (const element of data.items) {
                //console.log('element', element);
                if (element.mime === 'application/pdf') {
                    pdfUrl = element.formattedUrl;
                    break;
                }

            }

            callback(pdfUrl);
        })

    },

    save_pdf_file: async function () {


        try {

            var admin = require("firebase-admin");
            var bucket = admin.storage().bucket();

            // Imports the Google Cloud client library
            //const { Storage } = require('@google-cloud/storage');
            const Storage = require('@google-cloud/storage');
            // Creates a client
            const storage = new Storage();

            /**
             * TODO(developer): Uncomment the following lines before running the sample.
             */
            const bucketName = 'think-e7103.appspot.com';
            const filename = require('../../Head First Java Second Edition by Bert Bates and Kathy Sierra - Booksknot.pdf');
            // Uploads a local file to the bucket
            await bucket.upload(filename, {
                // Support for HTTP requests made with `Accept-Encoding: gzip`
                gzip: true,
                metadata: {
                    // Enable long-lived HTTP caching headers
                    // Use only if the contents of the file will never change
                    // (If the contents will change, use cacheControl: 'no-cache')
                    cacheControl: 'public, max-age=31536000',
                },
            });

            console.log(`${filename} uploaded to ${bucketName}.`);
        } catch (error) {
            console.log('err', error)
        }


        

    }


}