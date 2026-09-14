import React from 'react';

import { TruncateRight as CompiledTruncateRight } from './TruncateRight-compiled';
import { type TruncateStyledProps } from './truncateTextTypes';

export const TruncateRight = (
	props: TruncateStyledProps &
		React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledTruncateRight {...props} />;
