/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import LozengeActionItem from '../lozenge-action-item';

import LozengeActionItemsGroupOld from './LozengeActionItemsGroupOld';
import type { LozengeActionItemsGroupProps } from './types';

const dropdownItemGroupStyles = css({
	maxHeight: '300px',
	overflowY: 'auto',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	button: {
		padding: `${token('space.075', '6px')} ${token('space.150', '12px')}`,
		minHeight: '28px',
		width: '220px',
		'&:hover': {
			backgroundColor: 'inherit',
		},
		'&:focus, &:focus-visible': {
			backgroundColor: token('color.background.neutral.subtle.hovered', '#091E420F'),
			boxSizing: 'border-box',
			boxShadow: `inset 2px 0 0 ${token('color.border.selected', '#0C66E4')}`,
			outline: 'none',
		},
	},
});

const LozengeActionItemsGroupNew = ({ items, testId, onClick }: LozengeActionItemsGroupProps) => (
	<span css={dropdownItemGroupStyles} data-testid={`${testId}-item-group`}>
		<DropdownItemGroup>
			{items.map((item, idx) => (
				<LozengeActionItem {...item} key={idx} onClick={onClick} testId={`${testId}-item-${idx}`} />
			))}
		</DropdownItemGroup>
	</span>
);

const LozengeActionItemsGroup = (props: LozengeActionItemsGroupProps): JSX.Element => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <LozengeActionItemsGroupNew {...props} />;
	} else {
		return <LozengeActionItemsGroupOld {...props} />;
	}
};

export default LozengeActionItemsGroup;
