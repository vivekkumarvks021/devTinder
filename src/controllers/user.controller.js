const { success } = require("zod");
const {
  getPendingRequests,
  getConnections,
  getFeeds,
} = require("../services/connection-request.service");

const requestReceived = async (req, res) => {
  try {
    const { user } = req || {};
    const data = await getPendingRequests(user._id);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const connections = async (req, res) => {
  try {
    const { user } = req || {};
    const connection = await getConnections(user._id);
    res.json({
      success: true,
      connections: connection,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getFeed = async (req, res) => {
  try {
    const { user } = req || {};
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const feed = await getFeeds(user._id, skip, limit);
    res.json({
      success: true,
      feed,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = { requestReceived, connections, getFeed };
