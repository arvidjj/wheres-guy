
const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp'); // Import sharp
const fs = require('fs');
const Image = require('../models/image');


const storage = multer.memoryStorage();

const upload = multer({ storage });


router.get('/', function (req, res, next) {
  const images = Image.find();
  res.json(images);
});

router.get('/:id', function (req, res, next) {
  //get image by id
  const image = Image.findById(req.params.id);
  res.json(image);
});

router.get('/random', function (req, res, next) {
  const image = Image.findRandom();
  res.json(image);
});

// Define the route for uploading images
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded!' });
    }
    fs.access('./public/images', (err) => {
      if (err) {
        console.log("Folder does not exist");
        fs.mkdirSync('./public/images');
      }
    });

    await sharp(req.file.buffer).
      resize(750).
      toFile('./public/images/' + req.file.originalname);

    //get from the post request the data
    /* const { clickLocation, hitboxSize } = req.body;
     const image = new Image({
         image: req.file.originalname,
         clickLocation: clickLocation,
         hitboxSize: hitboxSize
    })
    await image.save();*/
    return res.status(200).json({ imageUrl: '/images/' + req.file.originalname });
  } catch (error) {
    console.error('Error handling image upload:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
