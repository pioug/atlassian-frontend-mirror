/** @jsx jsx */
import { jsx } from '@emotion/react';

import GridCards from './01-grid-cards';

export default () =>
  ([undefined, 'wide', 'narrow'] as const).map((maxWidth) => (
    <div>
      <hr />
      <h3>{maxWidth}:</h3>

      <GridCards maxWidth={maxWidth} />
    </div>
  ));
