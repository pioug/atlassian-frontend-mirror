/**
 * proxy options for webpack
 *
 * reference: https://webpack.js.org/configuration/dev-server/#devserverproxy
 * example for localhost: yarn start emoji --proxy ./packages/elements/emoji/proxy.ts
 * example for staging: EMOJI_API_PROXY=https://pug.jira-dev.com/gateway/api yarn start emoji --proxy ./packages/elements/emoji/proxy.ts
 */
import WebpackDevServer from 'webpack-dev-server';

const EMOJI_API_URL = 'http://localhost:7788';

const isTargetLocalhost = () => {
  const target = process.env.EMOJI_API_PROXY;
  if (target && target.includes('http://localhost')) {
    return false;
  }
  return true;
};

const proxyConfig: WebpackDevServer.Configuration['proxy'] = {
  '/emoji': {
    target: process.env.EMOJI_API_PROXY || EMOJI_API_URL,
    changeOrigin: isTargetLocalhost(), // change origin for localhost will result in XSRF issue
    logLevel: 'debug',
  },
};

export default proxyConfig;
