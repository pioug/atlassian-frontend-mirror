import React, { CSSProperties, Fragment, ReactNode } from 'react';

import { makeDecorator, useEffect } from '@storybook/addons';

import { token } from '@atlaskit/tokens';

import '@atlaskit/tokens/css/atlassian-light.css';
import '@atlaskit/tokens/css/atlassian-dark.css';

import { DECORATOR_ID, DECORATOR_PARAM } from './constants';
import { Themes } from './types';

const splitColumnStyles: CSSProperties = {
  position: 'absolute',
  boxSizing: 'border-box',
  width: '50vw',
  height: '100vh',
  overflow: 'auto',
  padding: '10px',
  background: token('color.background.default'),
  color: token('color.text.highEmphasis'),
};

const stackColumnStyles: CSSProperties = {
  position: 'absolute',
  boxSizing: 'border-box',
  width: '100%',
  height: '50%',
  overflow: 'auto',
  padding: '10px',
  background: token('color.background.default'),
  color: token('color.text.highEmphasis'),
};

const withDesignTokens = makeDecorator({
  name: DECORATOR_ID,
  parameterName: DECORATOR_PARAM,
  wrapper: (storyFn, context) => {
    const theme = context.globals.adsTheme as Themes;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      document.querySelectorAll('style').forEach((el) => {
        if (el.innerText.includes(':root, html[data-theme="light"]')) {
          // HACK: Allows us to disable the light mode style since it uses root:
          el.innerText = el.textContent!.replace(':root,', '');

          // HACK: Allows us to apply the theme to children elements
          el.innerText = el.textContent!.replace(
            'html[data-theme="light"]',
            'html[data-theme="light"],.ads-theme-override[data-theme="light"]',
          );
        }
      });
      document.querySelectorAll('style').forEach((el) => {
        if (el.innerText.includes('html[data-theme="dark"]')) {
          // HACK: Allows us to apply the theme to children elements
          el.innerText = el.textContent!.replace(
            'html[data-theme="dark"]',
            'html[data-theme="dark"],.ads-theme-override[data-theme="dark"]',
          );
        }
      });
    }, [context.id]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!theme || theme === 'none') {
        delete document.documentElement.dataset.theme;
        return;
      }

      document.documentElement.dataset.theme = theme;
    }, [context.id, theme]);

    function renderStory() {
      const story = storyFn(context) as ReactNode;

      switch (theme) {
        case 'split': {
          return (
            <Fragment>
              <div
                className="ads-theme-override"
                data-theme="light"
                style={{ ...splitColumnStyles, inset: '0px 50vw 0px 0px' }}
              >
                {story}
              </div>
              <div
                className="ads-theme-override"
                data-theme="dark"
                style={{ ...splitColumnStyles, inset: '0px 0px 0px 50vw' }}
              >
                {story}
              </div>
            </Fragment>
          );
        }
        case 'stack': {
          return (
            <Fragment>
              <div
                className="ads-theme-override"
                data-theme="light"
                style={{ ...stackColumnStyles, inset: '0px 0px 50% 0px' }}
              >
                {story}
              </div>
              <div
                className="ads-theme-override"
                data-theme="dark"
                style={{ ...stackColumnStyles, inset: '50% 0px 0px 0px' }}
              >
                {story}
              </div>
            </Fragment>
          );
        }
        default: {
          return <div data-theme={theme}>{story}</div>;
        }
      }
    }

    return renderStory();
  },
});

export default withDesignTokens;
