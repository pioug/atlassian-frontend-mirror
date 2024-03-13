import React from 'react';

import token from '../../src/get-token';

import Card from './token-card-base';

export const TokenSuccessCodeBlock = `// bold styles
color: token('color.text.inverse'),
backgroundColor: token('color.background.success.bold'),
border: \`1px solid \${token('color.border.success')}\`,
hoverBackgroundColor: token('color.background.success.bold.hovered'),
activeBackgroundColor: token('color.background.success.bold.pressed'),
iconColor: token('color.icon.inverse'),

// default styles
color: token('color.text'),
backgroundColor: token('color.background.success'),
border: \`1px solid \${token('color.border.success')}\`,
hoverBackgroundColor: token('color.background.success.hovered'),
activeBackgroundColor: token('color.background.success.pressed'),
iconColor: token('color.icon.success'),
`;

const successStyles = {
  bold: {
    color: token('color.text.inverse'),
    backgroundColor: token('color.background.success.bold'),
    border: `1px solid ${token('color.border.success')}`,
    hoverBackgroundColor: token('color.background.success.bold.hovered'),
    activeBackgroundColor: token('color.background.success.bold.pressed'),
    iconColor: token('color.icon.inverse'),
  },
  default: {
    color: token('color.text'),
    backgroundColor: token('color.background.success'),
    border: `1px solid ${token('color.border.success')}`,
    hoverBackgroundColor: token('color.background.success.hovered'),
    activeBackgroundColor: token('color.background.success.pressed'),
    iconColor: token('color.icon.success'),
  },
};

export const TokenSuccess = () => {
  return (
    <div style={{ display: 'flex', columnGap: '24px' }}>
      {Object.entries(successStyles).map(([key, subStyle]) => (
        <Card key={key} tokenSet={subStyle} />
      ))}
    </div>
  );
};

export default { example: TokenSuccess, code: TokenSuccessCodeBlock };
