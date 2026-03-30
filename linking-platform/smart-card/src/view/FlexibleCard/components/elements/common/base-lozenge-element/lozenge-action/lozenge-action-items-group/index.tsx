/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { token } from '@atlaskit/tokens';

import LozengeActionItem from '../lozenge-action-item';

import type { LozengeActionItemsGroupProps } from './types';

const dropdownItemGroupStyles = css({
	maxHeight: '300px',
	overflowY: 'auto',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	button: {
		paddingTop: token('space.075'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.075'),
		paddingLeft: token('space.150'),
		minHeight: '28px',
		width: '220px',
		'&:hover': {
			backgroundColor: 'inherit',
		},
		'&:focus, &:focus-visible': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
			boxSizing: 'border-box',
			boxShadow: `inset 2px 0 0 ${token('color.border.selected')}`,
			outline: 'none',
		},
	},
});

const LozengeActionItemsGroup = ({ items, testId, onClick }: LozengeActionItemsGroupProps) => (
	<span css={dropdownItemGroupStyles} data-testid={`${testId}-item-group`}>
		<DropdownItemGroup>
			{items.map((item, idx) => (
				<LozengeActionItem {...item} key={idx} onClick={onClick} testId={`${testId}-item-${idx}`} />
			))}
		</DropdownItemGroup>
	</span>
);

export default LozengeActionItemsGroup;
