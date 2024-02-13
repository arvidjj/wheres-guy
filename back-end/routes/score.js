var express = require('express');
var router = express.Router();
var ScoreSession = require('../models/scoresession');
const UserScore = require('../models/userscore');

router.get('/image/:id', async function (req, res, next) {
    //get all scores of this image
    const imageId = req.params.id;
    let foundScores = await UserScore.find({ imageId: imageId }).sort({ score: -1 });
    return res.json(foundScores);
});

/* GET users listing. */
router.post('/', async function (req, res, next) {
    const sessionScoreId = req.body.sessionScoreId;

    let foundSession = await ScoreSession.findOne({ _id: sessionScoreId });

    let newUserScore = new UserScore({
        username: req.body.username,
        score: foundSession.elapsedTime,
        servedAt: foundSession.servedAt,
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
