const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: false }));

const connection = new IORedis({
    maxRetriesPerRequest: null
});

app.listen(3000, () => console.log('USSD Demo Server running on port 3000'));