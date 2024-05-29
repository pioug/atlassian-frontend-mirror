import React from 'react';

import token from '../../src/get-token';

import Card from './token-card-base';

export const TokenElevationCodeBlock = `// Sunken
label: 'Sunken',
backgroundColor: token('elevation.surface.sunken'),

// Default
label: 'Default',
backgroundColor: token('elevation.surface'),
border: \`1px solid \${token('color.border')}\`,

// Raised
backgroundColor: token('elevation.surface.raised'),
shadow: token('elevation.shadow.raised'),

// Overlay
backgroundColor: token('elevation.surface.overlay'),
shadow: token('elevation.shadow.overlay'),
`;

const elevationStyles = {
  sunken: {
    label: 'Sunken',
    backgroundColor: token('elevation.surface.sunken'),
    shadow: 'none',
  },
  default: {
    label: 'Default',
    border: `1px solid ${token('color.border')}`,
    backgroundColor: token('elevation.surface'),
    shadow: 'none',
  },
  raised: {
    label: 'Raised',
    backgroundColor: token('elevation.surface.raised'),
    shadow: token(
      'elevation.shadow.raised',
      '0px 1px 1px #091E4240, 0px 0px 1px #091E424F',
    ),
  },
  overlay: {
    label: 'Overlay',
    backgroundColor: token('elevation.surface.overlay'),
    shadow: token('elevation.shadow.overlay'),
  },
};

export const TokenElevation = () => {
  return (
    <div
      style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        display: 'flex',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        gap: '24px',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        flexWrap: 'wrap',
      }}
    >
      {Object.entries(elevationStyles).map(([key, subStyle]) => (
        <Card key={key} tokenSet={subStyle} />
      ))}
    </div>
  );
};

export default { example: TokenElevation, code: TokenElevationCodeBlock };
