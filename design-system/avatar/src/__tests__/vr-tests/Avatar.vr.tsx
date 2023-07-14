// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { snapshot } from '@af/visual-regression';

import BasicAvatar from '../../../examples/01-basicAvatar';

snapshot(BasicAvatar, {
  drawsOutsideBounds: true,
});
