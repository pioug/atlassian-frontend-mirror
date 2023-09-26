// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { snapshot } from '@af/visual-regression';

import BasicAvatar from '../../../examples/01-basicAvatar';

snapshot(BasicAvatar, {
  drawsOutsideBounds: true,
});

snapshot(BasicAvatar, {
  description: 'tooltip on hover',
  states: [{ state: 'hovered', selector: { byTestId: 'avatar' } }],
  drawsOutsideBounds: true,
});
