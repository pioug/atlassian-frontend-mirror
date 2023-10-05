import React from 'react';

import token from '../../src/get-token';

import Card from './token-card-base';

const TokenInformationCodeBlock = `// bold styles
color: token('color.text.inverse'),
backgroundColor: token('color.background.information.bold'),
border: \`1px solid \${token('color.border.information')}\`,
hoverBackgroundColor: token('color.background.information.bold.hovered'),
activeBackgroundColor: token('color.background.information.bold.pressed'),
iconColor: token('color.icon.inverse'),

// default styles
color: token('color.text'),
backgroundColor: token('color.background.information'),
border: \`1px solid \${token('color.border.information')}\`,
hoverBackgroundColor: token('color.background.information.hovered'),
activeBackgroundColor: token('color.background.information.pressed'),
iconColor: token('color.icon.information'),
`;

const informationStyles = {
  bold: {
    color: token('color.text.inverse', '#FFFFFF'),
    backgroundColor: token('color.background.information.bold', '#0C66E4'),
    border: `1px solid ${token('color.border.information', '#E9F2FF')}`,
    hoverBackgroundColor: token(
      'color.background.information.bold.hovered',
      '#0055CC',
    ),
    activeBackgroundColor: token(
      'color.background.information.bold.pressed',
      '#09326C',
    ),
    iconColor: token('color.icon.inverse', '#FFFFFF'),
  },
  default: {
    color: token('color.text', '#172B4D'),
    backgroundColor: token('color.background.information', '#E9F2FF'),
    border: `1px solid ${token('color.border.information', '#1D7AFC')}`,
    hoverBackgroundColor: token(
      'color.background.information.hovered',
      '#CCE0FF',
    ),
    activeBackgroundColor: token(
      'color.background.information.pressed',
      '#85B8FF',
    ),
    iconColor: token('color.icon.information', '#1D7AFC'),
  },
};

const TokenInformation = () => {
  return (
    <div style={{ display: 'flex', columnGap: '24px' }}>
      {Object.entries(informationStyles).map(([key, subStyle]) => (
        <Card key={key} tokenSet={subStyle} />
      ))}
    </div>
  );
};

export default { example: TokenInformation, code: TokenInformationCodeBlock };
