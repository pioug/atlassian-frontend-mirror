import React from 'react';

// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import { Example } from '../../../../../services/website-constellation/src/__DO_NOT_ADD_TO_THIS_FOLDER__/gatsby-theme-brisk/components/example/Example';
import token from '../../src/get-token';

import Card from './token-card-base';

const brandStylesCode = `// bold styles
color: token('color.text.inverse'),
backgroundColor: token('color.background.brand.bold'),
border: \`1px solid \${token('color.border.brand')}\`,
hoverBackgroundColor: token('color.background.brand.bold.hovered'),
activeBackgroundColor: token('color.background.brand.bold.pressed'),
iconColor: token('color.icon.inverse'),
`;

const brandStyles = {
  bold: {
    color: token('color.text.inverse', '#FFFFFF'),
    backgroundColor: token('color.background.brand.bold', '#0C66E4'),
    border: `1px solid ${token('color.border.brand', '#0C66E4')}`,
    hoverBackgroundColor: token(
      'color.background.brand.bold.hovered',
      '#0055CC',
    ),
    activeBackgroundColor: token(
      'color.background.brand.bold.pressed',
      '#09326C',
    ),
    iconColor: token('color.icon.inverse', '#FFFFFF'),
  },
};

const TokenBrand = () => {
  return (
    <div style={{ display: 'flex', columnGap: '24px' }}>
      {Object.entries(brandStyles).map(([key, subStyle]) => (
        <Card key={key} tokenSet={subStyle} />
      ))}
    </div>
  );
};

const TokenBrandExample = () => {
  return (
    <Example
      Component={TokenBrand}
      source={brandStylesCode}
      packageName="@atlaskit/tokens"
    />
  );
};

export default TokenBrandExample;
