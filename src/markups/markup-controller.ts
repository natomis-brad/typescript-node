import * as Hapi from "hapi";
import * as Boom from "boom";
import { IMarkup } from "./markup";
import { IDatabase } from "../database";
import { IServerConfigurations } from "../configurations";

export default class MarkupController {

    private database: IDatabase;
    private configs: IServerConfigurations;

    constructor(configs: IServerConfigurations, database: IDatabase) {
        this.configs = configs;
        this.database = database;
    }

    public createMarkup(request: Hapi.Request, reply: Hapi.IReply) {
        let userId = request.auth.credentials.id;
        var newMarkup: IMarkup = request.payload;
      newMarkup.userId = userId;
      newMarkup.partnerId = request.headers["zincode-api-key"];


        this.database.markupModel.create(newMarkup).then((markup) => {
            reply(markup).code(201);
        }).catch((error) => {
            reply(Boom.badImplementation(error));
        });
    }

    public updateMarkup(request: Hapi.Request, reply: Hapi.IReply) {
        let userId = request.auth.credentials.id;
        let id = request.params["id"];
        let markup: IMarkup = request.payload;

        this.database.markupModel.findByIdAndUpdate({ _id: id, userId: userId }, { $set: markup }, { new: true })
            .then((updatedMarkup: IMarkup) => {
                if (updatedMarkup) {
                    reply(updatedMarkup);
                } else {
                    reply(Boom.notFound());
                }
            }).catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }

    public deleteMarkup(request: Hapi.Request, reply: Hapi.IReply) {
        let id = request.params["id"];
        let userId = request.auth.credentials.id;

        this.database.markupModel.findOneAndRemove({ _id: id, userId: userId }).then((deletedTask: IMarkup) => {
            if (deletedTask) {
                reply(deletedTask);
            } else {
                reply(Boom.notFound());
            }
        }).catch((error) => {
            reply(Boom.badImplementation(error));
        });
    }

    public getMarkupById(request: Hapi.Request, reply: Hapi.IReply) {
     //   let userId = request.auth.credentials.id;
        let id = request.params["id"];
        let partnerId = request.headers["zincode-api-key"];

        this.database.markupModel.findOne({ _id: id, partnerId: partnerId }).lean(true).then((markup: IMarkup) => {
            if (markup) {
                reply(markup);
            } else {
                reply(Boom.notFound());
            }
        }).catch((error) => {
            reply(Boom.badImplementation(error));
        });
    }

    public getMarkups(request: Hapi.Request, reply: Hapi.IReply) {
        let userId = request.auth.credentials.id;
        let top = request.query.top;
        let skip = request.query.skip;

        this.database.markupModel.find({ userId: userId }).lean(true).skip(skip).limit(top).then((markups: Array<IMarkup>) => {
            reply(markups);
        }).catch((error) => {
            reply(Boom.badImplementation(error));
        });
    }
}
