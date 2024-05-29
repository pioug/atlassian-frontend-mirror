import React from 'react';

import { Grid } from '@atlaskit/primitives';

import ExampleBox from '../shared/example-box';

export default function Basic() {
  return (
    <Grid
      testId="grid-basic"
      gap="space.200"
      templateAreas={[
        'navigation navigation navigation',
        'sidenav content content',
        'footer footer footer',
      ]}
    >
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
      <ExampleBox style={{ gridArea: 'navigation' }} />
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
      <ExampleBox style={{ gridArea: 'sidenav' }} />
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
      <ExampleBox style={{ gridArea: 'content' }} />
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
      <ExampleBox style={{ gridArea: 'footer' }} />
    </Grid>
  );
}
