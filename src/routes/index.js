const express = require('express');
const { getBirthDayUsers, sendGifts } = require('../controllers/birthDayController');
const { addUser, getAllUsers, getUserById, updateUserById } = require('../controllers/usersController');

const router = express.Router();

router.get('/birthdays', getBirthDayUsers);
router.post('/send-gifts', sendGifts);
router.post('/users', addUser);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.get('/users/:id', updateUserById);


module.exports = router;