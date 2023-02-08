/** @jsx jsx */
import { jsx } from '@emotion/react';

import { CodeBlock } from '@atlaskit/code';

import { getTokenValue, token, useThemeObserver } from '../src';

const ExampleDiv = () => (
  <p
    style={{
      backgroundColor: token('color.background.accent.blue.subtle'),
      padding: 20,
    }}
  >
    Token used: <code>color.background.accent.blue.subtle</code>
  </p>
);

export default () => {
  const theme = useThemeObserver();

  const themeName = theme.colorMode === 'dark' ? theme.dark : theme.light;
  const themeString = JSON.stringify(theme);

  return (
    <div style={{ padding: '1em' }}>
      <h1>Current theme: {themeName}</h1>
      {theme && <CodeBlock language={'js'} text={themeString} />}
      <ExampleDiv />
      <p>
        <code>getTokenValue('color.background.accent.blue.subtle')</code> ={' '}
        {getTokenValue('color.background.accent.blue.subtle')}
      </p>
    </div>
  );
};
