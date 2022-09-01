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

/**
 * Forcefully retarget the token declarations to apply to our hacked class,
 * .ads-theme-override, for split and stack views.
 */
const hackThemeOverrideOnStyleElement = (
  style: HTMLStyleElement,
  theme: 'light' | 'dark',
) => {
  style.innerText = style.textContent!.replace(
    `html[data-theme="${theme}"]`,
    `html[data-theme="${theme}"],.ads-theme-override[data-theme="${theme}"]`,
  );
};

const withDesignTokens = makeDecorator({
  name: DECORATOR_ID,
  parameterName: DECORATOR_PARAM,
  wrapper: (storyFn, context) => {
    const theme = context.globals.adsTheme as Themes;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const adsThemes = ['light', 'dark'] as const;
      document.querySelectorAll('style').forEach((el) => {
        adsThemes.forEach((adsTheme) => {
          if (el.innerText.includes(`html[data-theme="${adsTheme}"] {`)) {
            hackThemeOverrideOnStyleElement(el, adsTheme);
          }
        });
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
