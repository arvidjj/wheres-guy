
const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp'); // Import sharp
const fs = require('fs');
const Image = require('../models/image');


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

router.get('/:id', async function (req, res, next) {
  //get image by id
  const imageId = req.params.id;
  try {
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/random', function (req, res, next) {
  //get random image
  Image.findRandom(function (err, image) {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(image);
  });
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
    const clickLocation = JSON.parse(req.body.clickLocation);
    const hitboxSize = JSON.parse(req.body.hitboxSize);

    const image = new Image({
      image: imageName,
      clickLocation: clickLocation,
      hitboxSize: hitboxSize
    })
    await image.save();

    await sharp(req.file.buffer).
      resize(750).
      toFile('./public/images/' + imageName);

    return res.status(200).json({ imageUrl: '/images/' + imageName });
  } catch (error) {
    console.error('Error handling image upload:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
