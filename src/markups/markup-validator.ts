import * as Joi from "joi";

export const createMarkupModel = Joi.object().keys({
    name: Joi.string().required(),
  content: Joi.string().required(),
  postUrl: Joi.string().required()
});

export const updateMarkupModel = Joi.object().keys({
  name: Joi.string().required(),
  content: Joi.string().required(),
  postUrl: Joi.string().required()
});

export const jwtValidator = Joi.object({'authorization': Joi.string().required()}).unknown();
