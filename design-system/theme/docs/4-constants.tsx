import React from 'react';
import { md, code, Example } from '@atlaskit/docs';

export default md`
  ### Layers

  These are fixed values to use for layering elements with \`z-index\`.

  ${code`
import { layers } from '@atlaskit/theme';

// layers properties return a number.
() => <div style={{ zIndex: layers.card() }} />
  `}

  ${(
    <Example
      packageName="@atlaskit/theme"
      Component={require('../examples/layers').default}
      source={require('!!raw-loader!../examples/layers')}
      title="Definitions"
    />
  )}

  ### Border radius

  When wanting to add some rounding to an elements edges,
  use this.

${code`
import { borderRadius } from '@atlaskit/theme';

// borderRadius returns a number.
() => <div style={{ borderRadius: borderRadius() />
`}

  ### Grid size

  Grid unit that should be used for all sizing calculations.
  Refer to the [design documentation](https://atlassian.design/guidelines/product/foundations/grid) for more information.

${code`
import { gridSize } from '@atlaskit/theme';

// gridSize returns a number.
() => <div style={{ width: gridSize() * 10 />
`}
`;
