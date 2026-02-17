import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import { DiProvider, injectable } from 'react-magnetic-di';

import { useHydratedProject } from '../../../../state';
import type { HydratedProject } from '../../../../ui/jql-editor/types';

import { messages } from './messages';
import { ProjectNode } from './project-node';

const useHydratedProjectMock = jest.fn<[HydratedProject | undefined, any], []>();
const deps = [injectable(useHydratedProject, useHydratedProjectMock)];

describe('ProjectNode', () => {
	const renderProjectNode = ({
		name = 'Project Name',
		privateProject = false,
		error = false,
		selected = false,
	}: {
		error?: boolean;
		name?: string;
		privateProject?: boolean;
		selected?: boolean;
	}) =>
		render(
			<IntlProvider locale="en">
				<DiProvider use={deps}>
					<ProjectNode
						id="id"
						fieldName="project"
						name={name}
						privateProject={privateProject}
						error={error}
						selected={selected}
					/>
				</DiProvider>
			</IntlProvider>,
		);

	it('is accessible', async () => {
		const { getByText } = renderProjectNode({});
		await expect(getByText('Project Name')).toBeAccessible();
	});

	it('displays the correct text', () => {
		const { getByText } = renderProjectNode({ name: 'Custom Name' });
		expect(getByText('Custom Name')).toBeInTheDocument();
	});

	it('displays the project icon when no emoji is provided', () => {
		const { container } = renderProjectNode({});
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	it('displays restricted project title if the project is locked', () => {
		const { getByText } = renderProjectNode({ privateProject: true });
		expect(getByText(messages.restrictedProject.defaultMessage)).toBeInTheDocument();
	});
});
