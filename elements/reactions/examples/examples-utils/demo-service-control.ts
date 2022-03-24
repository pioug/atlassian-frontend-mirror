export const getReactionsConfig = () => {
  let reactionsConfig;
  try {
    // eslint-disable-next-line import/no-unresolved
    reactionsConfig = require('../../local-config')['default'];
  } catch (e) {
    reactionsConfig = require('../../local-config-example')['default'];
  }

  return reactionsConfig;
};
