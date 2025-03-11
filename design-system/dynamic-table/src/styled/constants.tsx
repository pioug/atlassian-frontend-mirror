import { type ReactNode, type Ref } from 'react';

const CSS_VAR_WIDTH = '--local-dynamic-table-width';

export interface TruncateStyleProps {
	width?: number;
	isFixedSize?: boolean;
	shouldTruncate?: boolean;
	children?: ReactNode;
	testId?: string;
	innerRef?: Ref<HTMLTableCellElement | HTMLTableRowElement> | undefined;
	className?: string;
}

export const getTruncationStyleVars = ({ width }: TruncateStyleProps) =>
	typeof width !== 'undefined' ? { [CSS_VAR_WIDTH]: `${width}%` } : undefined;
