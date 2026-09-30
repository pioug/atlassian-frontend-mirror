import React from 'react';

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
	it('is accessible', async () => {
		const { container } = renderLinkIcon({
			label: 'Bug',
			resourceType: 'issue',
			type: ['atlassian:Task', 'Object'],
		});

		await expect(container).toBeAccessible();
	});

	it.each(['Bug', 'Task', 'Question'])(
		'uses the resolver-provided Jira %s issue type label',
		(label) => {
			renderLinkIcon({
				label,
				resourceType: 'issue',
				type: ['atlassian:Task', 'Object'],
			});

			expect(screen.getByRole('img', { name: label })).toBeVisible();
			expect(screen.queryByRole('img', { name: 'Issue' })).not.toBeInTheDocument();
		},
	);

	it('preserves resource type labels for non-Jira task icons', () => {
		renderLinkIcon({
			label: 'Blog',
			resourceType: 'page',
			type: ['Document'],
		});

		expect(screen.getByRole('img', { name: 'Page' })).toBeVisible();
		expect(screen.queryByRole('img', { name: 'Blog' })).not.toBeInTheDocument();
	});
});
