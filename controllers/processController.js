// backend/controllers/processController.js
const { ObjectId } = require('mongodb');
const logger = require('../utils/logger');

const convertToBST = (date) => {
    return new Date(date).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
  };

exports.createProcess = async (req, res) => {
  const processCollection = req.processCollection;
  try {
    const creationTime = convertToBST(new Date());
    const process = {
      creationTime: creationTime,
      logs: [],
    };
    const result = await processCollection.insertOne(process);
    const processId = result.insertedId.toString();
    logger.startLogging(processId, processCollection);
    res.status(201).json({ p_id: processId, creation_time: creationTime });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProcesses = async (req, res) => {
  const processCollection = req.processCollection;
  try {
    // const processes = await processCollection.find().toArray();
    const processes = await processCollection.find({}, { projection: { _id: 1, creationTime: 1 } }).toArray();
    res.status(200).json(processes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSingleProcess = async (req, res) => {
  const processCollection = req.processCollection;
  try {
    const { id } = req.params;
    const process = await processCollection.findOne({ _id: new ObjectId(id) });
    if (!process) {
      return res.status(404).json({ message: 'Process not found' });
    }
    res.status(200).json(process);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProcess = async (req, res) => {
  const processCollection = req.processCollection;
  try {
    const { id } = req.params;
    const result = await processCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Process not found' });
    }
    logger.stopLogging(id);
    res.status(200).json({ message: 'Process deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
