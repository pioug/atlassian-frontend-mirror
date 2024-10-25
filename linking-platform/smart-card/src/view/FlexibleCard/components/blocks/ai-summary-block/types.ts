import { type ReactNode } from 'react';

import { type BlockProps } from '../types';

export type AISummaryBlockProps = {
	/**
	 * Minimum height requirement for the AISummary component to prevent fluctuations in a card size on the summary action.
	 */
	aiSummaryMinHeight?: number;

	/**
	 * Placeholder to show when summary is not available
	 */
	placeholder?: ReactNode;
} & BlockProps;
