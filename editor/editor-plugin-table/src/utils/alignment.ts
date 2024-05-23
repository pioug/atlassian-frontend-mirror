import type { TableLayout } from '@atlaskit/adf-schema';

import type { AlignmentOptions } from '../types';

export const ALIGN_START = 'align-start';
export const ALIGN_CENTER = 'center';

/**
 * Normalise table layout attribute an alignment value ('center' or 'align-start'), returns
 * center if layout equals a breakout value (e.g. 'default', 'wide', 'full-width')
 */
export const normaliseAlignment = (layout: TableLayout): AlignmentOptions =>
  layout === ALIGN_CENTER || layout === ALIGN_START ? layout : ALIGN_CENTER;
