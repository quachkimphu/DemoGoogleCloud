// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const { PubSub } = require('@google-cloud/pubsub');

const topicName = 'projects/think-products-224421/topics/think-demo';

const pubsub = new PubSub({
  projectId: 'think-products-224421'
});

// This configuration will automatically create the topic if
// it doesn't yet exist. Usually, you'll want to make sure
// that a least one subscription exists on the topic before
// publishing anything to it as topics without subscribers
// will essentially drop any messages.
// [START topic]
function getTopic(cb) {
  pubsub.createTopic(topicName, (err, topic) => {
    // topic already exists.
    if (err && err.code === 6) {
      cb(null, pubsub.topic(topicName));
      return;
    }
    cb(err, topic);
  });
}
// [END topic]

// Adds a book to the queue to be processed by the worker.
// [START queue]
function queueBook(bookId) {
  getTopic((err, topic) => {
    if (err) {
      console.log('Error occurred while getting pubsub topic', err);
      return;
    }

    const data = {
      action: 'processBook',
      bookId: bookId,
    };

    const publisher = topic.publisher();
    publisher.publish(Buffer.from(JSON.stringify(data)), err => {
      if (err) {
        console.log('Error occurred while queuing background task', err);
      } else {
        console.log(`Book ${bookId} queued for background processing`);
      }
    });
  });
}
// [END queue]

// Adds a find file pdf to the queue to be processed by the worker.
// [START queue]
function queueFindPdf(projectId, searchString) {
  getTopic((err, topic) => {
    if (err) {
      console.log('Error occurred while getting pubsub topic', err);
      return;
    }

    const data = {
      action: 'processFindPdf',
      projectId: projectId,
      searchString: searchString
    };

    const publisher = topic.publisher();
    publisher.publish(Buffer.from(JSON.stringify(data)), err => {
      if (err) {
        console.log('Error occurred while queuing background task', err);
      } else {
        console.log(`Book ${projectId} queued for background processing`);
      }
    });
  });
}
// [END queue]

module.exports = {
  queueBook,
  queueFindPdf
};
