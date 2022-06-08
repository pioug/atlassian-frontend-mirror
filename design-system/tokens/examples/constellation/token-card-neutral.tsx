import React from 'react';

// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import { Example } from '../../../../../services/website-constellation/src/__DO_NOT_ADD_TO_THIS_FOLDER__/gatsby-theme-brisk/components/example/Example';
import token from '../../src/get-token';

import Card from './token-card-base';

const neutralStylesCode = `// bold styles
color: token('color.text.inverse'),
backgroundColor: token('color.background.neutral.bold'),
border: \`1px solid \${token('color.border')}\`,
hoverBackgroundColor: token('color.background.neutral.bold.hovered'),
activeBackgroundColor: token('color.background.neutral.bold.pressed'),
iconColor: token('color.icon.inverse'),

// default styles
color: token('color.text'),
backgroundColor: token('color.background.neutral'),
border: \`1px solid \${token('color.border')}\`,
hoverBackgroundColor: token('color.background.neutral.hovered'),
activeBackgroundColor: token('color.background.neutral.pressed'),
iconColor: token('color.icon'),

// subtle styles
color: token('color.text'),
backgroundColor: token('color.background.neutral.subtle'),
border: \`1px solid \${token('color.border')}\`,
hoverBackgroundColor: token('color.background.neutral.subtle.hovered'),
activeBackgroundColor: token('color.background.neutral.subtle.pressed'),
iconColor: token('color.icon'),
`;

const neutralStyles = {
  bold: {
    color: token('color.text.inverse', '#FFFFFF'),
    backgroundColor: token('color.background.neutral.bold', '#44546F'),
    border: `1px solid ${token('color.border', '#091E4224')}`,
    hoverBackgroundColor: token(
      'color.background.neutral.bold.hovered',
      '#2C3E5D',
    ),
    activeBackgroundColor: token(
      'color.background.neutral.bold.pressed',
      '#172B4D',
    ),
    iconColor: token('color.icon.inverse', '#FFFFFF'),
  },
  default: {
    color: token('color.text', '#172B4D'),
    backgroundColor: token('color.background.neutral', '#091E420F'),
    border: `1px solid ${token('color.border', '#091E4224')}`,
    hoverBackgroundColor: token(
      'color.background.neutral.hovered',
      '#091E4224',
    ),
    activeBackgroundColor: token(
      'color.background.neutral.pressed',
      '#091E424F',
    ),
    iconColor: token('color.icon', '#44546F'),
  },
  subtle: {
    color: token('color.text', '#172B4D'),
    backgroundColor: token('color.background.neutral.subtle', '#00000000'),
    border: `1px solid ${token('color.border', '#091E4224')}`,
    hoverBackgroundColor: token(
      'color.background.neutral.subtle.hovered',
      '#091E420F',
    ),
    activeBackgroundColor: token(
      'color.background.neutral.subtle.pressed',
      '#091E4224',
    ),
    iconColor: token('color.icon', '#44546F'),
  },
};

const TokenNeutral = () => {
  return (
    <div style={{ display: 'flex', columnGap: '24px' }}>
      {Object.entries(neutralStyles).map(([key, subStyle]) => (
        <Card key={key} tokenSet={subStyle} />
      ))}
    </div>
  );
};

const TokenNeutralExample = () => {
  return (
    <Example
      Component={TokenNeutral}
      source={neutralStylesCode}
      packageName="@atlaskit/tokens"
    />
  );
};

export default TokenNeutralExample;
