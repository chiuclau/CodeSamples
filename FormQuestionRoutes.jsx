import { check } from 'express-validator';
import { FormQuestion, Form } from '../models';
import { ensureAdmin } from '../helper/auth';

export default (app) => {
  /* Returns all questions in specific form */
  app.get('/api/formquestion/:formId',
    [
      check('formId').isInt(),
    ],
    async (req, res) => {
      try {
        const question = await FormQuestion.findAll({
          where: {
            formId: req.params.formId,
          },
        });
        // empty list case
        // make sure form exists, then this
        const form = await Form.findByPk(req.params.formId);
        if (!form) {
          return res.sendStatus(404);
        }

        return res.status(200).send(question);
      } catch (err) {
        return res.status(400).send({ error: err.message });
      }
    });
  /* Adds formQuestion with the given parameters */
  // adding a question: checking to see if form exists to add question
  app.post(
    '/api/formquestion',
    [
      // same idea as req.body. etc but dif syntax
      ensureAdmin,
      check('formId').isInt(),
      check('question').isString(),
      check('responseType').isIn(['MULTIPLE_CHOICE', 'SHORT_ANSWER', 'LONG_ANSWER']),
    ],
    async (req, res) => {
      try {
        // find form from id input to see where to add question to
        const form = await Form.findByPk(req.body.formId);
        if (!form) {
          return res.status(400).send('Form does not exist.');
        }
        if (req.body.responseType === 'MULTIPLE_CHOICE') {
          if (!req.body.options) {
            return res.status(400).send('No options found for multiple choice questions.');
          }
          if (!req.body.options.every(i => (typeof i === 'string'))) {
            return res.status(400).send('No valid options found for multiple choice questions.');
          }
        } else {
          // assign options to null for short/long answer response types
          req.body.options = [];
        }

        let question = await FormQuestion.findOne({
          where: {
            question: req.body.question,
            responseType: req.body.responseType,
            formId: req.body.formId,
          },
        });

        if (question) {
          return res.status(400).send('Identical question already exists.');
        }

        question = await FormQuestion.create(
          {
            question: req.body.question,
            responseType: req.body.responseType,
            options: req.body.options,
            formId: req.body.formId,
          },
        );
        return res.status(200).send(question); // send back what was created
      } catch (err) {
        return res.status(400).send({ message: err.toString() });
      }
    },
  );
  // delete specific question: find the form the question is in first and then delete question
  app.delete('/api/formquestion/:id', ensureAdmin, async (req, res) => {
    try {
      const formquestion = await FormQuestion.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!formquestion) {
        return res.sendStatus(404);
      }

      await formquestion.destroy();
      return res.sendStatus(200);
    } catch (err) {
      return res.status(400).send({ error: err.message });
    }
  });

  // editing one
  app.put(
    '/api/formquestion',
    [
      ensureAdmin,
      check('id').isInt(),
      check('formId').isInt(),
      check('question').optional().isString(),
      check('responseType')
        .optional()
        .isIn(['MULTIPLE_CHOICE', 'SHORT_ANSWER', 'LONG_ANSWER']),
    ],

    async (req, res) => {
      try {
        if (req.body.responseType === 'MULTIPLE_CHOICE') {
          if (!req.body.options) {
            return res.status(400).send('No options found for multiple choice questions.');
          }
          if (!req.body.options.every(i => (typeof i === 'string'))) {
            return res.status(400).send('No valid options found for multiple choice questions.');
          }
        } else {
          // assign options to null for short/long answer response types
          req.body.options = [];
        }
        const formquestion = await FormQuestion.findOne({
          // requirement for finding formQuestion
          where: {
            formId: req.body.formId,
            id: req.body.id,
          },
        });
        if (!formquestion) {
          return res.sendStatus(404);
        }
        await formquestion.update(req.body); // update whatever you want to change

        return res.status(200).send(formquestion);
      } catch (err) {
        return res.status(400).send({ error: err.message });
      }
    },
  );
};