import React from 'react';

import { render, screen } from '@testing-library/react';

import type { ContainerTypes } from '../../types';
import { ContainerIcon } from './index';

jest.mock('../loom-avatar/main', () => ({
	LoomSpaceAvatar: () => <div data-testid="loom-space-avatar">Loom Space Avatar</div>,
}));

describe('ContainerIcon', () => {
	const defaultProps = {
		title: 'Test Container',
		containerType: 'ConfluenceSpace' as ContainerTypes,
	};

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should render LoomSpaceAvatar for LoomSpace container type', () => {
		render(<ContainerIcon {...defaultProps} containerType="LoomSpace" title="My Loom Space" />);

		expect(screen.getByTestId('loom-space-avatar')).toBeVisible();
	});

	it('should render LinkIcon with correct testId when containerType is WebLink and no containerIcon is provided', () => {
		render(<ContainerIcon {...defaultProps} containerType="WebLink" title="Web Link" />);

		expect(screen.getByTestId('linked-container-WebLink-new-icon')).toBeVisible();
	});

	it('should render the containerIcon image when containerType is WebLink and containerIcon is provided', () => {
		render(
			<ContainerIcon
				{...defaultProps}
				containerType="WebLink"
				title="Web Link"
				containerIcon="https://example.com/icon.png"
			/>,
		);

		expect(screen.getByRole('img', { name: 'Web Link' })).toHaveAttribute(
			'src',
			'https://example.com/icon.png',
		);
	});

	it('should render the containerIcon image for ConfluenceSpace container type', () => {
		render(
			<ContainerIcon
				{...defaultProps}
				containerType="ConfluenceSpace"
				title="Confluence Space"
				containerIcon="https://example.com/confluence-icon.png"
			/>,
		);

		expect(screen.getByRole('img', { name: 'Confluence Space' })).toHaveAttribute(
			'src',
			'https://example.com/confluence-icon.png',
		);
		expect(screen.getByTestId('linked-container-ConfluenceSpace-icon')).toBeVisible();
	});

	it('should render the containerIcon image for JiraProject container type', () => {
		render(
			<ContainerIcon
				{...defaultProps}
				containerType="JiraProject"
				title="Jira Project"
				containerIcon="https://example.com/jira-icon.png"
			/>,
		);

		expect(screen.getByRole('img', { name: 'Jira Project' })).toHaveAttribute(
			'src',
			'https://example.com/jira-icon.png',
		);
		expect(screen.getByTestId('linked-container-JiraProject-icon')).toBeVisible();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<ContainerIcon {...defaultProps} containerType="LoomSpace" title="My Loom Space" />,
		);
		await expect(container).toBeAccessible();
	});

	it('should render containerIcon when icons have loaded and containerIcon is provided for WebLink', () => {
		render(
			<ContainerIcon
				{...defaultProps}
				containerType="WebLink"
				title="Web Link"
				containerIcon="https://example.com/icon.png"
			/>,
		);

		expect(screen.getByTestId('linked-container-WebLink-icon')).toBeVisible();
	});
});
