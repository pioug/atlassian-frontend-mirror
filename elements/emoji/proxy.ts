/**
 * Proxy options for webpack
 *
 * Reference: https://webpack.js.org/configuration/dev-server/#devserverproxy
 *
 * @example
 * localhost under root: yarn start emoji --proxy ./packages/elements/emoji/proxy.ts
 * staging under root: PROXY_TARGET_ENV=stg yarn start emoji --proxy ./packages/elements/emoji/proxy.ts
 * localhost under root: yarn start-dev
 * localhost under package: yarn start-stg
 *
 * @requires
 * local-config and .env: run `yarn run setup-first-time` to setup local-config.ts and .env (.env need to have credentials to get dev proxy working)
 * session cookie for staging: goes to https://id.stg.internal.atlassian.com/, copy value of cookie cloud.session.token.stg, and create same cookie under localhost domain. (cookie expiry is 1 month)
 */
import WebpackDevServer from 'webpack-dev-server';
import { config } from 'dotenv';
import path from 'path';

// load env in the package
config({ path: path.join(__dirname, '.env') });

// local emoji backend service API
// please run `yarn run setup-first-time` if you don't have .env and local-config.ts
const devConfig: WebpackDevServer.Configuration['proxy'] = {
  '/emoji': {
    target: process.env.PROXY_LOCALDEV_URL,
    changeOrigin: false,
    logLevel: 'debug',
    followRedirects: true,
    onProxyReq: (proxyReq) => {
      if (process.env.PROXY_LOCALDEV_ASAP_TOKEN) {
        proxyReq.setHeader(
          'Authorization',
          `Bearer ${process.env.PROXY_LOCALDEV_ASAP_TOKEN}`,
        );
        proxyReq.setHeader(
          'User-Context',
          process.env.PROXY_LOCALDEV_ASAP_TOKEN,
        );
      }
      proxyReq.setHeader('X-Slauth-User-Context-Account-Id', 'adminAccountId');
      proxyReq.setHeader('X-Slauth-Authorization', 'true');
      proxyReq.setHeader('X-Slauth-Principal', 'micros/edge-authenticator');
    },
  },
};

// staging emoji service
// please ensure you have copied session cookie from ddev/staging/prod instance to your localhost.
const overEdgeConfig: WebpackDevServer.Configuration['proxy'] = {
  '/emoji': {
    target: process.env.PROXY_OVEREDGE_URL,
    changeOrigin: true,
    logLevel: 'debug',
    followRedirects: true,
  },
};

// get proxy config based on target env, which was set from scripts via package.json
const getConfigByTargetEnvironment = () => {
  switch (process.env.PROXY_TARGET_ENV) {
    // for ddev/staging/prod instanses proxy
    case 'edge': {
      return overEdgeConfig;
    }
    default:
      // for local backend proxy
      return devConfig;
  }
};

const proxyConfig: WebpackDevServer.Configuration['proxy'] =
  getConfigByTargetEnvironment();

export default proxyConfig;
