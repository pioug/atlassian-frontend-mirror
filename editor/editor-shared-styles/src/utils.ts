import type { AgentBrandColorScheme } from '@atlaskit/agent-color/agent-presence-color-types';
import { getAgentColor, type AgentColor } from '@atlaskit/agent-color/get-agent-color';
import { getThirdPartyAgentColor } from '@atlaskit/agent-color/get-third-party-agent-color';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { type ParticipantColor, participantColors } from './consts';

/**
 * Fixed telepointer palette slot for each `@atlaskit/agent-color` brand this editor recognises by
 * a reserved identity colour rather than a hashed one.
 *
 * Claude uses orange (`participantColors[7]`), Rovo purple (`[4]`), and ChatGPT gray (`[9]`).
 * Brands in `BRAND_EXACT_COLOR_SCHEMES` use their registered brand colours in those fixed slots.
 * The palette's numbered positions also back the telepointer CSS classes, so preserve these
 * positions when editing the palette. Brands `@atlaskit/agent-color` resolves but this table omits
 * (e.g. Figma, Replit) fall through to the identity-hashed colour below.
 */
const BRAND_PARTICIPANT_COLOR_INDEX: Readonly<Partial<Record<AgentBrandColorScheme, number>>> = {
	'agent-brand-claude': 7,
	'agent-brand-rovo': 4,
	'agent-brand-chatgpt': 9,
};

/**
 * Brands whose registered `bold`/`boldText` values take precedence over their palette slot.
 */
const BRAND_EXACT_COLOR_SCHEMES: ReadonlySet<AgentBrandColorScheme> = new Set([
	'agent-brand-chatgpt',
	'agent-brand-rovo',
]);

/** Maps Agent Studio's semantic palette to the established telepointer palette slots. */
const AGENT_COLOR_TO_PARTICIPANT_COLOR_INDEX: Readonly<Record<AgentColor, number>> = {
	yellow: 3,
	purple: 4,
	lime: 8,
	blue: 1,
};

/** The two red palette slots. Red reads as "deleted", so it never identifies a participant. */
const RESERVED_PARTICIPANT_COLOR_INDEXES: ReadonlySet<number> = new Set([0, 11]);

/** Advances past a reserved slot, wrapping around the palette. */
const getAssignableIndex = (index: number): number => {
	for (let offset = 0; offset < participantColors.length; offset++) {
		const candidate = (index + offset) % participantColors.length;
		if (!RESERVED_PARTICIPANT_COLOR_INDEXES.has(candidate)) {
			return candidate;
		}
	}

	return index;
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
 * Under `confluence_ncs_step_diffing_version_history` the red slots are skipped. Fixed brand
 * slots are exempt because none of them is red.
 *
 * @param str - The input string used to determine the participant color.
 * @param agentType - Optional agent type supplied by agent-aware callers.
 * @returns The palette colour and index; `isFixed` prevents callers from reallocating brand colours.
 */
export function getParticipantColor(
	str: string,
	agentType?: string,
): { color: ParticipantColor; index: number; isFixed?: true } {
	const brand = agentType ? getThirdPartyAgentColor({ agentName: agentType }) : undefined;

	if (brand) {
		const fixedIndex = BRAND_PARTICIPANT_COLOR_INDEX[brand.scheme];
		if (fixedIndex !== undefined) {
			const color: ParticipantColor = BRAND_EXACT_COLOR_SCHEMES.has(brand.scheme)
				? { backgroundColor: brand.bold, svgBackgroundColor: brand.bold, textColor: brand.boldText }
				: participantColors[fixedIndex];
			return { index: fixedIndex, color, isFixed: true };
		}
	}

	const agentColor = agentType ? getAgentColor({ agentId: str }) : undefined;
	const preferredIndex = agentColor
		? AGENT_COLOR_TO_PARTICIPANT_COLOR_INDEX[agentColor]
		: getHashCode(str) % participantColors.length;

	const index = fg('confluence_ncs_step_diffing_version_history')
		? getAssignableIndex(preferredIndex)
		: preferredIndex;

	return { index, color: participantColors[index] };
}
