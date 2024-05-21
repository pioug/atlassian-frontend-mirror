import type { TableLayout } from '@atlaskit/adf-schema';

import type { AlignmentOptions } from '../types';

/**
 * Normalise table layout attribute an alignment value ('center' or 'align-start'), returns
 * center if layout equals a breakout value (e.g. 'default', 'wide', 'full-width')
 */
export const normaliseAlignment = (layout: TableLayout): AlignmentOptions =>
  layout === 'center' || layout === 'align-start' ? layout : 'center';
