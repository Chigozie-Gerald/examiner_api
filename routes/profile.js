var express = require('express');
var router = express.Router();

var question = require('../controllers/question');
var tag = require('../controllers/tag');
var dict = require('../controllers/dict');
const { upload } = require('../multer');

//Profiles, Register 16
router.post(
  '/questionCreate',
  upload.single('image'),
  question.postQuestion,
);
router.get('/filterImage', question.filterImage);
router.post('/finder', question.finder);
router.post('/combine', question.combine);
router.get('/questionReadAll', question.readAllQuestion);
router.get('/loadImage/:address', question.loadImage);
router.post('/questionRead', question.readQuestion);
router.post(
  '/questionEdit',
  upload.single('image'),
  question.editQuestion,
);
router.post('/questionDelete', question.deleteQuestion);
router.get('/questionAllDelete', question.deleteAllQuestion);

//Profiles, Register 16
router.post('/tag', tag.postTag);
router.get('/tagReadAll', tag.readAllTag);
router.post('/findTag', tag.findTag);
router.post('/tagRead', tag.readTag);
router.post('/tagEdit', tag.editTag);
router.post('/tagDelete', tag.deleteTag);
router.post('/tagAllDelete', tag.deleteAllTag);

//Dictionary
router.post('/dictSearch', dict.search);

module.exports = router;
