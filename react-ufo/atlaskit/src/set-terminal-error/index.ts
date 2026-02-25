import { useEffect, useRef } from 'react';

import { type LabelStack, useInteractionContext } from '../interaction-context';
import { getActiveInteraction, PreviousInteractionLog } from '../interaction-metrics';
import UFORouteName from '../route-name-context';

export interface TerminalErrorAdditionalAttributes {
	teamName?: string;
	packageName?: string;
	errorBoundaryId?: string;
	errorHash?: string;
	traceId?: string;
	fallbackType?: 'page' | 'flag' | 'custom';
	statusCode?: number;
	isClientNetworkError?: boolean;
}

export interface TerminalErrorData extends TerminalErrorAdditionalAttributes {
	errorType: string;
	errorMessage: string;
	timestamp: number;
}

export interface TerminalErrorContext {
	labelStack: LabelStack | null;
	activeInteractionName: string | null;
	activeInteractionId: string | null;
	activeInteractionType: string | null;
	previousInteractionId: string | null;
	previousInteractionName: string | null;
	previousInteractionType: string | null;
	timeSincePreviousInteraction: number | null;
	routeName: string | null;
}

let sinkHandlerFn: (
	errorData: TerminalErrorData,
	context: TerminalErrorContext,
) => void | Promise<void> = () => {};

export function sinkTerminalErrorHandler(
	fn: (errorData: TerminalErrorData, context: TerminalErrorContext) => void | Promise<void>,
): void {
	sinkHandlerFn = fn;
}

export function setTerminalError(
	error: Error,
	additionalAttributes?: TerminalErrorAdditionalAttributes,
	labelStack?: LabelStack,
): void {
	if (additionalAttributes?.isClientNetworkError) {
		// Exclude client network errors from being reported to UFO
		return;
	}

	const activeInteraction = getActiveInteraction();
	const currentTime = performance.now();
	const errorData: TerminalErrorData = {
		errorType: error.name || 'Error',
		errorMessage: error.message?.slice(0, 100) || 'Unknown error',
		timestamp: currentTime,
		...additionalAttributes,
	};

	// Calculate time since previous interaction
	const timeSincePreviousInteraction =
		PreviousInteractionLog.timestamp != null
			? currentTime - PreviousInteractionLog.timestamp
			: null;

	const context: TerminalErrorContext = {
		labelStack: labelStack ?? null,
		activeInteractionName: activeInteraction?.ufoName ?? null,
		activeInteractionId: activeInteraction?.id ?? null,
		activeInteractionType: activeInteraction?.type ?? null,
		previousInteractionId: PreviousInteractionLog.id ?? null,
		previousInteractionName: PreviousInteractionLog.name ?? null,
		previousInteractionType: PreviousInteractionLog.type ?? null,
		timeSincePreviousInteraction,
		routeName: UFORouteName.current ?? null,
	};
	sinkHandlerFn(errorData, context);
}

export function useReportTerminalError(
	error: Error | null | undefined,
	additionalAttributes?: TerminalErrorAdditionalAttributes,
): void {
	const interactionContext = useInteractionContext();
	const hasReportedRef = useRef(false);

	useEffect(() => {
		if (error && !hasReportedRef.current) {
			hasReportedRef.current = true;
			setTerminalError(error, additionalAttributes, interactionContext?.labelStack);
		}
	}, [error, additionalAttributes, interactionContext?.labelStack]);
}
