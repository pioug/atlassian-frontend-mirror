import React from 'react';

import { render, screen } from '@testing-library/react';

import {
	PanelActionExpand,
	PanelActionGroup,
	PanelActionMore,
	PanelActionNewTab,
	PanelBody,
	PanelContainer,
	PanelHeader,
	PanelTitle,
} from '../../index';

const testId = 'panel-system';

describe('Panel System', () => {
	const handleExpand = () => {
		console.log('Panel expanded to full screen');
	};

	const handleMoreActions = () => {
		console.log('More actions clicked');
	};

	const renderPanelSystem = () => (
		<PanelContainer testId={testId}>
			<PanelHeader>
				<PanelTitle>Test Panel</PanelTitle>
				<PanelActionGroup>
					<PanelActionExpand onClick={handleExpand} />
					<PanelActionNewTab href="https://atlassian.design/components" />
					<PanelActionMore onClick={handleMoreActions} />
				</PanelActionGroup>
			</PanelHeader>
			<PanelBody>
				<div>This is test content for the panel system.</div>
			</PanelBody>
		</PanelContainer>
	);

	it('should capture and report a11y violations', async () => {
		const { container } = render(renderPanelSystem());

		await expect(container).toBeAccessible();
	});

	it('should find PanelContainer by its testid', async () => {
		render(renderPanelSystem());

		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});

	it('should render all panel components correctly', () => {
		render(renderPanelSystem());

		// Test that the main container is present
		expect(screen.getByTestId(testId)).toBeInTheDocument();

		// Test that the title is rendered
		expect(screen.getByText('Test Panel')).toBeInTheDocument();

		// Test that the body content is rendered
		expect(screen.getByText('This is test content for the panel system.')).toBeInTheDocument();
	});
});
