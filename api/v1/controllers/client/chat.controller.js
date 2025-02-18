// const { OpenAIApi } = require("openai");
const { OpenAI } = require("openai");
const { configurationOpenAI } = require("../../../../config/configOpenAI");
const UserModel = require("../../models/users.model");

module.exports.postMessage = async (req, res) => {
    console.log(req.body)
    try {
        const message = req.body.message;
        const tokenUser = req.cookies.tokenUser;

        if (!message || typeof message !== "string") {
            return res.status(400).json({ message: "Nội dung không hợp lệ" });
        }

        const user = await UserModel.findOne({ token: tokenUser });
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        const chats = user.chat.map(({ role, content }) => ({ role, content }));
        chats.push({ content: message, role: "user" });

        user.chat.push({ content: message, role: "user" });

        const openai = new OpenAI({
            apiKey: process.env.OPEN_AI_SECRETKEY,
        });

        const chatResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: chats,
        });

        const assistantMessage = chatResponse.choices[0].message.content;
        user.chat.push({ content: assistantMessage, role: "assistant" });

        await user.save();
        res.json({
            status: 200,
            message: "Thành công",
            response: assistantMessage,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};