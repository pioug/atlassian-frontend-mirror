import React from 'react';
import { Example } from '@atlaskit/docs';
import { colors } from '@atlaskit/theme';

/**
 * Load an example in an iframe
 */
export const IframeExample = ({ source, title, url }) => (
  <Example
    packageName="@atlaskit/global-navigation"
    Component={() => (
      <iframe
        src={url}
        style={{
          border: 0,
          height: '500px',
          overflow: 'hidden',
          width: '100%',
        }}
        title={title}
      />
    )}
    source={source}
    title={title}
  />
);

/**
 * Horizontal rule
 */
export const Hr = () => (
  <hr
    css={{
      backgroundColor: colors.N40,
      border: 0,
      height: 2,
      marginBottom: '3em',
      marginTop: '3em',
    }}
  />
);
