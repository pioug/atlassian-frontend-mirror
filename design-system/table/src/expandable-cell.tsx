/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo, useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { IconButton } from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down--hipchat-chevron-down';
import ChevronUpIcon from '@atlaskit/icon/utility/migration/chevron-up--hipchat-chevron-up';

import useExpand from './hooks/use-expand';
import { ExpandableCell as ExpandableCellPrimitive } from './ui/expandable-cell';

/**
 * __Expandable cell__
 *
 * A cell with an expand button that controls the expanded state
 * of the `<ExpandableRow>`.
 */
const ExpandableCell = memo(() => {
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
				icon={(iconProps) => <Icon {...iconProps} LEGACY_size="small" />}
				label="Expand row"
				onClick={handleClick}
				aria-pressed={isExpanded}
			/>
		</ExpandableCellPrimitive>
	);
});

export default ExpandableCell;
