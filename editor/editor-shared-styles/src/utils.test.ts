import { token } from '@atlaskit/tokens';

import { getHashCode, getParticipantColor } from './utils';

describe('utils', () => {
	describe('getHashCode', () => {
		it('should return a hash code for a given string', () => {
			expect(getHashCode('FawAXOcgL7ixM9qtAB0L')).toBe(2021471462);
			expect(getHashCode('exB9qUN6fCHFlE-cAB0X')).toBe(2785253289);
			expect(getHashCode('9NOVTX9WjLubYyVhAB0H')).toBe(3240394968);
			expect(getHashCode('ceea2b46-6671-4827-a2ea-85e91a03f2ac')).toBe(308780004);
			expect(getHashCode('42b0923a-c388-4cb8-b4f3-3210f95a489e')).toBe(1660294582);
			expect(getHashCode('d3b6e136-0f93-4bf2-a7e7-cd93dcce20e8')).toBe(3395311041);
		});
	});

	describe('getParticipantColor', () => {
		it('should return a participant color based on the hash code of the input string', () => {
			expect(getParticipantColor('FawAXOcgL7ixM9qtAB0L')).toEqual({
				index: 2,
				color: {
					backgroundColor: token('color.background.accent.green.bolder'),
					svgBackgroundColor: token('color.background.accent.green.subtler'),
					textColor: token('color.text.inverse'),
				},
			});
			expect(getParticipantColor('exB9qUN6fCHFlE-cAB0X')).toEqual({
				index: 15,
				color: {
					backgroundColor: token('color.background.accent.teal.subtle'),
					svgBackgroundColor: token('color.background.accent.teal.subtlest'),
					textColor: token('color.text.accent.gray.bolder'),
				},
			});
			expect(getParticipantColor('9NOVTX9WjLubYyVhAB0H')).toEqual({
				index: 12,
				color: {
					backgroundColor: token('color.background.accent.orange.subtle'),
					svgBackgroundColor: token('color.background.accent.orange.subtlest'),
					textColor: token('color.text.accent.gray.bolder'),
				},
			});
			expect(getParticipantColor('ceea2b46-6671-4827-a2ea-85e91a03f2ac')).toEqual({
				index: 12,
				color: {
					backgroundColor: token('color.background.accent.orange.subtle'),
					svgBackgroundColor: token('color.background.accent.orange.subtlest'),
					textColor: token('color.text.accent.gray.bolder'),
				},
			});
			expect(getParticipantColor('42b0923a-c388-4cb8-b4f3-3210f95a489e')).toEqual({
				index: 16,
				color: {
					backgroundColor: token('color.background.accent.purple.subtle'),
					svgBackgroundColor: token('color.background.accent.purple.subtlest'),
					textColor: token('color.text.accent.gray.bolder'),
				},
			});
			expect(getParticipantColor('d3b6e136-0f93-4bf2-a7e7-cd93dcce20e8')).toEqual({
				index: 3,
				color: {
					backgroundColor: token('color.background.accent.yellow.bolder'),
					svgBackgroundColor: token('color.background.accent.yellow.subtler'),
					textColor: token('color.text.inverse'),
				},
			});
		});
	});
});
