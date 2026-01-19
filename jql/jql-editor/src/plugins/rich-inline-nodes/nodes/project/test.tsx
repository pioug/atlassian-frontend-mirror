import React from 'react';

import { render } from '@testing-library/react';

import { messages } from './messages';

import { ProjectNode } from './index';


describe('ProjectNode', () => {
	it('is accessible', async () => {
		const { getByText } = render(
			<ProjectNode text="Test project" error={false} selected={false} />,
		);
		await expect(getByText('Test project')).toBeAccessible();
	});

	it('displays the correct text', () => {
		const { getByText } = render(
			<ProjectNode text="Test project" error={false} selected={false} />,
		);
		expect(getByText('Test project')).toBeInTheDocument();
	});

	it('displays the project icon when no emoji is provided', () => {
		const { container } = render(
			<ProjectNode text="Project" error={false} selected={false} />,
		);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	it('displays restricted project title if the project is locked', () => {
		const { getByText } = render(
			<ProjectNode isRestricted={true} error={false} selected={false} />,
		);
		expect(getByText(messages.restrictedProject.defaultMessage)).toBeInTheDocument();
	});
});
