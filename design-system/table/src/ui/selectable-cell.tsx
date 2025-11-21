import React, { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
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
export const SelectableCell = ({ children, as }: SelectableCellProps): React.JSX.Element => {
	return (
		<BaseCell as={as} xcss={spacingStyles}>
			{children}
		</BaseCell>
	);
};
