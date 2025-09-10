import React from 'react';

import Button, { IconButton } from '@atlaskit/button/new';
import { Anchor } from '@atlaskit/primitives/compiled';

import type { PanelActionProps } from './types';

/**
 * The PanelAction component provides a primitive base for building panel action buttons.
 * It handles the basic rendering logic for buttons vs links and supports both regular
 * buttons and icon-only buttons. Use this component to build specific action variants.
 */
export function PanelAction({
	children,
	onClick,
	href,
	testId,
	target,
	rel,
	'aria-label': ariaLabel,
	'aria-haspopup': ariaHaspopup,
	icon,
	label,
}: PanelActionProps) {
	if (icon) {
		return (
			<IconButton
				onClick={onClick}
				testId={testId}
				icon={icon}
				label={label || ariaLabel}
				appearance="subtle"
				aria-haspopup={ariaHaspopup}
			/>
		);
	}

	if (href) {
		return (
			<Anchor
				href={href}
				onClick={onClick}
				testId={testId}
				target={target}
				rel={rel}
				aria-label={ariaLabel}
				aria-haspopup={ariaHaspopup}
			>
				{children}
			</Anchor>
		);
	}

	return (
		<Button
			onClick={onClick}
			testId={testId}
			aria-label={ariaLabel}
			aria-haspopup={ariaHaspopup}
			appearance="subtle"
		>
			{children}
		</Button>
	);
}
