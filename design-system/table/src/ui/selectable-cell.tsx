import React, { type ReactNode } from 'react';

import { xcss } from '@atlaskit/primitives';

import { BaseCell } from './base-cell';

const spacingStyles = xcss({
	width: '2rem',
	padding: 'space.0',
});

type SelectableCellProps = {
	as: 'td' | 'th';
	children?: ReactNode;
};

/**
 * __Selectable cell__
 *
 * A selectable cell primitive designed to be used for light weight composition.
 */
export const SelectableCell = ({ children, as }: SelectableCellProps) => {
	return (
		<BaseCell as={as} xcss={spacingStyles}>
			{children}
		</BaseCell>
	);
};
