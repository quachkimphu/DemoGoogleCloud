var request = require('request');
const constValues = require('../config/const').const;

module.exports = {

    /* Searching list of pdf file */
    find_all_pdf: function (option, callback) {

        const customSearchURL = constValues.customSearchURL;
        const apiKey = constValues.googleApiKey;
        const cx = constValues.searchEngineID;
        const q = option.query;
        const type = 'pdf'

        const url = customSearchURL + '/v1?key=' + apiKey + '&cx=' + cx + '&q=' + q + '&fileType=' + type;
        console.log('urlXXx', url)

        request(url, function (error, response, body) {
            if (error) {
                callback(true, error);
            }

            const data = JSON.parse(body);
            let fileListPDF = [];
            for (const element of data.items) {
                //console.log('element', element);
                if (element.mime === 'application/pdf') {
                    fileListPDF.push(element.link);
                }
            }

            callback(false, fileListPDF);
        })
    },

    search_pdf_file: function (option, callback) {

        const customSearchURL = constValues.customSearchURL;
        const apiKey = constValues.googleApiKey;
        const cx = constValues.searchEngineID;
        const q = option.query;
        const type = 'pdf'

        const url = customSearchURL + '/v1?key=' + apiKey + '&cx=' + cx + '&q=' + q + '&fileType=' + type;
        console.log('urlXXx', url)

        request(url, function (error, response, body) {
            if (error) {
                callback(true, error);
            }

            const data = JSON.parse(body);
            let pdfUrl = null;
            for (const element of data.items) {
                //console.log('element', element);
                if (element.mime === 'application/pdf') {

                    let link = element.link;
                    if (link.substr(0, 5) == 'https' && link.substr(link.length - 4, 5) == '.pdf') {

                        pdfUrl = link;
                        break;
                    }
                }
            }

            callback(false, pdfUrl);
        })

    },

    save_pdf_file: async function (lstUrl) {
        var i = 0;
        var listLink = [];
        try {
            // Imports the Google Cloud client library
            const Storage = require('@google-cloud/storage');
            // Creates a client
            const bucketNamev2 = 'think-bucket';
            const storage = new Storage({
                projectId: 'think-products-224421',
                keyFilename: 'ThinkKey.json'
            });
            const bucket = storage.bucket(bucketNamev2);
            await Promise.all(lstUrl.map(async (link) => {
                i++;
                console.log(`link ${i}: ${link}`);

                console.log(`File ${i} can download`);
                await bucket.upload(link, {
                    // Support for HTTP requests made with `Accept-Encoding: gzip`
                    gzip: true,
                    metadata: {
                        // Enable long-lived HTTP caching headers
                        // Use only if the contents of the file will never change
                        // (If the contents will change, use cacheControl: 'no-cache')
                        cacheControl: 'public, max-age=31536000',
                    },
                    public: true,

                })
                    .then(resp => {
                        fileName = resp[0].name;
                        console.log(resp[0].name);
                        let publicPdfUrl = constValues.storageUrl + `/${bucketNamev2}/${fileName}`;
                        console.log(`File uploaded to ${publicPdfUrl}.`);
                        listLink.push(publicPdfUrl);
                    })

            }));
            return listLink;
        } catch (error) {
            console.log('Error: ', error)
        }

    },

    save_pdf_file_new: async function (pdfLink, callback) {
        try {
            // Imports the Google Cloud client library
            const Storage = require('@google-cloud/storage');
            // Creates a client
            const bucketNamev2 = 'think-bucket';
            const storage = new Storage({
                projectId: 'think-products-224421',
                keyFilename: 'ThinkKey.json'
            });
            const bucket = storage.bucket(bucketNamev2);

            await bucket.upload(pdfLink, {
                // Support for HTTP requests made with `Accept-Encoding: gzip`
                gzip: true,
                metadata: {
                    // Enable long-lived HTTP caching headers
                    // Use only if the contents of the file will never change
                    // (If the contents will change, use cacheControl: 'no-cache')
                    cacheControl: 'public, max-age=31536000',
                },
                public: true,

            })
                .then(resp => {
                    fileName = resp[0].name;
                    console.log(resp[0].name);
                    let publicPdfUrl = constValues.storageUrl + `/${bucketNamev2}/${fileName}`;
                    console.log(`File uploaded to ${publicPdfUrl}.`);

                    callback(false, publicPdfUrl);
                })

        } catch (error) {
            console.log('ErrorXX: ', error)
            callback(error, null);
        }

    },
}