import React from 'react';
import { useThemeObserver } from '@atlaskit/tokens';

const withThemeObserverHOC = (Component: any) => {
  return (props: any) => {
    const theme = useThemeObserver();

    return <Component theme={theme} {...props} />;
  };
};

export default withThemeObserverHOC;
