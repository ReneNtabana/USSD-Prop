// controller/ussdController.js
const { Queue } = require('bullmq');
const connection = require('../config/redis.js');

const notificationQueue = new Queue('death-notifications', { connection });

exports.handleUssd = async (req, res) => {
    const { sessionId, text, phoneNumber } = req.body;
    const input = text.split('*');

    if (input.length === 2 && input[1] === '1') {
        const deceasedId = input[0];

        await notificationQueue.add('register-death', {
            deceasedId,
            chiefNumber: phoneNumber,
            timestamp: new Date()
        }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 1000 }
        });

        // SEND RESPONSE IMMEDIATELY
        return res.send(`END Notification received. We are processing ID: ${deceasedId}.`);
    }
};