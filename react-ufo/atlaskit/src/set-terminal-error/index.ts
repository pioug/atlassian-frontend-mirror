import { useEffect, useRef } from 'react';

import { type LabelStack, useInteractionContext } from '../interaction-context';
import { getActiveInteraction } from '../interaction-metrics';

export interface TerminalErrorAdditionalAttributes {
	teamName?: string;
	packageName?: string;
	errorBoundaryId?: string;
	errorHash?: string;
	traceId?: string;
	fallbackType?: 'page' | 'flag' | 'custom';
	statusCode?: number;
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
	const activeInteraction = getActiveInteraction();
	const errorData: TerminalErrorData = {
		errorType: error.name || 'Error',
		errorMessage: error.message.slice(0, 100),
		timestamp: performance.now(),
		...additionalAttributes,
	};
	const context: TerminalErrorContext = {
		labelStack: labelStack ?? null,
		activeInteractionName: activeInteraction?.ufoName ?? null,
		activeInteractionId: activeInteraction?.id ?? null,
		activeInteractionType: activeInteraction?.type ?? null,
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
