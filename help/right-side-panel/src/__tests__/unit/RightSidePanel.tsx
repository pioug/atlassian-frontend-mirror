import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '@atlaskit/page';
import { RightSidePanel, FlexContainer, ContentWrapper } from '../../index';

describe('RightSidePanel', () => {
	let container: HTMLElement;

	beforeEach(() => {
		// Create and append the container element
		container = document.createElement('div');
		container.setAttribute('id', 'RightSidePanelTest');
		document.body.appendChild(container);
	});

	afterEach(() => {
		// Cleanup after each test
		container.remove();
	});

	describe('Render only if the attachPanelTo prop is defined and valid', () => {
		it('Should render if the attachPanelTo value is correct', () => {
			render(
				<ContentWrapper>
					<Page />
					<RightSidePanel isOpen={true} attachPanelTo="RightSidePanelTest">
						<h1>Content</h1>
					</RightSidePanel>
				</ContentWrapper>,
			);

			expect(screen.getByRole('heading', { name: /content/i })).toBeInTheDocument();
		});

		it('Should not render if the attachPanelTo value is not correct', () => {
			render(
				<FlexContainer id="RightSidePanelTest">
					<ContentWrapper>
						<Page />
						<RightSidePanel isOpen={true} attachPanelTo="otherId">
							<h1>Content</h1>
						</RightSidePanel>
					</ContentWrapper>
				</FlexContainer>,
			);

			expect(screen.queryByRole('heading', { name: /content/i })).not.toBeInTheDocument();
		});

		it('Should render content in the right-side-panel', () => {
			render(
				<FlexContainer id="RightSidePanelTest">
					<ContentWrapper>
						<Page />
						<RightSidePanel isOpen={true} attachPanelTo="RightSidePanelTest">
							<h1>Content</h1>
						</RightSidePanel>
					</ContentWrapper>
				</FlexContainer>,
			);

			expect(screen.getByRole('heading')).toHaveTextContent('Content');
		});

		it('RightSidePanelDrawer should not be visible if isOpen is false', () => {
			render(
				<FlexContainer id="RightSidePanelTest">
					<ContentWrapper>
						<Page />
						<RightSidePanel isOpen={false} attachPanelTo="RightSidePanelTest">
							<h1>Content</h1>
						</RightSidePanel>
					</ContentWrapper>
				</FlexContainer>,
			);

			expect(screen.queryByRole('heading', { name: /content/i })).not.toBeInTheDocument();
		});
	});
});
