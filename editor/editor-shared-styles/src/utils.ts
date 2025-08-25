import { type ParticipantColor, participantColors } from './consts';

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
 * Returns the participant color based on the hash code of the input string.
 *
 * @param str - The input string used to determine the participant color.
 * @returns An object containing the index and the corresponding participant color.
 */
export function getParticipantColor(str: string): { color: ParticipantColor; index: number } {
	const index = getHashCode(str) % participantColors.length;

	return { index, color: participantColors[index] };
}
