import { ALIGN_START } from '../pm-plugins/utils/alignment';
import type { AlignmentOptions } from '../types';

const centerAlignStyle = { display: 'flex', justifyContent: 'center' };

const leftAlignStyle = { display: 'flex', justifyContent: 'flex-start' };

export const getAlignmentStyle = (alignment: AlignmentOptions) =>
	alignment === ALIGN_START ? leftAlignStyle : centerAlignStyle;
