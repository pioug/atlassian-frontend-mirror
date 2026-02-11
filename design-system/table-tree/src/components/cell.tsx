import React, { type ReactNode } from 'react';

import { token } from '@atlaskit/tokens';

import CommonCell from './internal/common-cell';
import OverflowContainer from './internal/overflow-container';
import withColumnWidth from './internal/with-column-width';

export interface CellProps {
	/**
	 * Sets whether the cell contents should wrap or display on a single line and be truncated. For accessibility reasons, wrapping the content is strongly recommended.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	singleLine?: boolean;
	/**
	 * Sets the indent level for the cell. Each indent level adds `25px` to the left padding.
	 */
	indentLevel?: number;
	/**
	 * The width of the header item. Takes a string, or a number representing the width in pixels.
	 */
	width?: number | string;
	/**
	 * Class name to apply to the cell.
	 */
	className?: string;
	/**
	 * Children content, used when composing a table tree from internal components
	 */
	children?: ReactNode;
}

const CellComponent = ({
	children,
	singleLine,
	indentLevel,
	width,
	className,
	...props
}: CellProps) => (
	<CommonCell
		indent={indentLevel ? `calc(${token('space.300', '25px')} * ${indentLevel})` : undefined}
		width={width}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={className}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
	>
		<OverflowContainer isSingleLine={singleLine}>{children}</OverflowContainer>
	</CommonCell>
);

const Cell: (props: CellProps & import("..").CellWithColumnWidthProps) => React.JSX.Element = withColumnWidth(CellComponent);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Cell;
