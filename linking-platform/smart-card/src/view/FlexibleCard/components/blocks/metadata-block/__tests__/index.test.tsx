import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { ElementName, SmartLinkSize, SmartLinkStatus } from '../../../../../../constants';
import { type MetadataBlockProps } from '../types';
import MetadataBlock from '../index';

describe('MetadataBlock', () => {
	const renderMetadataBlock = (props?: MetadataBlockProps) => {
		return render(
			<IntlProvider locale="en">
				<FlexibleUiContext.Provider value={context}>
					<MetadataBlock status={SmartLinkStatus.Resolved} {...props} />
				</FlexibleUiContext.Provider>
			</IntlProvider>,
		);
	};

	it('renders MetadataBlock', async () => {
		const testId = 'test-smart-block-metadata';
		renderMetadataBlock({
			primary: [{ name: ElementName.ProgrammingLanguage }],
			secondary: [{ name: ElementName.State }],
			testId,
		});

		const block = await screen.findByTestId(`${testId}-resolved-view`);

		expect(block).toBeDefined();
	});

	it('does not render when there is no metadata elements', async () => {
		const { container } = await renderMetadataBlock();
		expect(container.children.length).toEqual(0);
	});

	it('renders primary metadata', async () => {
		renderMetadataBlock({
			primary: [{ name: ElementName.ProgrammingLanguage }],
		});

		const element = await screen.findByTestId('smart-element-badge');

		expect(element).toBeDefined();
	});

	it('renders secondary metadata', async () => {
		renderMetadataBlock({
			secondary: [{ name: ElementName.State }],
		});

		const element = await screen.findByTestId('smart-element-lozenge');

		expect(element).toBeDefined();
	});

	describe('with specific status', () => {
		it('renders MetadataBlock when status is resolved', async () => {
			renderMetadataBlock({
				primary: [{ name: ElementName.ProgrammingLanguage }],
			});

			const block = await screen.findByTestId('smart-block-metadata-resolved-view');

			expect(block).toBeDefined();
		});

		it.each([
			[SmartLinkStatus.Resolving],
			[SmartLinkStatus.Forbidden],
			[SmartLinkStatus.Errored],
			[SmartLinkStatus.NotFound],
			[SmartLinkStatus.Unauthorized],
			[SmartLinkStatus.Fallback],
		])('does not renders MetadataBlock when status is %s', async (status: SmartLinkStatus) => {
			const { container } = renderMetadataBlock({
				primary: [{ name: ElementName.ProgrammingLanguage }],
				status,
			});
			expect(container.children.length).toEqual(0);
		});
	});

	describe('with specific size', () => {
		it.each([
			[SmartLinkSize.XLarge, '1.75rem'],
			[SmartLinkSize.Large, '1.75rem'],
			[SmartLinkSize.Medium, '1.5rem'],
			[SmartLinkSize.Small, '1.5rem'],
		])(
			'renders element group with line-height when size is %s',
			async (size: SmartLinkSize, expected: string) => {
				renderMetadataBlock({
					primary: [{ name: ElementName.ProgrammingLanguage }],
					size,
				});

				const block = await screen.findByTestId('smart-element-group');

				expect(block).toHaveStyleDeclaration('line-height', expected);
			},
		);
	});

	it('renders with override css', async () => {
		const testId = 'test-smart-block-metadata';
		const overrideCss = css({
			backgroundColor: 'blue',
		});
		renderMetadataBlock({
			primary: [{ name: ElementName.ProgrammingLanguage }],
			overrideCss,
			testId,
		});

		const block = await screen.findByTestId(`${testId}-resolved-view`);

		expect(block).toHaveStyleDeclaration('background-color', 'blue');
	});
});
