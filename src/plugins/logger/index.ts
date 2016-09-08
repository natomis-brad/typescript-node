import { IPlugin } from "../interfaces";
import * as Hapi from "hapi";

export default (): IPlugin => {
    return {
        register: (server: Hapi.Server) => {
            const opts = {
              ops: {
                interval: 1000
              },
              reporters: {
                myConsoleReporter: [{
                  module: 'good-squeeze',
                  name: 'Squeeze',
                  args: [{error: '*', log: '*', response: '*', request: '*'}]
                }, {
                  module: 'good-console'
                }, 'stdout']

              }};

            server.register({
                register: require('good'),
                options: opts
            }, (error) => {
                if (error) {
                    console.log('error', error);
                }
            });
        },
        info: () => {
            return {
                name: "Good Logger",
                version: "7.0.2"
            };
        }
    };
};
