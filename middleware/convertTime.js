const convertToBST = (date) => {
    return new Date(date).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
  };
  
  const convertProcessTimes = (process) => {
    if (process.creationTime) {
      process.creationTime = convertToBST(process.creationTime);
    }
    if (process.logs && Array.isArray(process.logs)) {
      process.logs = process.logs.map(log => convertToBST(log));
    }
    return process;
  };
  
  const convertTimeMiddleware = (req, res, next) => {
    res.originalJson = res.json;
    res.json = (data) => {
      if (Array.isArray(data)) {
        data = data.map(convertProcessTimes);
      } else {
        data = convertProcessTimes(data);
      }
      res.originalJson(data);
    };
    next();
  };
  
  module.exports = convertTimeMiddleware;
  