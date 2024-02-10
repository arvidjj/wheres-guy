var express = require('express');
var router = express.Router();
var ScoreSession = require('../models/scoresession');
const UserScore = require('../models/userscore');

/* GET users listing. */
router.post('/', async function (req, res, next) {
    const sessionScoreId = req.body.sessionScoreId;

    let foundSession = await ScoreSession.findOne({ _id: sessionScoreId });

    let newUserScore = new UserScore({
        username: req.body.username,
        score: foundSession.elapsedTime,
        imageId: foundSession.image
    });

    try {
        newUserScore.save()
        ScoreSession.deleteOne({ _id: sessionScoreId });
        return res.json({ message: 'Score saved' });
    } catch {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

});

module.exports = router;
