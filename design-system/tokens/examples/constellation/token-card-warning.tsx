import React from 'react';

// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import { Example } from '../../../../../services/website-constellation/src/__DO_NOT_ADD_TO_THIS_FOLDER__/gatsby-theme-brisk/components/example/Example';
import token from '../../src/get-token';

import Card from './token-card-base';

const warningStylesCode = `// bold styles
color: token('color.text.warning.inverse'),
backgroundColor: token('color.background.warning.bold'),
border: \`1px solid \${token('color.border.warning')}\`,
hoverBackgroundColor: token('color.background.warning.bold.hovered'),
activeBackgroundColor: token('color.background.warning.bold.pressed'),
iconColor: token('color.icon.warning.inverse'),

// default styles
color: token('color.text.warning'),
backgroundColor: token('color.background.warning'),
border: \`1px solid \${token('color.border.warning')}\`,
hoverBackgroundColor: token('color.background.warning.hovered'),
activeBackgroundColor: token('color.background.warning.pressed'),
iconColor: token('color.icon.warning'),
`;

const warningStyles = {
  bold: {
    color: token('color.text.warning.inverse', '#FFFFFF'),
    backgroundColor: token('color.background.warning.bold', '#E2B203'),
    border: `1px solid ${token('color.border.warning', '#D97008')}`,
    hoverBackgroundColor: token(
      'color.background.warning.bold.hovered',
      '#CF9F02',
    ),
    activeBackgroundColor: token(
      'color.background.warning.bold.pressed',
      '#B38600',
    ),
    iconColor: token('color.icon.warning.inverse', '#FFFFFF'),
  },
  default: {
    color: token('color.text.warning', '#974F0C'),
    backgroundColor: token('color.background.warning', '#FFF7D6'),
    border: `1px solid ${token('color.border.warning', '#D97008')}`,
    hoverBackgroundColor: token('color.background.warning.hovered', '#F8E6A0'),
    activeBackgroundColor: token('color.background.warning.pressed', '#F5CD47'),
    iconColor: token('color.icon.warning', '#D97008'),
  },
};

const TokenWarning = () => {
  return (
    <div style={{ display: 'flex', columnGap: '24px' }}>
      {Object.entries(warningStyles).map(([key, subStyle]) => (
        <Card key={key} tokenSet={subStyle} />
      ))}
    </div>
  );
};

const TokenWarningExample = () => {
  return (
    <Example
      Component={TokenWarning}
      source={warningStylesCode}
      packageName="@atlaskit/tokens"
    />
  );
};

export default TokenWarningExample;
