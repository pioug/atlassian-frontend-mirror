import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';

export const renderer = {
  name: 'renderer',
  path: getExampleUrl('editor', 'editor-mobile-bridge', 'renderer'),
  placeholder: '#examples', // FIXME lets add something better to renderer
};
