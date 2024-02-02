var express = require('express');
var router = express.Router();
var Image = require('../models/image');
var mongoose = require('mongoose');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.json('good');
});

router.post('/validate', async function(req, res, next) {
  const character = JSON.parse(req.body.character);
  const clickLocation = JSON.parse(req.body.clickLocation);
  const hitboxSize = JSON.parse(req.body.hitboxSize);
  const imageId = req.body.imageId;
  const image = await Image.findById(imageId);
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

  image.clickLocation.forEach((location, index) => {
    if (location.x === clickLocation.x && location.y === clickLocation.y) {
      return res.json({ message: 'Correct!' });
    }
  })

  return res.json({ message: 'Incorrect location :(' });

});
  


module.exports = router;
