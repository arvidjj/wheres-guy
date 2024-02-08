var express = require('express');
var router = express.Router();
var Image = require('../models/image');
const ScoreSession = require('../models/scoresession');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json('good');
});

router.post('/validate', async function (req, res, next) {
  const character = JSON.parse(req.body.character);
  const clickLocation = JSON.parse(req.body.clickLocation);
  const hitboxSize = JSON.parse(req.body.hitboxSize);
  const sessionScoreId = JSON.parse(req.body.sessionScoreId);
  const imageId = req.body.imageId;
  const image = await Image.findById(imageId);

  console.log(sessionScoreId)

  let hasDoneIt = false;

  if (!image) {
    return res.status(404).json({ error: 'Image not found' });
  }
  if (!image.character.includes(character)) {
    return res.status(400).json({ error: 'Invalid character' });
  }

  if (clickLocation.x < 0 || clickLocation.y < 0) {
    return res.status(400).json({ error: 'Invalid click location' });
  }

  if (clickLocation.x + hitboxSize.width > image.width || clickLocation.y + hitboxSize.height > image.height) {
    return res.status(400).json({ error: 'Click location is out of bounds' });
  }

  /*console.log("x: " + clickLocation.x + ", y: " + clickLocation.y);
  console.log(image.clickLocation);*/

  image.clickLocation.forEach((location, index) => {
    if (isPointInside(clickLocation.x, clickLocation.y, location.x, location.y, hitboxSize.width, hitboxSize.height)) {
      if (image.character[index] === character) {
        hasDoneIt = true;

        // Update the score session and calculate elapsed time
        ScoreSession.updateOne({ _id: sessionScoreId }, { $inc: { guessedCharacters: 1 } })
          .then(() => {
            // success
          })
          .catch((err) => {
            console.error('Error updating score session:', err);
            return res.status(500).json({ error: 'Internal server error' });
          });

        return res.json({ message: 'true', character: character });
      } else {
        console.log("This is not the correct character!")
      }
    }
  })

  if (hasDoneIt) return;

  return res.json({ message: 'false' });

});

function isPointInside(x, y, centerX, centerY, width, height) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const minX = centerX - halfWidth;
  const maxX = centerX + halfWidth;
  const minY = centerY - halfHeight;
  const maxY = centerY + halfHeight;

  return x >= minX && x <= maxX && y >= minY && y <= maxY;
}

module.exports = router;
