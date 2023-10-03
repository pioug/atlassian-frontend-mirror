import React from 'react';

import { Example } from '@af/design-system-docs-ui';

import token from '../../src/get-token';

import Card from './token-card-base';

const selectedStylesCode = `// bold styles
color: token('color.text.inverse'),
backgroundColor: token('color.background.selected.bold'),
border: \`1px solid \${token('color.border.selected')}\`,
hoverBackgroundColor: token('color.background.selected.bold.hovered'),
activeBackgroundColor: token('color.background.selected.bold.pressed'),
iconColor: token('color.icon.inverse'),

// default styles
color: token('color.text'),
backgroundColor: token('color.background.selected'),
border: \`1px solid \${token('color.border.selected')}\`,
hoverBackgroundColor: token('color.background.selected.hovered'),
activeBackgroundColor: token('color.background.selected.pressed'),
iconColor: token('color.icon.selected'),
`;

const selectedStyles = {
  bold: {
    color: token('color.text.inverse', '#FFFFFF'),
    backgroundColor: token('color.background.selected.bold', '#0C66E4'),
    border: `1px solid ${token('color.border.selected', '#0C66E4')}`,
    hoverBackgroundColor: token(
      'color.background.selected.bold.hovered',
      '#0055CC',
    ),
    activeBackgroundColor: token(
      'color.background.selected.bold.pressed',
      '#09326C',
    ),
    iconColor: token('color.icon.inverse', '#FFFFFF'),
  },
  default: {
    color: token('color.text', '#172B4D'),
    backgroundColor: token('color.background.selected', '#E9F2FF'),
    border: `1px solid ${token('color.border.selected', '#0C66E4')}`,
    hoverBackgroundColor: token('color.background.selected.hovered', '#CCE0FF'),
    activeBackgroundColor: token(
      'color.background.selected.pressed',
      '#85B8FF',
    ),
    iconColor: token('color.icon.selected', '#0C66E4'),
  },
};

const TokenSelected = () => {
  return (
    <div style={{ display: 'flex', columnGap: '24px' }}>
      {Object.entries(selectedStyles).map(([key, subStyle]) => (
        <Card key={key} tokenSet={subStyle} />
      ))}
    </div>
  );
};

const TokenSelectedExample = () => {
  return (
    <Example
      Component={TokenSelected}
      source={selectedStylesCode}
      packageName="@atlaskit/tokens"
    />
  );
};

export default TokenSelectedExample;
