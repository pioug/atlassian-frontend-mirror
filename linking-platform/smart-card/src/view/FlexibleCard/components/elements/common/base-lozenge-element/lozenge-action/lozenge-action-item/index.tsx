import React, { useCallback } from 'react';

import { DropdownItem } from '@atlaskit/dropdown-menu';
import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';

import type { LozengeActionItemProps } from './types';

const LozengeActionItem = ({
	appearance,
	id,
	onClick,
	testId,
	text,
}: LozengeActionItemProps): React.JSX.Element => {
	const handleClick = useCallback(
		(e: any) => {
			// Prevent dropdown to close on select item.
			// We want to show loading screen.
			e.stopPropagation();

			if (onClick) {
				onClick(id, text, appearance);
			}
		},
		[appearance, id, onClick, text],
	);

	const handleMouseEnter = useCallback((e: any) => {
		e.currentTarget?.firstElementChild?.focus();
	}, []);

	return (
		<span
			{...(fg('platform_sl_a11y_enghealth_46829') ? { onFocus: handleMouseEnter } : undefined)}
			// eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events
			onMouseEnter={handleMouseEnter}
			role="presentation"
		>
			<DropdownItem onClick={handleClick} testId={testId}>
				<Lozenge appearance={appearance} isBold>
					{text}
				</Lozenge>
			</DropdownItem>
		</span>
	);
};

export default LozengeActionItem;
