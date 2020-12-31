const Joi = require('joi');

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = schema.validate(req.body);

      if (result.error) {
        return res.status(400).json(result.error);
      }

      if (!req.validated) { req.validated = {}; }
      req.validated['body'] = result.value;
      next();
    }
  },

  signUpSchema: Joi.object().keys({
    username: Joi.string().alphanum().min(4).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
    passwordConfirmation: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .label('Password confirmation')
      .messages({ 'any.only': '{{#label}} does not match password' })
  }),

  signInSchema: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required()
  }),
  
  ratingSchema: Joi.object().keys({
    movieID: Joi.number().required(),
    score: Joi.number().integer().min(1).max(10).required()
  }),

  updateRatingSchema: Joi.object().keys({
    ratingID: Joi.number().required(),
    newScore: Joi.number().integer().min(1).max(10).required()
  })
};