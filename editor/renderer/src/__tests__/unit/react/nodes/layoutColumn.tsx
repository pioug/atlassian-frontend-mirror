import React from 'react';
import { render } from '@testing-library/react';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import LayoutColumn from '../../../../react/nodes/layoutColumn';
import { LayoutSectionCompiled } from '../../../../react/nodes/layoutColumn-compiled';
import { LayoutSectionEmotion } from '../../../../react/nodes/layoutColumn-emotion';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
const getLayoutColumnElement = (container: HTMLElement) =>
	container.querySelector('[data-layout-column]');

const layoutColumnImplementations = [
	{
		Component: LayoutSectionCompiled,
		expectNoVerticalAlignStyles: (element: ChildNode | null) => {
			expect(element).not.toHaveCompiledCss('display', 'flex');
			expect(element).not.toHaveCompiledCss('flexDirection', 'column');
			expect(element).not.toHaveCompiledCss('justifyContent', 'center');
			expect(element).not.toHaveCompiledCss('justifyContent', 'flex-end');
		},
		expectVerticalAlignStyles: (element: ChildNode | null, justifyContent: string) => {
			expect(element).toHaveCompiledCss('display', 'flex');
			expect(element).toHaveCompiledCss('flexDirection', 'column');
			expect(element).toHaveCompiledCss('justifyContent', justifyContent);
		},
		name: 'compiled',
	},
	{
		Component: LayoutSectionEmotion,
		expectNoVerticalAlignStyles: (element: ChildNode | null) => {
			expect(element).not.toHaveStyleDeclaration('display', 'flex');
			expect(element).not.toHaveStyleDeclaration('flex-direction', 'column');
			expect(element).not.toHaveStyleDeclaration('justify-content', 'center');
			expect(element).not.toHaveStyleDeclaration('justify-content', 'flex-end');
		},
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
	({
		Component: LayoutColumnImplementation,
		expectNoVerticalAlignStyles,
		expectVerticalAlignStyles,
		name,
	}) => {
		describe(`Renderer - React/Nodes/LayoutColumn ${name}`, () => {
			afterEach(() => {
				setupEditorExperiments('test', {}, {}, { disableTestOverrides: true });
			});

			it('applies vertical-align styles when rendering experiment is on and menu is off', async () => {
				setupEditorExperiments('test', {
					platform_editor_layout_column_valign_rendering: true,
					platform_editor_layout_column_menu: false,
				});

				const { container } = render(
					<LayoutColumnImplementation width={50} valign="middle">
						<p>test</p>
					</LayoutColumnImplementation>,
				);

				await expect(container).toBeAccessible();
				expectVerticalAlignStyles(getLayoutColumnElement(container), 'center');
			});

			it('preserves vertical-align styles when rendering experiment is off and menu is on', () => {
				setupEditorExperiments('test', {
					platform_editor_layout_column_valign_rendering: false,
					platform_editor_layout_column_menu: true,
				});

				const { container } = render(
					<LayoutColumnImplementation width={50} valign="bottom">
						<p>test</p>
					</LayoutColumnImplementation>,
				);

				expectVerticalAlignStyles(getLayoutColumnElement(container), 'flex-end');
			});

			it('does not apply vertical-align styles when both rendering experiment and menu are off', () => {
				setupEditorExperiments('test', {
					platform_editor_layout_column_valign_rendering: false,
					platform_editor_layout_column_menu: false,
				});

				const { container } = render(
					<LayoutColumnImplementation width={50} valign="middle">
						<p>test</p>
					</LayoutColumnImplementation>,
				);

				expectNoVerticalAlignStyles(getLayoutColumnElement(container));
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
