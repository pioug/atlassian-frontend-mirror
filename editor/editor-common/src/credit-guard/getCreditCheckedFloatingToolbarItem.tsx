import React from 'react';

import type { Command } from '../types/command';
import type { FloatingToolbarCustom } from '../types/floating-toolbar';
import {
	CreditCheckedFloatingToolbarButton,
	type CreditCheckedFloatingToolbarButtonProps,
} from './CreditCheckedFloatingToolbarButton';

/** Wraps a floating toolbar button so it is credit checked, keeping its own appearance and handlers. */
export const getCreditCheckedFloatingToolbarItem = ({
	button,
	creditCheck,
	getAICreditStatus,
}: Omit<CreditCheckedFloatingToolbarButtonProps, 'view'>): FloatingToolbarCustom<Command> => ({
	type: 'custom',
	fallback: [],
	render: (view, idx) => (
		<CreditCheckedFloatingToolbarButton
			key={idx}
			button={button}
			creditCheck={creditCheck}
			getAICreditStatus={getAICreditStatus}
			view={view}
		/>
	),
});
