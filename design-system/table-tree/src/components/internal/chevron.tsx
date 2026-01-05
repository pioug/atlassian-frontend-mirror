/* eslint-disable @repo/internal/react/consistent-props-definitions */
import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import __noop from '@atlaskit/ds-lib/noop';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';

import { ChevronContainer } from './styled';

interface ChevronProps {
	/**
	 * @default 'Expand'
	 */
	expandLabel?: string;
	/**
	 * @default 'Collapse'
	 */
	collapseLabel?: string;
	isExpanded?: boolean;
	ariaControls?: string;
	onExpandToggle?: (e: React.MouseEvent) => void;
	rowId: string;
	extendedLabel?: string;
}

/**
 * Internal chevron component.
 */
const Chevron = ({
	isExpanded,
	ariaControls,
	collapseLabel = 'Collapse',
	expandLabel = 'Expand',
	rowId,
	extendedLabel,
	onExpandToggle = __noop,
}: ChevronProps): React.JSX.Element => {
	const getLabel = (defaultLabel: string) =>
		extendedLabel ? `${defaultLabel} ${extendedLabel} row` : `${defaultLabel} row ${rowId}`;

	return (
		<ChevronContainer>
			<IconButton
				appearance="subtle"
				onClick={onExpandToggle}
				spacing="compact"
				icon={(iconProps) =>
					isExpanded ? (
						<ChevronDownIcon {...iconProps} size="small" />
					) : (
						<ChevronRightIcon {...iconProps} size="small" />
					)
				}
				aria-controls={isExpanded ? ariaControls : undefined}
				label={isExpanded ? getLabel(collapseLabel) : getLabel(expandLabel)}
			/>
		</ChevronContainer>
	);
};

export default Chevron;
