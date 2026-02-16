import { getConfig } from '../config';
import type { LabelStack } from '../interaction-context';
import type { TerminalErrorContext, TerminalErrorData } from '../set-terminal-error';

export interface TerminalErrorPayload {
	actionSubject: string;
	action: string;
	eventType: string;
	source: string;
	tags: string[];
	attributes: {
		properties: {
			'event:hostname': string;
			'event:product': string;
			'event:schema': string;
			'event:source': {
				name: string;
				version: string;
			};
			'event:region': string;
			'experience:key': string;
			terminalError: TerminalErrorData;
			activeInteractionName: string | null;
			activeInteractionId: string | null;
			activeInteractionType: string | null;
			previousInteractionId: string | null;
			previousInteractionName: string | null;
			previousInteractionType: string | null;
			timeSincePreviousInteraction: number | null;
			labelStack: LabelStack | null;
			routeName: string | null;
		};
	};
}

function createTerminalErrorPayload(
	errorData: TerminalErrorData,
	context: TerminalErrorContext,
): TerminalErrorPayload | null {
	const config = getConfig();

	if (!config) {
		return null;
	}

	return {
		actionSubject: 'experience',
		action: 'measured',
		eventType: 'operational',
		source: 'measured',
		tags: ['observability'],
		attributes: {
			properties: {
				'event:hostname': window.location?.hostname || 'unknown',
				'event:product': config.product,
				'event:schema': '1.0.0',
				'event:source': {
					name: 'react-ufo/web',
					version: '1.0.1',
				},
				'event:region': config.region || 'unknown',
				'experience:key': 'custom.terminal-error',
				terminalError: errorData,
				...context,
			},
		},
	};
}

export default createTerminalErrorPayload;
