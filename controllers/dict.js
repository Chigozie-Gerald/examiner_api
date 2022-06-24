const axios = require(`axios`);
const Question = require('../models/question');

const process = (text) => {
  return text.split(`*****`);
};
exports.search = async (req, res) => {
  try {
    const { text } = req.body;
    const added = await Question.findOne({ title: text });
    axios
      .get(`http://localhost:8080/search?name=${text}`, {
        'content-type': 'application/json',
      })
      .then((response) => {
        const text = response.data.content;
        if (text.length > 0) {
          const textFinal = process(text);
          textFinal.pop();
          res.send({ text: textFinal, added: !!added });
        } else {
          res.send([]);
        }
      })
      .catch((err) => {
        res
          .status(404)
          .send(
            `Something went wrong while fetching from the Java End point. Ensure the Server is running :: From Server`,
          );
      });
  } catch (e) {
    res.status(400).send(e.message + ` :: From Server`);
  }
};
