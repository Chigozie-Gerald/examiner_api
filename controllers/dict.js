const axios = require(`axios`);

const process = (text) => {
  return text.split(`*****`);
};
exports.search = (req, res) => {
  const { text } = req.body;
  axios
    .get(`http://localhost:8080/search?name=${text}`, {
      'content-type': 'application/json',
    })
    .then((response) => {
      const text = response.data.content;
      if (text.length > 0) {
        const textFinal = process(text);
        textFinal.pop();
        res.send(textFinal);
      } else {
        res.send([]);
      }
    })
    .catch((err) => {
      res.status(400).send(`Something went wrong`);
    });
};
