import React from 'react';

import { TruncateLeft as CompiledTruncateLeft } from './TruncateLeft-compiled';
import { type TruncateStyledProps } from './truncateTextTypes';

export const TruncateLeft = (
	props: TruncateStyledProps &
		React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledTruncateLeft {...props} />;
