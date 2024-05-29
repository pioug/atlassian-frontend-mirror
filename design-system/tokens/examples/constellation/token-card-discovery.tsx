import React from 'react';

import token from '../../src/get-token';

import Card from './token-card-base';

const TokenDiscoveryCodeBlock = `// bold styles
color: token('color.text.inverse'),
backgroundColor: token('color.background.discovery.bold'),
border: \`1px solid \${token('color.border.discovery')}\`,
hoverBackgroundColor: token('color.background.discovery.bold.hovered'),
activeBackgroundColor: token('color.background.discovery.bold.pressed'),
iconColor: token('color.icon.inverse'),

// default styles
color: token('color.text'),
backgroundColor: token('color.background.discovery'),
border: \`1px solid \${token('color.border.discovery')}\`,
hoverBackgroundColor: token('color.background.discovery.hovered'),
activeBackgroundColor: token('color.background.discovery.pressed'),
iconColor: token('color.icon.discovery'),
`;

const discoveryStyles = {
  bold: {
    color: token('color.text.inverse', '#FFFFFF'),
    backgroundColor: token('color.background.discovery.bold', '#6E5DC6'),
    border: `1px solid ${token('color.border.discovery', '#8270DB')}`,
    hoverBackgroundColor: token(
      'color.background.discovery.bold.hovered',
      '#5E4DB2',
    ),
    activeBackgroundColor: token(
      'color.background.discovery.bold.pressed',
      '#352C63',
    ),
    iconColor: token('color.icon.inverse', '#FFFFFF'),
  },
  default: {
    color: token('color.text', '#172B4D'),
    backgroundColor: token('color.background.discovery', '#F3F0FF'),
    border: `1px solid ${token('color.border.discovery', '#8270DB')}`,
    hoverBackgroundColor: token(
      'color.background.discovery.hovered',
      '#DFD8FD',
    ),
    activeBackgroundColor: token(
      'color.background.discovery.pressed',
      '#B8ACF6',
    ),
    iconColor: token('color.icon.discovery', '#8270DB'),
  },
};

const TokenDiscovery = () => {
  return (
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
    <div style={{ display: 'flex', columnGap: '24px' }}>
      {Object.entries(discoveryStyles).map(([key, subStyle]) => (
        <Card key={key} tokenSet={subStyle} />
      ))}
    </div>
  );
};

export default { example: TokenDiscovery, code: TokenDiscoveryCodeBlock };
