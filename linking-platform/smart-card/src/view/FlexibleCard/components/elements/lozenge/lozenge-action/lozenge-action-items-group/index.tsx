/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import LozengeActionItem from '../lozenge-action-item';
import { dropdownItemGroupStyles } from '../styled';
import { DropdownItemGroup } from '@atlaskit/dropdown-menu';
import type { LozengeActionItemsGroupProps } from './types';

const LozengeActionItemsGroup = ({ items, testId, onClick }: LozengeActionItemsGroupProps) => (
	// eslint-disable-next-line @atlaskit/design-system/prefer-primitives, @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	<span css={dropdownItemGroupStyles} data-testid={`${testId}-item-group`}>
		<DropdownItemGroup>
			{items.map((item, idx) => (
				<LozengeActionItem {...item} key={idx} onClick={onClick} testId={`${testId}-item-${idx}`} />
			))}
		</DropdownItemGroup>
	</span>
);

export default LozengeActionItemsGroup;
