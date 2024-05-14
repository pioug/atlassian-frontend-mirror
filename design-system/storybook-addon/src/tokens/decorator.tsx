import React, { CSSProperties, Fragment, ReactNode } from 'react';

import { makeDecorator, useEffect } from '@storybook/addons';

import { setGlobalTheme, token } from '@atlaskit/tokens';

import { DECORATOR_ID, DECORATOR_PARAM } from './constants';
import { Themes } from './types';

const splitColumnStyles: CSSProperties = {
  position: 'absolute',
  boxSizing: 'border-box',
  width: '50vw',
  height: '100vh',
  overflow: 'auto',
  padding: '10px',
  background: token('elevation.surface'),
  color: token('color.text'),
};

const stackColumnStyles: CSSProperties = {
  position: 'absolute',
  boxSizing: 'border-box',
  width: '100%',
  height: '50%',
  overflow: 'auto',
  padding: '10px',
  background: token('elevation.surface'),
  color: token('color.text'),
};

const withDesignTokens = makeDecorator({
  name: DECORATOR_ID,
  parameterName: DECORATOR_PARAM,
  wrapper: (storyFn, context) => {
    const theme = (context.globals.adsTheme as Themes) || 'auto';

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      (async () => {
        switch (theme) {
          case 'light':
          case 'dark':
          case 'auto':
            await setGlobalTheme({
              colorMode: theme,
              spacing: 'spacing',
              shape: 'shape',
              typography: 'typography-minor3',
            });
            break;
          case 'split':
          case 'stack':
            await setGlobalTheme({
              colorMode: 'light',
              spacing: 'spacing',
              shape: 'shape',
              typography: 'typography-minor3',
            });

            document.documentElement
              .querySelectorAll('style[data-theme]')
              .forEach((el) => {
                const clone = el.cloneNode(true) as Element;
                clone.setAttribute(
                  'data-theme',
                  clone.getAttribute('data-theme') + '-clone',
                );
                // HACK: re-target theme selectors to split div containers
                clone.textContent = clone.textContent!.replace(/html\[/g, '[');
                document.head.append(clone);
              });

            break;
          case 'none':
            delete document.documentElement.dataset.theme;
            delete document.documentElement.dataset.colorMode;
            document.documentElement
              .querySelectorAll('style[data-theme]')
              .forEach((el) => el.remove());
            break;
          default:
            break;
        }
      })();
    }, [context.id, theme]);

    function renderStory() {
      const story = storyFn({
        ...context,
        globals: {
          ...context.globals,
          adsTheme: theme,
        },
      }) as ReactNode;

      if (theme === 'split' || theme === 'stack') {
        return (
          <Fragment>
            <div
              data-theme="light:light"
              data-color-mode="light"
              style={
                theme === 'split'
                  ? { ...splitColumnStyles, inset: '0px 50vw 0px 0px' }
                  : { ...stackColumnStyles, inset: '0px 0px 50% 0px' }
              }
            >
              {story}
            </div>
            <div
              data-theme="dark:dark"
              data-color-mode="dark"
              style={
                theme === 'split'
                  ? { ...splitColumnStyles, inset: '0px 0px 0px 50vw' }
                  : { ...stackColumnStyles, inset: '50% 0px 0px 0px' }
              }
            >
              {story}
            </div>
          </Fragment>
        );
      }

      return <div>{story}</div>;
    }

    return renderStory();
  },
});

export default withDesignTokens;
