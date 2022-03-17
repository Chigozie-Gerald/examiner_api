let Question = require('../models/question');
let Tag = require('../models/tag');
var fs = require('fs');
var path = require('path');
const { errorObj } = require('../errorObject');
const { resolveSoa } = require('dns');

exports.postQuestion = (req, res) => {
  const { tag, title, details } = req.body;
  if (!tag || !title || !details) {
    res.status(400).send('Incomplete info');
    return;
  }

  let newQuestion = new Question({
    tag,
    title,
    details,
    imageAddress: req.file?.filename ? req.file?.filename : ``,
  });
  Tag.findOne({ _id: tag })
    .then((tag) => {
      if (tag) {
        tag.questions = tag.questions + 1;
        tag.save((err) => {
          if (err) {
            res.status(500).send('Something went wrong' + err);
          } else {
            newQuestion.save((err, saved) => {
              if (err) {
                res.status(500).send('Something went wrong' + err);
              } else {
                res.send(saved);
              }
            });
          }
        });
      } else {
        res.status(500).send({ msg: 'Tag provided does not exist' });
      }
    })
    .catch((err) => {
      res.status(500).send('Something went wrong' + err);
    });
};

exports.readQuestion = (req, res) => {
  const { _id } = req.body;
  Question.findOne({ _id })
    .populate('tag')
    .then((question) => {
      if (!question) {
        res.status(400).send({ msg: 'Oops! No such question found' });
        return;
      }
      res.send({ question });
    })
    .catch((err) => {
      res.status(500).send({
        msg: 'Something went wrong',
      });
    });
};

exports.readAllQuestion = (req, res) => {
  Question.find()
    .populate('tag')
    .then((questions) => {
      res.send({ questions });
    })
    .catch((err) => {
      res.status(500).send({
        msg: 'Something went wrong',
      });
    });
};

exports.editQuestion = (req, res) => {
  const { _id, tag, title, details, imageAdress } = req.body;
  if (!_id || !tag || !title || !details) {
    res.status(400).send('Incomplete info');
    return;
  }
  Question.findOne({ _id })
    .then((question) => {
      if (!question) {
        res.status(400).send({ msg: 'Oops! No such question found' });
        return;
      }
      question.tag = tag || question.tag;
      question.title = title || question.title;
      question.details = details || question.details;
      question.imageAdress = imageAdress || question.imageAddress;

      question.save((err, saved) => {
        if (err) {
          res.status(500).send({
            msg: 'Something went wrong1' + question,
          });
        } else {
          res.send(saved);
        }
      });
    })
    .catch((err) => {
      res.status(500).send({
        msg: 'Something went wrong' + err,
      });
    });
};

exports.deleteQuestion = (req, res) => {
  const { _id } = req.body;
  Question.findOneAndDelete({ _id })
    .then((data) => {
      try {
        if (data.imageAddress) {
          fs.unlinkSync(
            path.join(
              __dirname +
                '/.' +
                process.env.imageFolder +
                data.imageAddress,
            ),
          );
        }
        Tag.findById(data.tag)
          .then((tag) => {
            if (tag) {
              tag.questions = tag.questions - 1;
              tag.save((err) => {
                if (err) {
                  res.status(500).send({
                    msg: 'Something went wrong1',
                  });
                } else {
                  res.send(`success`);
                }
              });
            } else {
              res.status(500).send({
                msg: 'Something went wrong2',
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              msg: 'Something went wrong3',
            });
          });
      } catch (err) {
        res.status(500).send({
          msg: 'Something went wrong4',
          err: err.toString(),
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        msg: 'Something went wrong',
      });
    });
};
exports.deleteAllQuestion = (req, res) => {
  res.send(`Remove comments to delete questions`);
  /*Question.deleteMany()
    .then(() => res.send(`All Questions deleted`))
    .catch((err) => {
      res.status(500).send({
        msg: 'Something went wrong',
      });
    });*/
};

//Create, Edit, Delete, Read
exports.loadImage = (req, res) => {
  const { address } = req.params;
  if (!address) {
    res.status(500).send({
      msg: 'info incomplete',
    });
  } else {
    try {
      const newAddress = path.join(
        __dirname + '/.' + process.env.imageFolder + address,
      );
      const buffer = fs.readFileSync(path.join(newAddress));
      res.sendFile(newAddress);
    } catch (err) {
      res.status(400).send(err);
    }
  }
};
exports.filterImage = (req, res) => {
  Question.find({ imageAddress: new RegExp(/image/) })
    .select(`-details`)
    .then((data) => {
      fs.readdir(
        path.join(__dirname + '/.' + process.env.imageFolder),
        (err, arr) => {
          if (err) {
            res.status(400).send(`error`);
          } else {
            const img = [];
            if (arr.length > 0) {
              arr.forEach((add, num) => {
                Question.findOne({ imageAddress: add })
                  .then((qq) => {
                    if (qq) {
                      img.push(qq.imageAddress);
                    } else {
                      fs.unlinkSync(
                        path.join(
                          __dirname +
                            '/.' +
                            process.env.imageFolder +
                            add,
                        ),
                      );
                    }
                    if (num === arr.length - 1) {
                      res.send({
                        data,
                        img,
                        arr,
                        length: data.length,
                      });
                    }
                  })
                  .catch((err) => console.log(err));
              });
            } else {
              res.send(`No files in the specified directory`);
            }
          }
        },
      );
    })
    .catch(() => res.status(400).send(`something is wrong`));
};

exports.finder = (req, res) => {
  const { search, hasImage } = req.body;
  if (typeof search !== `string`) {
    res
      .status(500)
      .send(
        new errorObj(`Please make your search parameter a string`),
      );
    return;
  }
  const regSearch = new RegExp(search, `i`);
  const obj = { tags: [], questions: [] };
  Tag.find({ name: regSearch })
    .then((tags) => {
      obj.tags = tags;
      Question.find(
        hasImage
          ? {
              $and: [
                {
                  $or: [{ title: regSearch }, { details: regSearch }],
                },
                { imageAddress: new RegExp(/image/) },
              ],
            }
          : { $or: [{ title: regSearch }, { details: regSearch }] },
      )
        .populate('tag')
        .then((questions) => {
          obj.questions = questions;
          res.send(obj);
        })
        .catch((err) =>
          res
            .status(400)
            .send(
              new errorObj(
                err.toString(),
                `Something went wrong`,
                `Finder error`,
              ),
            ),
        );
    })
    .catch((err) =>
      res
        .status(500)
        .send(
          new errorObj(
            err.toString(),
            `Something went wrong`,
            `Finder error`,
          ),
        ),
    );
  /*
  Find tags that match
  Tags.find()
  Find questions with titles or bodies that match

  Combine them in the response
  {tags:[], question:[]}
  Find according to tag, title, details, has image

  The query would have a must have and good to have

  Combine is just combining tags
  */
};

exports.combine = (req, res) => {
  const { tagIds } = req.body;

  if (!Array.isArray(tagIds)) {
    res
      .status(500)
      .send(new errorObj(`Please pass an array as input`));
    return;
  }
  Question.find({ tag: { $in: tagIds } })
    .populate('tag')
    .then((questions) => {
      res.send({ questions, length: questions.length });
    })
    .catch((err) =>
      res.status(500).send(new errorObj(err.toString())),
    );
};
