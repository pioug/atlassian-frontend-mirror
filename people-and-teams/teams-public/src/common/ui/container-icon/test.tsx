import React from 'react';

import { render, screen } from '@testing-library/react';

import type { ContainerTypes } from '../../types';

import { ContainerIcon } from './index';

jest.mock('../loom-avatar', () => ({
	LoomSpaceAvatar: () => <div data-testid="loom-space-avatar">Loom Space Avatar</div>,
}));

describe('ContainerIcon', () => {
	const defaultProps = {
		title: 'Test Container',
		containerType: 'ConfluenceSpace' as ContainerTypes,
	};

	it('should render LoomSpaceAvatar for LoomSpace container type', () => {
		render(<ContainerIcon {...defaultProps} containerType="LoomSpace" title="My Loom Space" />);

		expect(screen.getByTestId('loom-space-avatar')).toBeVisible();
	});

	it('should render LinkIcon with correct testId when containerType is WebLink and no containerIcon is provided', () => {
		render(<ContainerIcon {...defaultProps} containerType="WebLink" title="Web Link" />);

		expect(screen.getByTestId('linked-container-WebLink-icon')).toBeVisible();
	});

	it('should render Avatar with correct testId when containerType is WebLink and containerIcon is provided', () => {
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

	it('should render Avatar with correct testId for ConfluenceSpace container type', () => {
		render(
			<ContainerIcon
				{...defaultProps}
				containerType="ConfluenceSpace"
				title="Confluence Space"
				containerIcon="https://example.com/confluence-icon.png"
			/>,
		);

		expect(screen.getByTestId('linked-container-ConfluenceSpace-icon')).toBeVisible();
	});

	it('should render Avatar with correct testId for JiraProject container type', () => {
		render(
			<ContainerIcon
				{...defaultProps}
				containerType="JiraProject"
				title="Jira Project"
				containerIcon="https://example.com/jira-icon.png"
			/>,
		);

		expect(screen.getByTestId('linked-container-JiraProject-icon')).toBeVisible();
	});
});
