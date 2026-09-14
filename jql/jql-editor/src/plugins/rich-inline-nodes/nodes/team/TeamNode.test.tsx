import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { TeamNode } from './team-node';

const TEAM_UUID = '5653b0ca-138f-454a-9884-eabe847f18df';
const TEAM_NAME = 'Archiveable team 59';

/**
 * With nothing hydrated for this field, TeamsAvatar has no `src` and derives the avatar URL from the
 * id it is given, which is what these tests assert on.
 */
const renderTeamNode = (id: string) =>
	render(
		<IntlProvider locale="en">
			<TeamNode id={id} fieldName="Team[Team]" name={TEAM_NAME} error={false} selected={false} />
		</IntlProvider>,
	);

const getAvatarSrc = (container: HTMLElement) =>
	container.querySelector('img')?.getAttribute('src');

describe('Team node avatar', () => {
	it('is accessible', async () => {
		const { getByText } = renderTeamNode(`id:${TEAM_UUID}`);

		await expect(getByText(TEAM_NAME)).toBeAccessible();
	});

	describe('gate is enabled', () => {
		it('strips the id: prefix when deriving the avatar URL', () => {
			passGate('jira-descendants-of-team-jql-function');

			const { container } = renderTeamNode(`id:${TEAM_UUID}`);

			expect(getAvatarSrc(container)).toBe(`/gateway/api/v4/teams/${TEAM_UUID}/avatar`);
		});

		it('strips the id: prefix when written with a space', () => {
			passGate('jira-descendants-of-team-jql-function');

			const { container } = renderTeamNode(`id: ${TEAM_UUID}`);

			expect(getAvatarSrc(container)).toBe(`/gateway/api/v4/teams/${TEAM_UUID}/avatar`);
		});

		it('leaves a bare team id untouched', () => {
			passGate('jira-descendants-of-team-jql-function');

			const { container } = renderTeamNode(TEAM_UUID);

			expect(getAvatarSrc(container)).toBe(`/gateway/api/v4/teams/${TEAM_UUID}/avatar`);
		});
	});

	describe('gate is disabled', () => {
		it('keeps the id: prefix in the avatar URL', () => {
			failGate('jira-descendants-of-team-jql-function');

			const { container } = renderTeamNode(`id:${TEAM_UUID}`);

			expect(getAvatarSrc(container)).toBe(`/gateway/api/v4/teams/id:${TEAM_UUID}/avatar`);
		});
	});
});
