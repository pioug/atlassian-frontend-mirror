import { getAgentColor, type AgentColor } from '@atlaskit/agent-color/get-agent-color';

import { type ParticipantColor, participantColors } from './consts';

/**
 * Agent types with a fixed participant colour instead of an identity-derived colour.
 *
 * Claude uses orange, which is `participantColors[7]`. The palette's numbered positions also
 * back the telepointer CSS classes, so preserve this position when editing the palette.
 */
const AGENT_PARTICIPANT_COLOR_OVERRIDES: Readonly<Record<string, number>> = {
	claude: 7,
	rovo_chat: 4,
};

/** Maps Agent Studio's semantic palette to the established telepointer palette slots. */
const AGENT_COLOR_TO_PARTICIPANT_COLOR_INDEX: Readonly<Record<AgentColor, number>> = {
	yellow: 3,
	purple: 4,
	lime: 2,
	blue: 1,
};

/**
 * Generates a hash code for a given string.
 *
 * This function computes a hash code by iterating over each character
 * in the string and applying bitwise operations to accumulate the hash value.
 *
 * @param str - The input string for which the hash code is to be generated.
 * @returns The computed hash code as a number.
 */
export function getHashCode(str: string): number {
	let hash = 0;

	for (let i = 0; i < str.length; i++) {
		/* eslint-disable no-bitwise */
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash = (hash & hash) >>> 0;
		/* eslint-enable no-bitwise */
	}

	return hash;
}

/**
 * Returns a fixed agent brand colour, an Agent Studio palette preference, or a hashed identity.
 *
 * @param str - The input string used to determine the participant color.
 * @param agentType - Optional agent type supplied by agent-aware callers.
 * @returns The palette colour and index; `isFixed` prevents callers from reallocating brand colours.
 */
export function getParticipantColor(
	str: string,
	agentType?: string,
): { color: ParticipantColor; index: number; isFixed?: true } {
	const fixedColorIndex = agentType
		? AGENT_PARTICIPANT_COLOR_OVERRIDES[agentType.trim().toLowerCase()]
		: undefined;
	if (fixedColorIndex !== undefined) {
		const index = fixedColorIndex;
		return { index, color: participantColors[index], isFixed: true };
	}

	const agentColor = agentType ? getAgentColor({ agentId: str }) : undefined;
	const index = agentColor
		? AGENT_COLOR_TO_PARTICIPANT_COLOR_INDEX[agentColor]
		: getHashCode(str) % participantColors.length;

	return { index, color: participantColors[index] };
}
