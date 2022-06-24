const { errorObj } = require('../errorObject');
const Tag = require('../models/tag');
//const client = require('../index').client;
exports.postTag = (req, res) => {
  const { name } = req.body;

  if (!name) {
    res
      .status(400)
      .send(new errorObj('Incomplete info', 'TAG_CREATE_ERROR'));
    return;
  }

  Tag.findOne({ name })
    .then((tag) => {
      if (tag) {
        res
          .status(400)
          .send(
            new errorObj(
              'Tag already exists. Please provide a unique tag',
              'TAG_CREATE_ERROR',
            ),
          );
      } else {
        let newTag = new Tag({
          name,
          imageAddress: req.file?.filename ? req.file?.filename : ``,
        });

        newTag.save((err, saved) => {
          if (err) {
            res.status(500).send({ msg: 'Tag couldnt be created.' });
          } else {
            res.send(saved);
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ msg: 'Tag couldnt be created.' });
    });
};

exports.readAllTag = (req, res) => {
  Tag.find({})
    .then((tags) => {
      res.send({ tags });
    })
    .catch((err) => {
      res.status(500).send({
        msg: 'Something went wrong',
      });
    });
};

exports.readTag = (req, res) => {
  const { _id } = req.body;
  Tag.findOne({ _id })
    .then((tag) => {
      if (!tag) {
        res.status(400).send({ msg: 'Oops! No such tag found' });
        return;
      }
      res.send({ tag });
    })
    .catch((err) => {
      res.status(500).send({
        msg: 'Something went wrong',
      });
    });
};

exports.findTag = (req, res) => {
  const { search } = req.body;
  if (!search || typeof search !== `string`) {
    res
      .status(500)
      .send(new errorObj(`Something went wrong`, `Tag finder`));
    return;
  }
  const regExpText = new RegExp(search, `i`);
  Tag.find({ name: regExpText })
    .then((tag) => {
      res.send({ tag });
    })
    .catch((err) => {
      res.status(500).send({
        msg: 'Something went wrong',
      });
    });
};

exports.editTag = (req, res) => {
  const { _id, name } = req.body;
  if (!_id || !name) {
    res.status(400).send('Incomplete info');
    return;
  }
  Tag.findOne({ _id })
    .then((tag) => {
      if (!tag) {
        res.status(400).send({ msg: 'Oops! No such tag found' });
        return;
      }
      tag.name = name || tag.name;
      if (req.file?.filename) {
        tag.imageAddress = req.file?.filename;
      }

      tag.save((err, saved) => {
        if (err) {
          res.status(500).send({
            msg: 'Something went wrong',
          });
        } else {
          res.send(saved);
        }
      });
    })
    .catch((err) => {
      res.status(500).send({
        msg: 'Something went wrong',
      });
    });
};

exports.deleteTag = (req, res) => {
  const { _id } = req.body;
  Tag.findOne({ _id })
    .then((tag) => {
      if (tag.questions) {
        res.status(500).send({
          msg: 'That Tag has associated questions',
        });
      } else {
        Tag.deleteOne({ _id })
          .then(() => res.send('Success'))
          .catch((err) => {
            res.status(500).send({
              msg: 'Something went wrong',
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        msg: 'Something went wrong',
      });
    });
};
exports.deleteAllTag = (req, res) => {
  let { text } = req.body;
  text = text || 'mongo............\nn';
  /*client.write(text);
  client.on('data', (string) => {
    console.log(string.toString());
    client.end();
  });*/
  res.send(`Remove comments to delete tags`);
  /*Tag.deleteMany()
    .then(() => res.send(`All Tags deleted`))
    .catch((err) => {
      res.status(500).send({
        msg: 'Something went wrong',
      });
    });*/
};
//Create, Edit, Delete, Read
