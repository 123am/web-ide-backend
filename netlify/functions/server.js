const serverless = require('serverless-http');
const app = require('../../app'); // Adjust the path to where your app.js is located

module.exports.handler = async (event, context) => {
  try {
    console.log('Event:', event);
    console.log('Context:', context);

    const handler = serverless(app);
    const result = await handler(event, context);

    console.log('Result:', result);
    return result;
  } catch (err) {
    console.error('Error:', err); // Log the error for debugging
    return {
      statusCode: 500,
      body: JSON.stringify('Internal Server Error')
    };
  }
};
