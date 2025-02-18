// import { Configuration } from 'openai';

const { OpenAIApi } = require("openai");

module.exports.configurationOpenAI = () => {
    return new OpenAIApi({
        apiKey: process.env.OPEN_AI_SECRETKEY,
    });
};
