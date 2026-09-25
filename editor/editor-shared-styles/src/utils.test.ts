import { token } from '@atlaskit/tokens';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { participantColors } from './consts';
import { getHashCode, getParticipantColor } from './utils';

const RED_INDEXES = [0, 11];

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
		it.each(['claude', ' Claude '])(
			'uses fixed orange for %s regardless of participant ID',
			(agentType) => {
				for (const id of ['first-agent', 'second-agent', '']) {
					expect(getParticipantColor(id, agentType)).toEqual({
						index: 7,
						isFixed: true,
						color: {
							backgroundColor: token('color.background.accent.orange.bolder'),
							svgBackgroundColor: token('color.background.accent.orange.subtler'),
							textColor: token('color.text.inverse'),
						},
					});
				}
			},
		);

		it.each(['chatgpt', ' ChatGPT '])(
			'uses the ChatGPT brand colour for %s regardless of participant ID',
			(agentType) => {
				for (const id of ['first-agent', 'second-agent', '']) {
					expect(getParticipantColor(id, agentType)).toEqual({
						index: 9,
						isFixed: true,
						color: {
							backgroundColor: 'var(--agent-brand-chatgpt-bold, light-dark(#000000, #E8E8EA))',
							svgBackgroundColor: 'var(--agent-brand-chatgpt-bold, light-dark(#000000, #E8E8EA))',
							textColor: 'var(--agent-brand-chatgpt-boldText, light-dark(#FFFFFF, #000000))',
						},
					});
				}
			},
		);

		it.each([
			['figma', 'agent-brand-figma'],
			['lovable', 'agent-brand-lovable'],
			['replit', 'agent-brand-replit'],
		] as const)('uses ChatGPT telepointer colours for %s', (agentType, scheme) => {
			for (const id of ['first-agent', 'second-agent', '']) {
				expect(getParticipantColor(id, agentType)).toEqual({
					index: 9,
					isFixed: true,
					color: {
						backgroundColor: 'var(--' + scheme + '-bold, light-dark(#000000, #E8E8EA))',
						svgBackgroundColor: 'var(--' + scheme + '-bold, light-dark(#000000, #E8E8EA))',
						textColor: 'var(--' + scheme + '-boldText, light-dark(#FFFFFF, #000000))',
					},
				});
			}
		});
		it.each(['rovo', 'rovo_chat'])(
			'uses fixed purple for Rovo agent type or brand %s regardless of participant ID',
			(agentType) => {
				for (const id of ['first-agent', 'second-agent', '']) {
					expect(getParticipantColor(id, agentType)).toMatchObject({
						index: 4,
						isFixed: true,
					});
				}
			},
		);

		it.each(['first-agent', 'second-agent', ''])(
			'treats the Rovo agent type and brand identically for participant %s',
			(id) => {
				expect(getParticipantColor(id, 'rovo')).toEqual(getParticipantColor(id, 'rovo_chat'));
			},
		);

		it.each([undefined, ''])('preserves hashing when agent type is %s', (agentType) => {
			expect(getParticipantColor('participant-id', agentType)).toEqual(
				getParticipantColor('participant-id'),
			);
		});

		it.each([
			['00000000', 3],
			['00000001', 4],
			['00000002', 8],
			['00000003', 1],
		] as const)('maps agent identity %s to participant colour %d', (agentId, index) => {
			expect(getParticipantColor(agentId, 'convo-ai')).toMatchObject({ index });
		});

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

		describe('with confluence_ncs_step_diffing_version_history', () => {
			// `participant-4` hashes onto slot 0 (red bolder), `participant-10` onto slot 11 (red subtle).
			it.each([
				['participant-4', 0],
				['participant-10', 11],
			] as const)('assigns %s the red slot %d when off', (id, redIndex) => {
				failGate('confluence_ncs_step_diffing_version_history');

				expect(getParticipantColor(id)).toEqual({
					index: redIndex,
					color: participantColors[redIndex],
				});
			});

			it.each([
				['participant-4', 1],
				['participant-10', 12],
			] as const)('moves %s onto the next assignable slot %d when on', (id, expectedIndex) => {
				passGate('confluence_ncs_step_diffing_version_history');

				expect(getParticipantColor(id)).toEqual({
					index: expectedIndex,
					color: participantColors[expectedIndex],
				});
			});

			// Guards the premise of the collab-edit VR fixture, which relies on these two ids to
			// render a red telepointer in the gate-off baseline.
			it.each([
				['alice', 0, 1],
				['heidi', 11, 12],
			] as const)(
				'reassigns VR fixture id %s from slot %d to %d',
				(id, redIndex, expectedIndex) => {
					passGate('confluence_ncs_step_diffing_version_history');

					expect(getHashCode(id) % participantColors.length).toBe(redIndex);
					expect(getParticipantColor(id)).toEqual({
						index: expectedIndex,
						color: participantColors[expectedIndex],
					});
				},
			);

			it('never assigns a red slot to a hashed identity', () => {
				passGate('confluence_ncs_step_diffing_version_history');

				for (let i = 0; i < 500; i++) {
					expect(RED_INDEXES).not.toContain(getParticipantColor(`participant-${i}`).index);
				}
			});
		});
	});
});
