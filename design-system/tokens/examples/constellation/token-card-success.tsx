import React from 'react';

// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import { Example } from '../../../../../services/website-constellation/src/__DO_NOT_ADD_TO_THIS_FOLDER__/gatsby-theme-brisk/components/example/Example';
import token from '../../src/get-token';

import Card from './token-card-base';

const successStylesCode = `// bold styles
color: token('color.text.inverse'),
backgroundColor: token('color.background.success.bold'),
border: \`1px solid \${token('color.border.success')}\`,
hoverBackgroundColor: token('color.background.success.bold.hovered'),
activeBackgroundColor: token('color.background.success.bold.pressed'),
iconColor: token('color.icon.inverse'),

// default styles
color: token('color.text.success'),
backgroundColor: token('color.background.success'),
border: \`1px solid \${token('color.border.success')}\`,
hoverBackgroundColor: token('color.background.success.hovered'),
activeBackgroundColor: token('color.background.success.pressed'),
iconColor: token('color.icon.success'),
`;

const successStyles = {
  bold: {
    color: token('color.text.inverse', '#FFFFFF'),
    backgroundColor: token('color.background.success.bold', '#1F845A'),
    border: `1px solid ${token('color.border.success', '#22A06B')}`,
    hoverBackgroundColor: token(
      'color.background.success.bold.hovered',
      '#216E4E',
    ),
    activeBackgroundColor: token(
      'color.background.success.bold.pressed',
      '#164B35',
    ),
    iconColor: token('color.icon.inverse', '#FFFFFF'),
  },
  default: {
    color: token('color.text.success', '#216E4E'),
    backgroundColor: token('color.background.success', '#DFFCF0'),
    border: `1px solid ${token('color.border.success', '#22A06B')}`,
    hoverBackgroundColor: token('color.background.success.hovered', '#BAF3DB'),
    activeBackgroundColor: token('color.background.success.pressed', '#7EE2B8'),
    iconColor: token('color.icon.success', '#22A06B'),
  },
};

const TokenSuccess = () => {
  return (
    <div style={{ display: 'flex', columnGap: '24px' }}>
      {Object.entries(successStyles).map(([key, subStyle]) => (
        <Card key={key} tokenSet={subStyle} />
      ))}
    </div>
  );
};

const TokenSuccessExample = () => {
  return (
    <Example
      Component={TokenSuccess}
      source={successStylesCode}
      packageName="@atlaskit/tokens"
    />
  );
};

export default TokenSuccessExample;
