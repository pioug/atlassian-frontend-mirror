import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render, screen } from '@atlassian/testing-library';

import { IconType } from '../../../../../../constants';
import { FlexibleCardContext } from '../../../../../../state/flexible-ui-context';
import LinkIconElement from '../index';

jest.mock('../../common', () => ({
	BaseIconElement: ({ label }: { label?: string }) => <span aria-label={label} role="img" />,
	toLinkIconProps: (linkIcon: object) => linkIcon,
}));

const renderLinkIcon = ({
	label,
	resourceType,
	type,
}: {
	label: string;
	resourceType: string;
	type: string[];
}) =>
	render(
		<FlexibleCardContext.Provider
			value={{
				data: {
					linkIcon: { icon: IconType.Bug, label },
					meta: { resourceType },
					type,
				},
			}}
		>
			<LinkIconElement />
		</FlexibleCardContext.Provider>,
	);

describe('LinkIconElement', () => {
	beforeEach(() => {
		passGate('platform_navx_smart_link_icon_label_a11y');
	});

	it('is accessible', async () => {
		passGate('platform_navx_jira_issue_type_icon_label_a11y');

		const { container } = renderLinkIcon({
			label: 'Bug',
			resourceType: 'issue',
			type: ['atlassian:Task', 'Object'],
		});

		await expect(container).toBeAccessible();
	});

	it.each(['Bug', 'Task', 'Question'])(
		'uses the resolver-provided Jira %s issue type label when the gate is on',
		(label) => {
			passGate('platform_navx_jira_issue_type_icon_label_a11y');

			renderLinkIcon({
				label,
				resourceType: 'issue',
				type: ['atlassian:Task', 'Object'],
			});

			expect(screen.getByRole('img', { name: label })).toBeVisible();
			expect(screen.queryByRole('img', { name: 'Issue' })).not.toBeInTheDocument();
		},
	);

	it('preserves the generic resource type label when the gate is off', () => {
		failGate('platform_navx_jira_issue_type_icon_label_a11y');

		renderLinkIcon({
			label: 'Bug',
			resourceType: 'issue',
			type: ['atlassian:Task', 'Object'],
		});

		expect(screen.getByRole('img', { name: 'Issue' })).toBeVisible();
		expect(screen.queryByRole('img', { name: 'Bug' })).not.toBeInTheDocument();
	});

	it('preserves resource type labels for non-Jira task icons when the gate is on', () => {
		passGate('platform_navx_jira_issue_type_icon_label_a11y');

		renderLinkIcon({
			label: 'Blog',
			resourceType: 'page',
			type: ['Document'],
		});

		expect(screen.getByRole('img', { name: 'Page' })).toBeVisible();
		expect(screen.queryByRole('img', { name: 'Blog' })).not.toBeInTheDocument();
	});
});
