import React from 'react';
import { render, screen } from '@testing-library/react';
import { PanelType } from '@atlaskit/adf-schema/panel';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import Panel from '../../../../react/nodes/panel';

describe('Renderer - React/Nodes/Panel', () => {
	it.each([PanelType.INFO, PanelType.NOTE, PanelType.TIP, PanelType.WARNING])(
		'should render an icon and the content for a %s panel',
		(panelType) => {
			render(<Panel panelType={panelType}>{`This is a ${panelType} panel`}</Panel>);

			expect(screen.getByLabelText(`${panelType} panel`)).toBeInTheDocument();
			expect(screen.getByText(`This is a ${panelType} panel`)).toBeInTheDocument();
		},
	);

	describe('custom panel', () => {
		const providerFactory = ProviderFactory.create({});

		const getCustomPanel = (container: HTMLElement) =>
			container.querySelector('[data-panel-type="custom"]');

		it('should wrap content with <div>-tag and have given emoji and background', () => {
			const { container } = render(
				<Panel
					panelType={PanelType.CUSTOM}
					panelColor={'#b5f71ca14'}
					panelIcon={':smiley:'}
					allowCustomPanels={true}
					providers={providerFactory}
				>
					This is a custom panel with custom emoji and background
				</Panel>,
			);

			expect(getCustomPanel(container)?.tagName).toBe('DIV');
			expect(getCustomPanel(container)).toHaveAttribute('data-panel-color', '#b5f71ca14');
			expect(container.querySelector('[data-emoji-short-name=":smiley:"]')).toBeInTheDocument();
		});

		it('custom panel should return div with data-panel-type attribute', () => {
			const { container } = render(
				<Panel
					panelType={PanelType.CUSTOM}
					panelColor={'#34eb6e'}
					panelIcon={':smiley:'}
					allowCustomPanels={true}
					providers={providerFactory}
				>
					This is a custom panel with custom emoji and background
				</Panel>,
			);

			expect(getCustomPanel(container)).toBeInTheDocument();
		});

		it('custom panel should return div with data-panel-color attribute', () => {
			const { container } = render(
				<Panel
					panelType={PanelType.CUSTOM}
					panelColor={'#34eb6e'}
					panelIcon={':smiley:'}
					allowCustomPanels={true}
					providers={providerFactory}
				>
					This is a custom panel with custom emoji and background
				</Panel>,
			);

			expect(getCustomPanel(container)).toHaveAttribute('data-panel-color', '#34eb6e');
		});

		it('custom panel should return div with data-panel-icon attribute', () => {
			const { container } = render(
				<Panel
					panelType={PanelType.CUSTOM}
					panelColor={'#34eb6e'}
					panelIcon={':smiley:'}
					allowCustomPanels={true}
					providers={providerFactory}
				>
					This is a custom panel with custom emoji and background
				</Panel>,
			);

			expect(getCustomPanel(container)).toHaveAttribute('data-panel-icon', ':smiley:');
		});

		it('should capture and report a11y violations', async () => {
			const { container } = render(
				<Panel
					panelType={PanelType.CUSTOM}
					panelColor={'#34eb6e'}
					panelIcon={':smiley:'}
					allowCustomPanels={true}
					providers={providerFactory}
				>
					This is a custom panel with custom emoji and background
				</Panel>,
			);

			await expect(container).toBeAccessible();
		});
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(<Panel panelType={PanelType.INFO}>This is an info panel</Panel>);

		await expect(container).toBeAccessible();
	});
});
