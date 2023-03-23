const express = require('express');
const router = express();

// routers use
router.use('/api/users' , require('./UserRoutes'));
router.use('/api/meeting', require('./MeetingRoutes'));


// test
router.get('/', (req, res) => {
    res.send('API');
});



module.exports = router;