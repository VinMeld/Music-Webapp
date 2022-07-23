const express = require('express');
const router = express.Router();
const { getPublicSongs, getSongs, changeSong, deleteSong, setSong, likeSong, checkSong, sortCurrentSongs, filterCurrentSongs, searchCurrentSongs } = require('../controllers/songController');
const {protect} = require('../middleware/authMiddleware');
router.route('/check/:title').get(checkSong);
router.route('/checkSong/:title').get(checkSong);
router.route('/').get(protect, getSongs).post(protect, setSong);
router.route('/:id').put(protect, changeSong).delete(protect, deleteSong);
router.route('/getPublicSongs').get(getPublicSongs);
router.route('/getPublicSongs/:query').get(getPublicSongs);
router.route('/:query').get(protect, getSongs);
router.route('/:query/:package').get(protect, getSongs);
router.route('/getPublicSongs/:query/:package').get(getPublicSongs);
router.route('/:id/:userId').put(likeSong);
// Check if song is already in the database
router.route('/sortCurrentSongs/:query').post(sortCurrentSongs);
router.route('/filterCurrentSongs/:tags').post(filterCurrentSongs);
router.route('/searchCurrentSongs/:query').post(searchCurrentSongs);
module.exports = router;