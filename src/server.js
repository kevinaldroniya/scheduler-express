const app = require('./app');
const { PORT } = require('./config/env');
// const runWorker = require('../src/worker/birthDayWorker');
// runWorker();
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});