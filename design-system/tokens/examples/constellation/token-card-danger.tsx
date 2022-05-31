import React from 'react';

// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import { Example } from '../../../../../services/website-constellation/src/__DO_NOT_ADD_TO_THIS_FOLDER__/gatsby-theme-brisk/components/example/Example';
import token from '../../src/get-token';

import Card from './token-card-base';

const dangerStylesCode = `// bold styles
color: token('color.text.inverse'),
backgroundColor: token('color.background.danger.bold'),
border: \`1px solid \${token('color.border.danger')}\`,
hoverBackgroundColor: token('color.background.danger.bold.hovered'),
activeBackgroundColor: token('color.background.danger.bold.pressed'),
iconColor: token('color.icon.inverse'),

// default styles
color: token('color.text.danger'),
backgroundColor: token('color.background.danger'),
border: \`1px solid \${token('color.border.danger')}\`,
hoverBackgroundColor: token('color.background.danger.hovered'),
activeBackgroundColor: token('color.background.danger.pressed'),
iconColor: token('color.icon.danger'),
`;

const dangerStyles = {
  bold: {
    color: token('color.text.inverse', '#FFFFFF'),
    backgroundColor: token('color.background.danger.bold', '#CA3521'),
    border: `1px solid ${token('color.border.danger', '#E34935')}`,
    hoverBackgroundColor: token(
      'color.background.danger.bold.hovered',
      '#AE2A19',
    ),
    activeBackgroundColor: token(
      'color.background.danger.bold.pressed',
      '#601E16',
    ),
    iconColor: token('color.icon.inverse', '#FFFFFF'),
  },
  default: {
    color: token('color.text.danger', '#AE2A19'),
    backgroundColor: token('color.background.danger', '#FFEDEB'),
    border: `1px solid ${token('color.border.danger', '#E34935')}`,
    hoverBackgroundColor: token('color.background.danger.hovered', '#FFD2CC'),
    activeBackgroundColor: token('color.background.danger.pressed', '#FF9C8F'),
    iconColor: token('color.icon.danger', '#E34935'),
  },
};

const TokenDanger = () => {
  return (
    <div style={{ display: 'flex', columnGap: '24px' }}>
      {Object.entries(dangerStyles).map(([key, subStyle]) => (
        <Card key={key} tokenSet={subStyle} />
      ))}
    </div>
  );
};

const TokenDangerExample = () => {
  return (
    <Example
      Component={TokenDanger}
      source={dangerStylesCode}
      packageName="@atlaskit/tokens"
    />
  );
};

export default TokenDangerExample;
