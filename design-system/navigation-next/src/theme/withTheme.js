import React from 'react';

import { withTheme as WithEmotionTheme } from 'emotion-theming';

import { light } from './modes';

const withTheme = (defaultTheme) => {
  return (WrappedComponent) => {
    const WithTheme = WithEmotionTheme((props) => {
      const { theme: ctxTheme, ...rest } = props;
      const theme = Object.keys(ctxTheme).length > 0 ? ctxTheme : defaultTheme;
      return <WrappedComponent theme={theme} {...rest} />;
    });

    WithTheme.displayName = `WithTheme(${
      WrappedComponent.displayName || WrappedComponent.name || 'Component'
    })`;

    return WithTheme;
  };
};

const defaultContentTheme = { mode: light, context: 'container' };
const defaultGlobalTheme = { mode: light };

export const withContentTheme = (WrappedComponent) =>
  withTheme(defaultContentTheme)(WrappedComponent);

export const withGlobalTheme = (WrappedComponent) =>
  withTheme(defaultGlobalTheme)(WrappedComponent);

export default withTheme;
