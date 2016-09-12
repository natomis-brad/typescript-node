/// <reference path="../../typings.d.ts" />
import * as chai from "chai";
import MarkupController from "../../src/markups/markup-controller";
import {IMarkup} from "../../src/markups/markup";
import {IUser} from "../../src/users/user";
import * as Configs from "../../src/configurations";
import * as Server from "../../src/server";
import * as Database from "../../src/database";
import * as Utils from "../utils";

const configDb = Configs.getDatabaseConfig();
const database = Database.init(configDb);
const assert = chai.assert;
const serverConfig = Configs.getServerConfigs();
const server = Server.init(serverConfig, database);

describe("Markup Controller Tests", () => {

  beforeEach((done) => {
    Utils.createSeedMarkupData(database, done);
  });

  afterEach((done) => {
    Utils.clearDatabase(database, done);
  });

  it("Get Markups", (done) => {
    var user = Utils.createUserDummy();

    server.inject({
      method: 'POST',
      url: '/users/login',
      headers: {"zincode-api-key": "abc"},
      payload: {email: user.email, password: user.password}
    }, (res) => {
      assert.equal(200, res.statusCode);
      var login: any = JSON.parse(res.payload);

      server.inject({
        method: 'Get',
        url: '/markups',
        headers: {"authorization": login.token, "zincode-api-key": "abc"}
      }, (res) => {
        assert.equal(200, res.statusCode);
        var responseBody: Array<IMarkup> = JSON.parse(res.payload);
        assert.equal(3, responseBody.length);
        done();
      });
    });
  });

  it("Get single markup", (done) => {
    var user = Utils.createUserDummy();

    server.inject({
      method: 'POST',
      url: '/users/login',
      headers: {"zincode-api-key": "abc"},
      payload: {email: user.email, password: user.password}
    }, (res) => {
      assert.equal(200, res.statusCode);
      var login: any = JSON.parse(res.payload);

      database.markupModel.findOne({}).then((markup) => {
        server.inject({
          method: 'Get',
          url: '/markups/' + markup._id,
          headers: {"authorization": login.token, "zincode-api-key": "abc"}
        }, (res) => {
          assert.equal(200, res.statusCode);
          var responseBody: IMarkup = JSON.parse(res.payload);
          assert.equal(markup.name, responseBody.name);
          done();
        });
      });
    });
  });

  it("Get unauth single markup", (done) => {
    /*
    var user = Utils.createUserDummy();

    server.inject({
      method: 'POST',
      url: '/users/login',
      headers: {"zincode-api-key": "abc"},
      payload: {email: user.email, password: user.password}
    }, (res) => {
      assert.equal(200, res.statusCode);
      var login: any = JSON.parse(res.payload);
*/
      database.markupModel.findOne({}).then((markup) => {
        server.inject({
          method: 'Get',
          url: '/markups/' + markup._id,
          headers: {"zincode-api-key": "abc"}
        }, (res) => {
          assert.equal(200, res.statusCode);
          var responseBody: IMarkup = JSON.parse(res.payload);
          assert.equal(markup.name, responseBody.name);
          done();
        });
      });

  });

  it("Create Markup", (done) => {
    var user = Utils.createUserDummy();

    server.inject({
      method: 'POST',
      url: '/users/login',
      headers: {"zincode-api-key": "abc"},
      payload: {email: user.email, password: user.password}
    }, (res) => {
      assert.equal(200, res.statusCode);
      var login: any = JSON.parse(res.payload);
      var apiKey = res.request.headers["zincode-api-key"];
      database.userModel.findOne({email: user.email}).then((user: IUser) => {

        var markup ={
          content: "<div>What Content?</div>",
            name: "New Content",
          postUrl: "http://SomeCoolUrl.com"
        };

        server.inject({
          method: 'POST',
          url: '/markups',
          payload:markup,
          headers: {"authorization": login.token, "zincode-api-key": "abc"}
        }, (res) => {
          assert.equal(201, res.statusCode);
          var responseBody: IMarkup = <IMarkup>JSON.parse(res.payload);
          assert.equal(markup.name, responseBody.name);
          assert.equal(markup.content, responseBody.content);
          assert.equal(markup.postUrl, responseBody.postUrl);
          assert.equal(apiKey,responseBody.partnerId);
          done();
        });
      });
    });
  });

  it("Update markup", (done) => {
    var user = Utils.createUserDummy();

    server.inject({
      method: 'POST',
      url: '/users/login',
      headers: {"zincode-api-key": "abc"},
      payload: {email: user.email, password: user.password}
    }, (res) => {
      assert.equal(200, res.statusCode);
      var login: any = JSON.parse(res.payload);

      database.markupModel.findOne({}).then((markup) => {

        var updateMarkup = {
          name: markup.name,
          content: markup.content,
          postUrl: markup.postUrl
        };

        server.inject({
            method: 'PUT',
            url: '/markups/' + markup._id,
            payload: updateMarkup,
            headers: {"authorization": login.token, "zincode-api-key": "abc"}
          },
          (res) => {
            assert.equal(200, res.statusCode);
            console.log(res.payload);
            var responseBody: IMarkup = JSON.parse(res.payload);

            assert.equal(updateMarkup.content, responseBody.content);
            done();
          });
      });
    });
  });

  it("Delete single task", (done) => {
    var user = Utils.createUserDummy();

    server.inject({
      method: 'POST',
      url: '/users/login',
      headers: {"zincode-api-key": "abc"},
      payload: {email: user.email, password: user.password}
    }, (res) => {
      assert.equal(200, res.statusCode);
      var login: any = JSON.parse(res.payload);

      database.markupModel.findOne({}).then((markup) => {
        server.inject({
          method: 'DELETE',
          url: '/markups/' + markup._id,
          headers: {"authorization": login.token, "zincode-api-key": "abc"}
        }, (res) => {
          assert.equal(200, res.statusCode);
          var responseBody: IMarkup = JSON.parse(res.payload);
          assert.equal(markup.name, responseBody.name);

          database.taskModel.findById(responseBody._id).then((deletedTask) => {
            assert.isNull(deletedTask);
            done();
          });
        });
      });
    });
  });
});
