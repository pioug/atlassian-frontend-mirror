import type { AlignmentOptions } from '../types';
import { ALIGN_START } from '../utils/alignment';

const centerAlignStyle = { display: 'flex', justifyContent: 'center' };

const leftAlignStyle = { display: 'flex', justifyContent: 'flex-start' };

export const getAlignmentStyle = (alignment: AlignmentOptions) =>
	alignment === ALIGN_START ? leftAlignStyle : centerAlignStyle;
