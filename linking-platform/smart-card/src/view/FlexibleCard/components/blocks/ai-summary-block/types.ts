import { type ReactNode } from 'react';

import { type BlockProps } from '../types';

export type AISummaryBlockProps = {
	/**
	 * Minimum height requirement for the AISummary component to prevent fluctuations in a card size on the summary action.
	 */
	aiSummaryMinHeight?: number;

	/**
	 * Whether platform_sl_3p_auth_rovo_action or rovogrowth-640-inline-action-nudge-exp experiment value is ON for current runtime
	 */
	isAny3pRovoActionsExperimentOn?: boolean;

	/**
	 * Placeholder to show when summary is not available
	 */
	placeholder?: ReactNode;
} & BlockProps;
