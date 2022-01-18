import { addons, makeDecorator, useEffect } from '@storybook/addons';

// // eslint-disable-next-line
// import '../../../node_modules/@atlaskit/tokens/css/atlassian-light.css';
// // eslint-disable-next-line
// import '../../../node_modules/@atlaskit/tokens/css/atlassian-dark.css';

import {
  DECORATOR_ID,
  DECORATOR_PARAM,
  EVENT_THEME_CHANGED,
} from './constants';

const withDesignTokens = makeDecorator({
  name: DECORATOR_ID,
  parameterName: DECORATOR_PARAM,
  wrapper: (storyFn, context) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const setTheme = (theme: 'light' | 'dark' | 'none') => {
        if (!theme || theme === 'none') {
          delete document.documentElement.dataset.theme;
          return;
        }

        // HACK: Allows us to disable the light mode style since it uses root:
        if (theme === 'light') {
          document.querySelectorAll('style').forEach((el) => {
            if (el.innerText.includes(':root, html[data-theme="light"]')) {
              el.innerText = el.textContent!.replace(':root,', '');
            }
          });
        }

        document.documentElement.dataset.theme = theme;
      };

      const channel = addons.getChannel();
      channel.on(EVENT_THEME_CHANGED, setTheme);

      return () => {
        channel.off(EVENT_THEME_CHANGED, setTheme);
      };
    }, [context.id]);

    return storyFn(context);
  },
});

export default withDesignTokens;
