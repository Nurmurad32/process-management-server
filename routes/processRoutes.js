const express = require('express');
const {
  createProcess,
  getAllProcesses,
  getSingleProcess,
  deleteProcess,
} = require('../controllers/processController');

const router = express.Router();

router.post('/create-process', createProcess);
router.get('/get-all', getAllProcesses);
router.get('/get-single/:id', getSingleProcess);
router.delete('/delete-process/:id', deleteProcess);

module.exports = router;
