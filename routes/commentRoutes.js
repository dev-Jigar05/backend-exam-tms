const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/:ticketId', commentController.addComment);
router.get('/:ticketId', commentController.getComments);
router.delete('/:id', commentController.deleteComment);

module.exports = router;
