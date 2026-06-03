/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactElement } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { SortAscendingIcon, SortDescendingIcon } from '@atlaskit/editor-toolbar';

import { SortOrder } from '../types';

const newIconWrapperStyles = cssMap({
	base: {
		width: '16px',
		height: '16px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		transition: 'transform 0.3s cubic-bezier(0.15, 1, 0.3, 1)',
		transformOrigin: '50% 50%',
	},
	inactive: {
		opacity: 0.7,
	},
});

type NewSortingIconProps = {
	sortOrdered?: SortOrder;
};

export const NewSortingIcon = ({ sortOrdered }: NewSortingIconProps): ReactElement => {
	return (
		<div
			css={[
				newIconWrapperStyles.base,
				sortOrdered === SortOrder.NO_ORDER && newIconWrapperStyles.inactive,
			]}
		>
			{sortOrdered === SortOrder.DESC ? (
				<SortAscendingIcon spacing="none" label="" />
			) : (
				<SortDescendingIcon spacing="none" label="" />
			)}
		</div>
	);
};
