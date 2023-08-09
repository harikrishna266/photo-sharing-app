var express = require('express');
var router = express.Router();
var multer = require('multer');
var Gallery = require('../models/Gallery');
const os = require('os');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

app.use(bodyParser.json());

// Save file to server storage
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        console.log("file => ", file);
        var fileType = '';
        if (file.mimetype === 'image/gif') {
            fileType = 'gif';
        }
        if (file.mimetype === 'image/png') {
            fileType = 'png';
        }
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            fileType = 'jpg';
        }
        cb(null, 'image-' + Date.now() + '.' + fileType);
    }
});

var upload = multer({ storage: storage });

function getIpAddress() {
    const networkInterfaces = os.networkInterfaces();
    let ipv4Address;

    Object.keys(networkInterfaces).forEach((interfaceName) => {
        const interfaces = networkInterfaces[interfaceName];
        interfaces.forEach((iface) => {
            // Look for IPv4 addresses that are not internal
            if (iface.family === 'IPv4' && !iface.internal) {
                ipv4Address = iface.address;
            }
        });
    });
    return ipv4Address;
}

const ipv4Address = getIpAddress();
console.log('IPv4 Address:', ipv4Address);
app.use(express.static(path.join(__dirname, 'public')));

// post Data
router.post('/', upload.single('file'), async function (req, res, next) {
    if (!req.file || req.body.imageTitle === '' || req.body.imageDesc === '') {
        return res.status(500).send({ message: 'Upload Fail' });
    } else {
        req.body.imageUrl = `http://${ipv4Address}:3000/images/` + req.file.filename;

        await Gallery.create(req.body, function (err, gallery) {
            if (err) {
                console.log(err);
                return next(err);
            }
            res.json(gallery);
        })
    }
});

// Create a route to retrieve all images from the database
router.get('/all', async (req, res) => {
    try {
        const images = await Gallery.find({});
        res.json(images);
    } catch (err) {
        console.error('Error fetching images:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete image route
router.delete('/:imageId', async (req, res) => {
    const imageId = req.params.imageId;
    try {
        // Find the image by imageId and remove it from the database
        const deletedImage = await Gallery.findByIdAndDelete(imageId);

        if (!deletedImage) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.json({ message: 'Image deleted successfully', deletedImage });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;