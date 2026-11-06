import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { token } from '@atlaskit/tokens';

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
			(agentName) => {
				mockExpEnabled('platform_editor_attributed_version_history');
				for (const id of ['first-agent', 'second-agent', '']) {
					expect(getParticipantColor(id, agentName)).toEqual({
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
			(agentName) => {
				mockExpEnabled('platform_editor_attributed_version_history');
				for (const id of ['first-agent', 'second-agent', '']) {
					expect(getParticipantColor(id, agentName)).toEqual({
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
		] as const)('uses ChatGPT telepointer colours for %s', (agentName, scheme) => {
			mockExpEnabled('platform_editor_attributed_version_history');
			for (const id of ['first-agent', 'second-agent', '']) {
				expect(getParticipantColor(id, agentName)).toEqual({
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
		it.each([
			'amplitude',
			'cortex',
			'databricks',
			'gemini',
			'manus',
			'slack',
			'antigravity',
			'copilot',
		] as const)('pins %s to the shared third-party slot with its brand colours', (agentName) => {
			mockExpEnabled('platform_editor_attributed_version_history');
			for (const id of ['first-agent', 'second-agent', '']) {
				const { color, index, isFixed } = getParticipantColor(id, agentName);
				expect({ index, isFixed }).toEqual({ index: 9, isFixed: true });
				expect(color.backgroundColor).toContain('var(--agent-brand-' + agentName + '-bold');
				expect(color.textColor).toContain('var(--agent-brand-' + agentName + '-boldText');
			}
		});
		it.each(['rovo', 'rovo_chat'])(
			'uses fixed purple for Rovo brand name %s regardless of participant ID',
			(agentName) => {
				mockExpEnabled('platform_editor_attributed_version_history');
				for (const id of ['first-agent', 'second-agent', '']) {
					expect(getParticipantColor(id, agentName)).toMatchObject({
						index: 4,
						isFixed: true,
					});
				}
			},
		);

		it.each(['first-agent', 'second-agent', ''])(
			'treats the Rovo name aliases identically for participant %s',
			(id) => {
				mockExpEnabled('platform_editor_attributed_version_history');
				expect(getParticipantColor(id, 'rovo')).toEqual(getParticipantColor(id, 'rovo_chat'));
			},
		);

		it.each([undefined, ''])('preserves hashing when agent name is %s', (agentName) => {
			expect(getParticipantColor('participant-id', agentName)).toEqual(
				getParticipantColor('participant-id'),
			);
		});

		it.each([
			['00000000', 3],
			['00000001', 4],
			['00000002', 8],
			['00000003', 1],
		] as const)('maps agent identity %s to participant colour %d', (agentId, index) => {
			expect(getParticipantColor(agentId, 'Docs Reviewer')).toMatchObject({ index });
		});

		it('uses the named colour override for the content reviewer agent', () => {
			for (const id of ['first-agent', 'second-agent']) {
				expect(getParticipantColor(id, undefined, 'content_reviewer_agent')).toMatchObject({
					index: 1,
				});
			}
		});

		it('resolves a named brand without a display name', () => {
			mockExpEnabled('platform_editor_attributed_version_history');
			expect(getParticipantColor('agent-id', undefined, 'mcp_figma_agent')).toEqual(
				getParticipantColor('agent-id', 'Figma'),
			);
		});

		it('prefers the stable named brand over the display name', () => {
			mockExpEnabled('platform_editor_attributed_version_history');
			expect(getParticipantColor('agent-id', 'Claude', 'mcp_figma_agent')).toEqual(
				getParticipantColor('agent-id', 'Figma'),
			);
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

		describe('with platform_editor_attributed_version_history', () => {
			it.each([
				[false, 'mcp_figma_agent', undefined, 3, undefined],
				[true, 'mcp_figma_agent', undefined, 3, undefined],
				[false, 'Claude', undefined, 3, undefined],
				[true, 'Claude', undefined, 7, true],
				[false, 'Claude', 'mcp_figma_agent', 1, undefined],
				[true, 'Claude', 'mcp_figma_agent', 9, true],
				[false, undefined, 'mcp_figma_agent', 1, undefined],
				[true, undefined, 'mcp_figma_agent', 9, true],
			] as const)(
				'with gate %s resolves second argument %s and named ID %s to slot %s',
				(enabled, agentName, agentNamedId, expectedIndex, expectedFixed) => {
					if (enabled) {
						mockExpEnabled('platform_editor_attributed_version_history');
					} else {
						mockExpDisabled('platform_editor_attributed_version_history');
					}
					const { index, isFixed } = getParticipantColor('00000000', agentName, agentNamedId);
					expect({ index, isFixed }).toEqual({ index: expectedIndex, isFixed: expectedFixed });
				},
			);

			// `participant-4` hashes onto slot 0 (red bolder), `participant-10` onto slot 11 (red subtle).
			it.each([
				['participant-4', 0],
				['participant-10', 11],
			] as const)('assigns %s the red slot %d when off', (id, redIndex) => {
				mockExpDisabled('platform_editor_attributed_version_history');

				expect(getParticipantColor(id)).toEqual({
					index: redIndex,
					color: participantColors[redIndex],
				});
			});

			it.each([
				['participant-4', 1],
				['participant-10', 12],
			] as const)('moves %s onto the next assignable slot %d when on', (id, expectedIndex) => {
				mockExpEnabled('platform_editor_attributed_version_history');

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
					mockExpEnabled('platform_editor_attributed_version_history');

					expect(getHashCode(id) % participantColors.length).toBe(redIndex);
					expect(getParticipantColor(id)).toEqual({
						index: expectedIndex,
						color: participantColors[expectedIndex],
					});
				},
			);

			it('never assigns a red slot to a hashed identity', () => {
				mockExpEnabled('platform_editor_attributed_version_history');

				for (let i = 0; i < 500; i++) {
					expect(RED_INDEXES).not.toContain(getParticipantColor(`participant-${i}`).index);
				}
			});
		});
	});
});
