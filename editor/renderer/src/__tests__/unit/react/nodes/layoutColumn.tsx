import React from 'react';

import { render } from '@testing-library/react';

import LayoutColumn from '../../../../react/nodes/layoutColumn';
import { LayoutSectionCompiled } from '../../../../react/nodes/layoutColumn-compiled';
import { LayoutSectionEmotion } from '../../../../react/nodes/layoutColumn-emotion';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
const getLayoutColumnElement = (container: HTMLElement) =>
	container.querySelector('[data-layout-column]');

const layoutColumnImplementations = [
	{
		Component: LayoutSectionCompiled,
		expectVerticalAlignStyles: (element: ChildNode | null, justifyContent: string) => {
			expect(element).toHaveCompiledCss('display', 'flex');
			expect(element).toHaveCompiledCss('flexDirection', 'column');
			expect(element).toHaveCompiledCss('justifyContent', justifyContent);
		},
		name: 'compiled',
	},
	{
		Component: LayoutSectionEmotion,
		expectVerticalAlignStyles: (element: ChildNode | null, justifyContent: string) => {
			expect(element).toHaveStyleDeclaration('display', 'flex');
			expect(element).toHaveStyleDeclaration('flex-direction', 'column');
			expect(element).toHaveStyleDeclaration('justify-content', justifyContent);
		},
		name: 'emotion',
	},
] as const;

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
layoutColumnImplementations.forEach(
	({ Component: LayoutColumnImplementation, expectVerticalAlignStyles, name }) => {
		describe(`Renderer - React/Nodes/LayoutColumn ${name}`, () => {
			it('applies middle vertical alignment', async () => {
				const { container } = render(
					<LayoutColumnImplementation width={50} valign="middle">
						<p>test</p>
					</LayoutColumnImplementation>,
				);

				await expect(container).toBeAccessible();
				expectVerticalAlignStyles(getLayoutColumnElement(container), 'center');
			});

			it('applies bottom vertical alignment', () => {
				const { container } = render(
					<LayoutColumnImplementation width={50} valign="bottom">
						<p>test</p>
					</LayoutColumnImplementation>,
				);

				expectVerticalAlignStyles(getLayoutColumnElement(container), 'flex-end');
			});
		});
	},
);

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer - React/Nodes/LayoutColumn', () => {
	it('should wrap content with div-tag', () => {
		const { container } = render(
			<LayoutColumn>
				<p>test</p>
			</LayoutColumn>,
		);

		expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
	});

	it('renders no data-valign attribute when valign is absent', () => {
		const { container } = render(
			<LayoutColumn width={50}>
				<p>test</p>
			</LayoutColumn>,
		);

		expect(container.firstChild).not.toHaveAttribute('data-valign');
	});

	it.each(['top', 'middle', 'bottom'] as const)(
		'renders data-valign attribute for %s valign',
		(valign) => {
			const { container } = render(
				<LayoutColumn width={50} valign={valign}>
					<p>test</p>
				</LayoutColumn>,
			);

			expect(container.firstChild).toHaveAttribute('data-valign', valign);
		},
	);
});
