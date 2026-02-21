import React, { memo, useCallback } from 'react';

import { IconButton } from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/core/chevron-up';

import useExpand from './hooks/use-expand';
import { ExpandableCell as ExpandableCellPrimitive } from './ui/expandable-cell';

/**
 * __Expandable cell__
 *
 * A cell with an expand button that controls the expanded state
 * of the `<ExpandableRow>`.
 */
const ExpandableCell: React.MemoExoticComponent<() => React.JSX.Element> = memo(
	(): React.JSX.Element => {
		const { isExpanded, toggleExpanded } = useExpand();

		const handleClick = useCallback(() => {
			toggleExpanded();
		}, [toggleExpanded]);

		const Icon = isExpanded ? ChevronUpIcon : ChevronDownIcon;

		return (
			<ExpandableCellPrimitive as="td">
				<IconButton
					spacing="compact"
					appearance="subtle"
					icon={(iconProps) => <Icon {...iconProps} size="small" />}
					label="Expand row"
					onClick={handleClick}
					aria-pressed={isExpanded}
				/>
			</ExpandableCellPrimitive>
		);
	},
);

export default ExpandableCell;
