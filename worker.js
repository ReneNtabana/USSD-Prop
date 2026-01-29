// worker.js
const { Worker } = require('bullmq');
const connection = require('./config/redis');

const worker = new Worker('death-notifications', async (job) => {
    console.log(`[Worker] Processing registration for ID: ${job.data.deceasedId}`);

    // SIMULATE SLOW EXTERNAL API (Step 6 of your flowchart)
    // This could take 10 seconds, but it won't cause a USSD timeout!
    await someExternalCrvsApi(job.data);

    console.log(`[Worker] Job ${job.id} Completed!`);
}, { connection });

worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job.id} failed: ${err.message}`);
});