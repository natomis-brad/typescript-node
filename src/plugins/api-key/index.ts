import { IPlugin, IPluginOptions } from "../interfaces";
import * as Hapi from "hapi";

export default (): IPlugin => {
    return {
        register: (server: Hapi.Server, options: IPluginOptions) => {
            const serverConfig = options.serverConfigs;


            server.register({
                register: require('hapi-api-key')
            }, (error) => {
                if (error) {
                    console.log('error', error);
                } else {
                    server.auth.strategy('api-key',
                      'api-key',
                      true,
                      serverConfig.apiKeys);
                }
            });
         // server.auth.default('api-key');
        },
        info: () => {
            return {
                name: "Hapi API Key",
                version: "1.1.0"
            };
        }
    };
};


