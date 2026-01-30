import React from 'react';

import { render, screen } from '@testing-library/react';

import FeatureGate from '@atlaskit/feature-gate-js-client';

import type { ContainerTypes } from '../../types';

import { ContainerIcon } from './index';

jest.mock('../loom-avatar', () => ({
	LoomSpaceAvatar: () => <div data-testid="loom-space-avatar">Loom Space Avatar</div>,
}));

jest.mock('@atlaskit/feature-gate-js-client', () => ({
	...jest.requireActual('@atlaskit/feature-gate-js-client'),
	initialize: jest.fn(),
	initializeCalled: jest.fn(),
	initializeFromValues: jest.fn(),
	getExperimentValue: jest.fn(),
	checkGate: jest.fn(),
	initializeCompleted: () => true,
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
		render(
			<ContainerIcon
				{...defaultProps}
				containerType="WebLink"
				title="Web Link"
				iconHasLoaded={true}
			/>,
		);

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

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<ContainerIcon {...defaultProps} containerType="LoomSpace" title="My Loom Space" />,
		);
		await expect(container).toBeAccessible();
	});

	it('should render IconSkeleton when iconsLoading is true (loading state)', () => {
		(FeatureGate.getExperimentValue as jest.Mock).mockImplementation((exp) =>
			exp === 'new_team_profile' ? false : true,
		);
		render(
			<ContainerIcon
				{...defaultProps}
				containerType="WebLink"
				title="Web Link"
				iconsLoading={true}
				iconHasLoaded={false}
			/>,
		);

		expect(screen.getByTestId('container-icon-skeleton')).toBeVisible();
	});

	it('should render different icon for link when experiment is enabled', () => {
		(FeatureGate.getExperimentValue as jest.Mock).mockImplementation((exp) =>
			exp === 'new_team_profile' ? true : false,
		);
		render(
			<ContainerIcon
				{...defaultProps}
				containerType="WebLink"
				title="Web Link"
				iconsLoading={true}
				iconHasLoaded={false}
			/>,
		);

		expect(screen.getByTestId('linked-container-WebLink-new-icon')).toBeVisible();
	});

	it('should render LinkIcon when icons have loaded and no containerIcon for WebLink', () => {
		(FeatureGate.getExperimentValue as jest.Mock).mockImplementation((exp) =>
			exp === 'new_team_profile' ? false : true,
		);
		render(
			<ContainerIcon
				{...defaultProps}
				containerType="WebLink"
				title="Web Link"
				iconsLoading={false}
				iconHasLoaded={true}
			/>,
		);

		expect(screen.getByTestId('linked-container-WebLink-icon')).toBeVisible();
		expect(screen.queryByTestId('container-icon-skeleton')).not.toBeInTheDocument();
	});

	it('should rendernew LinkIcon when icons have loaded and no containerIcon for WebLink when experiment is enabled', () => {
		(FeatureGate.getExperimentValue as jest.Mock).mockImplementation((exp) =>
			exp === 'new_team_profile' ? true : false,
		);
		render(
			<ContainerIcon
				{...defaultProps}
				containerType="WebLink"
				title="Web Link"
				iconsLoading={false}
				iconHasLoaded={true}
			/>,
		);

		expect(screen.getByTestId('linked-container-WebLink-new-icon')).toBeVisible();
		expect(screen.queryByTestId('container-icon-skeleton')).not.toBeInTheDocument();
	});

	it('should render containerIcon when icons have loaded and containerIcon is provided for WebLink', () => {
		(FeatureGate.getExperimentValue as jest.Mock).mockImplementation((exp) =>
			exp === 'new_team_profile' ? false : true,
		);
		render(
			<ContainerIcon
				{...defaultProps}
				containerType="WebLink"
				title="Web Link"
				containerIcon="https://example.com/icon.png"
				iconsLoading={false}
				iconHasLoaded={true}
			/>,
		);

		expect(screen.getByTestId('linked-container-WebLink-icon')).toBeVisible();
		expect(screen.queryByTestId('container-icon-skeleton')).not.toBeInTheDocument();
	});
});
