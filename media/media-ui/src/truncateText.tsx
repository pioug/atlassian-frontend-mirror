import React from 'react';
import {
	Truncate as CompiledTruncate,
	TruncateLeft as CompiledTruncateLeft,
	TruncateRight as CompiledTruncateRight,
	type TruncateStyledProps,
} from './truncateText-compiled';

export const Truncate: typeof CompiledTruncate = (props) =>
	(<CompiledTruncate {...props} />);

export const TruncateLeft = (
	props: TruncateStyledProps &
		React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
) =>
	(<CompiledTruncateLeft {...props} />);

export const TruncateRight = (
	props: TruncateStyledProps &
		React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
) =>
	(<CompiledTruncateRight {...props} />);

export { calculateTruncation } from './truncateText-compiled';

export type { TruncateStyledProps, TruncateProps, TruncateOutput } from './truncateText-compiled';
