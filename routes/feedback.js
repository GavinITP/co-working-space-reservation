const express = require('express');

const {getFeedback , getFeedbacks , updateFeedback , addFeedback , deleteFeedback}  =require('../controllers/feedback');

const {createFeedback} = require('../controllers/feedback');

const router = express.Router({mergeParams:true});

const protect = require("../middleware/auth");

router.route('/')
    .get(protect , getFeedback)
    .post(protect ,addFeedback);

router.route('/:id')
    .get(protect , getFeedback)
    .put(protect, updateFeedback)
    .delete(protect ,deleteFeedback);

// router.route('/').post(createFeedback);

module.exports = router;