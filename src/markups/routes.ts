import * as Hapi from "hapi";
import * as Joi from "joi";
import MarkupController from "./markup-controller";
import * as MarkupValidator from "./markup-validator";
import {jwtValidator} from "../markups/markup-validator";
import {IDatabase} from "../database";
import {IServerConfigurations} from "../configurations";

export default function (server: Hapi.Server, configs: IServerConfigurations, database: IDatabase) {

  const markupController = new MarkupController(configs, database);
  server.bind(markupController);

  server.route({
    method: 'GET',
    path: '/markups/{id}',
    config: {
      handler: markupController.getMarkupById,
      auth: false,
      tags: ['api', 'markups'],
      description: 'Get markup by id.',
      validate: {
        params: {
          id: Joi.string().required()
        }
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Markup founded.'
            },
            '404': {
              'description': 'Markup does not exists.'
            }
          }
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/markups',
    config: {
      handler: markupController.getMarkups,
      auth: "jwt",
      tags: ['api', 'markups'],
      description: 'Get all markups.',
      validate: {
        query: {
          top: Joi.number().default(5),
          skip: Joi.number().default(0)
        },
        headers: jwtValidator
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/markups/{id}',
    config: {
      handler: markupController.deleteMarkup,
      auth: "jwt",
      tags: ['api', 'markups'],
      description: 'Delete markup by id.',
      validate: {
        params: {
          id: Joi.string().required()
        },
        headers: jwtValidator
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Deleted Markup.',
            },
            '404': {
              'description': 'Markup does not exists.'
            }
          }
        }
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/markups/{id}',
    config: {
      handler: markupController.updateMarkup,
      auth: "jwt",
      tags: ['api', 'markups'],
      description: 'Update markup by id.',
      validate: {
        params: {
          id: Joi.string().required()
        },
        payload: MarkupValidator.updateMarkupModel,
        headers: jwtValidator
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Deleted Markup.',
            },
            '404': {
              'description': 'Markup does not exists.'
            }
          }
        }
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/markups',
    config: {
      handler: markupController.createMarkup,
      auth: "jwt",
      tags: ['api', 'markup'],
      description: 'Create a markup.',
      validate: {
        payload: MarkupValidator.createMarkupModel,
        headers: jwtValidator
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': {
              'description': 'Created Markup.'
            }
          }
        }
      }
    }
  });
}
