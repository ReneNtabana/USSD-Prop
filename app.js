const express = require('express');
const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');

const app = express();
app.use(express.urlencoded({ extended: false }));

const connection = new IORedis({
    maxRetriesPerRequest: null
});
const registrationQueue = new Queue('death-registration', { connection });

app.post('/', async (req, res) => {
    const { text, phoneNumber } = req.body;

    const input = text ? text.split('*') : [];

    let response = "";

    // Step 1: Ask for ID
    if (text === "") {
        response = "CON Enter Deceased ID:";
    }
    // Step 2: Ask for Name
    else if (input.length === 1) {
        response = "CON Enter Deceased Name:";
    }
    // Step 3: Ask for Village
    else if (input.length === 2) {
        response = "CON Enter Village:";
    }
    // Step 4: Confirm Details
    else if (input.length === 3) {
        const [id, name, village] = input;
        response = `CON Confirm Details:\nID: ${id}\nName: ${name}\nVil: ${village}\n1. Confirm\n2. Cancel`;
    }
    // Step 5: Process
    else if (input.length === 4 && input[3] === '1') {
        const [id, name, village] = input;

        await registrationQueue.add('complex-registration', {
            deceasedId: id,
            deceasedName: name,
            village: village,
            reportedBy: phoneNumber,
            timestamp: new Date().toISOString()
        });

        response = `END Data captured! Processing in background for ${name}.`;
    }
    else {
        response = "END Process cancelled.";
    }

    res.send(response);
});

const worker = new Worker('death-registration', async (job) => {
    console.log('------------------------------------------------');
    console.log(`[Worker] New Job Received: ${job.id}`);
    console.log(`[Worker] Data:`, job.data);

    // Simulate Step 4
    console.log(`[Step 4] Sending SMS notification to Informant (${job.data.reportedBy}) and PHS&EPR Division...`);
    await new Promise(r => setTimeout(r, 1000));

    // Simulate Step 5
    console.log(`[Step 5] Sending notification to Cell Executive Secretary...`);
    await new Promise(r => setTimeout(r, 1000));

    // Simulate Step 6
    console.log(`[Step 6] Compiling data for e-death central system...`);
    console.log(`[Step 6] Pushing record to NCI-CRVS integration...`);
    await new Promise(r => setTimeout(r, 20000));

    console.log(`[Worker] SUCCESS: Death Notification for ID ${job.data.deceasedId} fully processed.`);
    console.log('------------------------------------------------');
}, { connection });

worker.on('failed', (job, err) => console.log(`${job.id} failed: ${err.message}`));

app.listen(3000, () => console.log('USSD Demo Server running on port 3000'));