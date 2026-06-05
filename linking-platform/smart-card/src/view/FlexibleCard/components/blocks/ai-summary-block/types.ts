import { type ReactNode } from 'react';

import { type BlockProps } from '../types';

export type AISummaryBlockProps = {
	/**
	 * Minimum height requirement for the AISummary component to prevent fluctuations in a card size on the summary action.
	 */
	aiSummaryMinHeight?: number;

	/**
	 * Whether the platform_sl_3p_auth_rovo_action experiment value is ON for current runtime
	*/
	isAny3pRovoActionsExperimentOn?: boolean;

	/**
	 * Placeholder to show when summary is not available
	 */
	placeholder?: ReactNode;
} & BlockProps;
