import React, { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives';

import { BaseCell } from './base-cell';

const spacingStyles = xcss({
	width: 'size.200',
	padding: 'space.0',
});

type ExpandableCellProps = {
	as: 'td' | 'th';
	children?: ReactNode;
};

/**
 * __Expandable cell__
 *
 * An expandable cell primitive designed to be used for light weight composition.
 */
export const ExpandableCell = ({ children, as }: ExpandableCellProps): React.JSX.Element => {
	return (
		<BaseCell as={as} xcss={spacingStyles}>
			{children}
		</BaseCell>
	);
};
