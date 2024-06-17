/** @jsx jsx */
import { memo, useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { IconButton } from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';

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

	return (
		<ExpandableCellPrimitive as="td">
			<IconButton
				spacing="compact"
				appearance="subtle"
				icon={isExpanded ? ChevronUpIcon : ChevronDownIcon}
				label="Expand row"
				UNSAFE_size="small"
				onClick={handleClick}
				aria-pressed={isExpanded}
			/>
		</ExpandableCellPrimitive>
	);
});

export default ExpandableCell;
