// backend/utils/logger.js
const { ObjectId } = require('mongodb');

const activeLoggers = {};

const convertToBST = (date) => {
    return new Date(date).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
  };

const logTime = async (processId, processCollection) => {
  try {
    const logTime = convertToBST(new Date());
    console.log(`Logging time for processId: ${processId}`);
    await processCollection.updateOne(
      { _id: new ObjectId(processId) },
      { $push: { logs: logTime } }
    );
    console.log(`Logged time for processId: ${processId}`);
  } catch (error) {
    console.error(`Error logging time for processId: ${processId}`, error);
  }
};

const startLogging = (processId, processCollection) => {
  if (activeLoggers[processId]) return;
  activeLoggers[processId] = setInterval(() => logTime(processId, processCollection), 5000);
};

const stopLogging = (processId) => {
  clearInterval(activeLoggers[processId]);
  delete activeLoggers[processId];
};

module.exports = { startLogging, stopLogging };
