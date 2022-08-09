/**
 * proxy options for webpack
 *
 * reference: https://webpack.js.org/configuration/dev-server/#devserverproxy
 * example for staging: yarn start emoji --proxy ./packages/elements/reactions/proxy.ts
 * example for localhost: REACTIONS_API_PROXY=http://localhost:6688 yarn start reactions --proxy ./packages/elements/reactions/proxy.ts
 */
import WebpackDevServer from 'webpack-dev-server';

const API_URL_STG = 'https://jdog.jira-dev.com/gateway/api/reactions';

const shouldChangeOrigin = () => {
  const target = process.env.REACTIONS_API_PROXY;
  if (target && target.includes('http://localhost')) {
    return false;
  }
  return true;
};

const proxyConfig: WebpackDevServer.Configuration['proxy'] = {
  '/reactions': {
    target: process.env.REACTIONS_API_PROXY || API_URL_STG,
    changeOrigin: shouldChangeOrigin(),
    logLevel: 'debug',
    followRedirects: true,
  },
};

export default proxyConfig;
