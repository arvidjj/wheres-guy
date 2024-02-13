
const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp'); // Import sharp
const fs = require('fs');
const Image = require('../models/image');
const ScoreSession = require('../models/scoresession');
const mongoose = require('mongoose');


const storage = multer.memoryStorage();

const upload = multer({ storage });


router.get('/', async function (req, res, next) {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/random', async (req, res) => {
  try {
    const randomImage = await Image.aggregate([{ $sample: { size: 1 } }]);
    if (!randomImage || randomImage.length === 0) {
      return res.status(404).json({ error: 'No random image found' });
    }
    // Create a new score session for the random image
    const newSession = await ScoreSession.create({ image: randomImage[0]._id, guessedCharacters: 0, servedAt: new Date()
    , elapsedTime: 0});

    //return the image and the id of the scoresession
    res.json({ image: randomImage[0], sessionId: newSession._id });
  } catch (error) {
    console.error('Error getting random image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async function (req, res, next) {
  //get image by id
  const imageId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      return res.status(400).json({ error: 'Invalid image ID' });
    }

    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json(image);
  } catch (error) {
    console.error('Error fetching image by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define the route for uploading images
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded!' });
    }
    try {
      await fs.promises.access('./public/images');
    } catch (err) {
      console.log("Folder does not exist");
      await fs.promises.mkdir('./public/images');
    }

    //format the name so there are no spaces and give it a unique name
    const imageName = req.file.originalname.replace(/\s/g, '');

    //get from the post request the data
    const character = JSON.parse(req.body.character);
    const clickLocation = JSON.parse(req.body.clickLocation);
    const hitboxSize = JSON.parse(req.body.hitboxSize);

    const image = new Image({
      image: imageName,
      character: character,
      clickLocation: clickLocation,
      hitboxSize: hitboxSize
    })
    await image.save();

    await sharp(req.file.buffer).
      resize(1000).
      toFile('./public/images/' + imageName);

    return res.status(200).json({ imageUrl: '/images/' + imageName });
  } catch (error) {
    console.error('Error handling image upload:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports = router;
