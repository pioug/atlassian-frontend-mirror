import React, { useCallback } from 'react';

import { DropdownItem } from '@atlaskit/dropdown-menu';
import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';

import type { LozengeActionItemProps } from './types';

const LozengeActionItem = ({ appearance, id, onClick, testId, text }: LozengeActionItemProps) => {
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
		// eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events
		<span onMouseEnter={handleMouseEnter} role="presentation">
			<DropdownItem onClick={handleClick} testId={testId}>
				<Lozenge
					appearance={appearance}
					{...(fg('platform-component-visual-refresh') ? { isBold: true } : undefined)}
				>
					{text}
				</Lozenge>
			</DropdownItem>
		</span>
	);
};

export default LozengeActionItem;
