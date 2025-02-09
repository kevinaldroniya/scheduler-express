const cron = require('node-cron');
const axios = require('axios');
const { getBirthDayUsers, sendGifts } = require('../controllers/birthDayController');

const BASE_URL = 'http://localhost:3000/api'

const runWorker = () => {
    cron.schedule('* * * * *', async () => {
        try {
            console.log('worker is working');
            const { data: users } = await axios.get(`${BASE_URL}/birthdays`);
            // console.log('users', users);
            if (users.length > 0) {
                await axios.post(`${BASE_URL}/send-gifts`, { users })
                // console.log('Gift successfully sent to:', users);
            } else {
                console.log('There is no user data that has not received a birthday gift');
            }
        } catch (err) {
            console.error('Worker error', err.message);
        }
    });
};

module.exports = runWorker;