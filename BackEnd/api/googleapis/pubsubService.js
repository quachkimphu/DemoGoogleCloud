/**
 * GOOGLE PUBSUB SERVICES
 *
 */
// Imports the Google Cloud client library
const { PubSub } = require('@google-cloud/pubsub');
// Creates a client
const pubsub = new PubSub();

module.exports = {
    async getSubscription() {
        // Imports the Google Cloud client library
        const {PubSub} = require('@google-cloud/pubsub');
      
        // Creates a client
        const pubsub = new PubSub();
      
        /**
         * TODO(developer): Uncomment the following line to run the sample.
         */
        const subscriptionName = 'projects/think-products-224421/subscriptions/think-demo';
      
        // Gets the metadata for the subscription
        const [metadata] = await pubsub.subscription(subscriptionName).getMetadata();
        console.log(`Subscription: ${metadata.name}`);
        console.log(`Topic: ${metadata.topic}`);
        console.log(`Push config: ${metadata.pushConfig.pushEndpoint}`);
        console.log(`Ack deadline: ${metadata.ackDeadlineSeconds}s`);
    },  

    publicMessage: async function (options) {
        /**
         * TODO(developer): Uncomment the following lines to run the sample.
         */
        //const topicName = 'projects/think-e7103/topics/tam-test-topic';
        const topicName = 'projects/think-products-224421/topics/think-demo';
        // const data = JSON.stringify({ foo: 'bar' });
        const data = JSON.stringify(options);

        // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
        const dataBuffer = Buffer.from(data);

        const messageId = await pubsub
            .topic(topicName)
            .publisher()
            .publish(dataBuffer);
        console.log(`Message ${messageId} published.`);
    },

    recieveMessage: async function () {
        /**
         * TODO(developer): Uncomment the following lines to run the sample.
         */
        const subscriptionName = 'projects/think-e7103/subscriptions/tam-test-subcription';
        const timeout = 60;

        // References an existing subscription
        const subscription = pubsub.subscription(subscriptionName);

        // Create an event handler to handle messages
        let messageCount = 0;
        const messageHandler = message => {
            console.log(`Received message ${message.id}:`);
            console.log(`\tData: ${message.data}`);
            console.log(`\tAttributes: ${message.attributes}`);
            messageCount += 1;

            // "Ack" (acknowledge receipt of) the message
            message.ack();
        };

        // Listen for new messages until timeout is hit
        subscription.on(`message`, messageHandler);

        setTimeout(() => {
            subscription.removeListener('message', messageHandler);
            console.log(`${messageCount} message(s) received.`);
        }, timeout * 1000);
    }

}