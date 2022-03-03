/**
 * proxy options for webpack
 *
 * reference: https://webpack.js.org/configuration/dev-server/#devserverproxy
 * example for localhost: yarn start emoji --proxy ./packages/elements/reactions/proxy.ts
 * example for staging: REACTIONS_API_PROXY=https://jdog.jira-dev.com/gateway/api yarn start reactions --proxy ./packages/elements/reactions/proxy.ts
 */
import WebpackDevServer from 'webpack-dev-server';

const API_URL = 'http://localhost:6688';

const isTargetLocalhost = () => {
  const target = process.env.EMOJI_API_PROXY;
  if (target && target.includes('http://localhost')) {
    return false;
  }
  return true;
};

const proxyConfig: WebpackDevServer.Configuration['proxy'] = {
  '/reactions': {
    target: process.env.REACTIONS_API_PROXY || API_URL,
    changeOrigin: isTargetLocalhost(), // change origin for localhost will result in XSRF issue
    logLevel: 'debug',
  },
};

export default proxyConfig;
