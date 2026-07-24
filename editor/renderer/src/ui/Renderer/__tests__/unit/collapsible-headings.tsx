import React from 'react';
import { IntlProvider } from 'react-intl';

import { act } from '@atlassian/testing-library/act';
import { fireEvent } from '@atlassian/testing-library/fire-event';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';
import { waitFor } from '@atlassian/testing-library/wait-for';

import { PanelType } from '@atlaskit/adf-schema/panel';
import type { DocNode } from '@atlaskit/adf-schema/doc';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';

import { RendererFunctionalComponent as Renderer } from '../../index';
import { RendererStyleContainer } from '../../RendererStyleContainer';
import type { RendererAppearance } from '../../types';
import { Doc } from '../../../../react/nodes';
import Panel from '../../../../react/nodes/panel';
import { CollapsibleHeadingsProvider, useCollapsibleHeading } from '../../../collapsible-headings';
import { buildTopLevelHeadingSections } from '../../../collapsible-headings-section-model';

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: (experimentName: string) =>
		experimentName === 'platform_renderer_collapsible_headings',
}));

jest.mock('@atlaskit/icon/core/chevron-down', () => ({
	__esModule: true,
	default: ({ label, size }: { label: string; size: string }) => (
		<span data-testid="chevron-down-icon" data-label={label} data-size={size} />
	),
}));

jest.mock('@atlaskit/icon/core/chevron-right', () => ({
	__esModule: true,
	default: ({ label, size }: { label: string; size: string }) => (
		<span data-testid="chevron-right-icon" data-label={label} data-size={size} />
	),
}));

const documentWithHeadingSections: DocNode = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'heading',
			attrs: { level: 1 },
			content: [{ type: 'text', text: 'Alpha' }],
		},
		{
			type: 'paragraph',
			content: [{ type: 'text', text: 'Alpha content' }],
		},
		{
			type: 'heading',
			attrs: { level: 2 },
			content: [{ type: 'text', text: 'Beta' }],
		},
		{
			type: 'paragraph',
			content: [{ type: 'text', text: 'Beta content' }],
		},
		{
			type: 'heading',
			attrs: { level: 3 },
			content: [{ type: 'text', text: 'Gamma' }],
		},
		{
			type: 'paragraph',
			content: [{ type: 'text', text: 'Gamma content' }],
		},
		{
			type: 'heading',
			attrs: { level: 2 },
			content: [{ type: 'text', text: 'Delta' }],
		},
		{
			type: 'paragraph',
			content: [{ type: 'text', text: 'Delta content' }],
		},
		{
			type: 'heading',
			attrs: { level: 1 },
			content: [{ type: 'text', text: 'Omega' }],
		},
		{
			type: 'paragraph',
			content: [{ type: 'text', text: 'Omega content' }],
		},
	],
};

const documentWithTableSectionContent: DocNode = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'heading',
			attrs: { level: 2 },
			content: [{ type: 'text', text: 'Rich content section' }],
		},
		{
			type: 'table',
			attrs: { isNumberColumnEnabled: false, layout: 'default' },
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Table section content' }],
								},
							],
						},
					],
				},
			],
		},
		{
			type: 'heading',
			attrs: { level: 2 },
			content: [{ type: 'text', text: 'Following section' }],
		},
	],
};

const documentWithEmptyHeadingSections: DocNode = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'heading',
			attrs: { level: 1 },
			content: [{ type: 'text', text: 'Empty section' }],
		},
		{
			type: 'heading',
			attrs: { level: 1 },
			content: [{ type: 'text', text: 'Section with content' }],
		},
		{
			type: 'paragraph',
			content: [{ type: 'text', text: 'Only collapsible content' }],
		},
		{
			type: 'heading',
			attrs: { level: 1 },
			content: [{ type: 'text', text: 'Empty final section' }],
		},
	],
};

const progressiveDocument: DocNode = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'heading',
			attrs: { level: 1 },
			content: [{ type: 'text', text: 'Progressive heading' }],
		},
		{
			type: 'paragraph',
			content: [{ type: 'text', text: 'Initial progressive content' }],
		},
	],
};

const panelDocument: DocNode = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'heading',
			attrs: { level: 2 },
			content: [{ type: 'text', text: 'Panel section heading' }],
		},
		{
			type: 'panel',
			attrs: { panelType: PanelType.INFO },
			content: [
				{
					type: 'paragraph',
					content: [{ type: 'text', text: 'Panel section content' }],
				},
			],
		},
		{
			type: 'heading',
			attrs: { level: 2 },
			content: [{ type: 'text', text: 'Following panel section' }],
		},
	],
};

const multipleRendererDocumentsDocument: DocNode = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'heading',
			attrs: { level: 1 },
			content: [{ type: 'text', text: 'First renderer heading' }],
		},
		{
			type: 'paragraph',
			content: [{ type: 'text', text: 'First renderer content' }],
		},
		{
			type: 'heading',
			attrs: { level: 1 },
			content: [{ type: 'text', text: 'Second renderer heading' }],
		},
		{
			type: 'paragraph',
			content: [{ type: 'text', text: 'Second renderer content' }],
		},
	],
};

function getHeadingPosition(
	sections: ReadonlyArray<{ headingPos: number }>,
	index: number,
): number {
	const headingPos = sections[index]?.headingPos;
	if (headingPos === undefined) {
		throw new Error(`Expected heading section at index ${index}`);
	}
	return headingPos;
}

const progressivePmDocument = defaultSchema.nodeFromJSON(progressiveDocument);
const progressiveHeadingPos = getHeadingPosition(
	buildTopLevelHeadingSections(progressivePmDocument),
	0,
);
const panelPmDocument = defaultSchema.nodeFromJSON(panelDocument);
const panelSections = buildTopLevelHeadingSections(panelPmDocument);
const panelHeadingPos = getHeadingPosition(panelSections, 0);
const panelFollowingHeadingPos = getHeadingPosition(panelSections, 1);
const multipleRendererDocumentsPmDocument = defaultSchema.nodeFromJSON(
	multipleRendererDocumentsDocument,
);
const multipleRendererDocumentSections = buildTopLevelHeadingSections(
	multipleRendererDocumentsPmDocument,
);
const firstRendererHeadingPos = getHeadingPosition(multipleRendererDocumentSections, 0);
const secondRendererHeadingPos = getHeadingPosition(multipleRendererDocumentSections, 1);

function getDirectRendererChild(element: HTMLElement): HTMLElement | null {
	const rendererDocument = element.closest<HTMLElement>('.ak-renderer-document');
	let currentElement: HTMLElement | null = element;

	while (currentElement && currentElement.parentElement !== rendererDocument) {
		currentElement = currentElement.parentElement;
	}

	return currentElement?.parentElement === rendererDocument ? currentElement : null;
}

function renderRenderer({
	appearance = 'full-page',
	allowCollapsibleHeadings = true,
	document = documentWithHeadingSections,
}: {
	allowCollapsibleHeadings?: boolean;
	appearance?: RendererAppearance;
	document?: DocNode;
} = {}) {
	return render(
		<RendererWithIntl
			allowCollapsibleHeadings={allowCollapsibleHeadings}
			appearance={appearance}
			document={document}
		/>,
	);
}

function RendererWithIntl({
	appearance = 'full-page',
	allowCollapsibleHeadings = true,
	document = documentWithHeadingSections,
}: {
	allowCollapsibleHeadings?: boolean;
	appearance?: RendererAppearance;
	document?: DocNode;
}) {
	return (
		<IntlProvider locale="en">
			<Renderer
				allowCollapsibleHeadings={allowCollapsibleHeadings}
				appearance={appearance}
				document={document}
			/>
		</IntlProvider>
	);
}

function ProgressiveRendererToggle({
	onRender,
}: {
	onRender?: (collapsibleHeading: ReturnType<typeof useCollapsibleHeading>) => void;
} = {}) {
	const collapsibleHeading = useCollapsibleHeading(progressiveHeadingPos, true);

	React.useEffect(() => {
		onRender?.(collapsibleHeading);
	});

	return <button onClick={collapsibleHeading?.toggle}>Toggle progressive heading</button>;
}

function ProgressiveRendererHarness({
	onRender,
}: {
	onRender?: (collapsibleHeading: ReturnType<typeof useCollapsibleHeading>) => void;
} = {}) {
	const rendererRef = React.useRef<HTMLDivElement>(null);

	return (
		<RendererStyleContainer
			allowColumnSorting={false}
			allowNestedHeaderLinks={false}
			appearance="full-page"
			innerRef={rendererRef}
			useBlockRenderForCodeBlock
		>
			<CollapsibleHeadingsProvider
				isEnabled
				pmDocument={progressivePmDocument}
				rendererRef={rendererRef}
			>
				<ProgressiveRendererToggle onRender={onRender} />
				<Doc>
					<h1 data-renderer-start-pos={progressiveHeadingPos}>Progressive heading</h1>
					<p>Initial progressive content</p>
				</Doc>
			</CollapsibleHeadingsProvider>
		</RendererStyleContainer>
	);
}

function PanelRendererHarness() {
	const rendererRef = React.useRef<HTMLDivElement>(null);

	return (
		<RendererStyleContainer
			allowColumnSorting={false}
			allowNestedHeaderLinks={false}
			appearance="full-page"
			innerRef={rendererRef}
			useBlockRenderForCodeBlock
		>
			<CollapsibleHeadingsProvider isEnabled pmDocument={panelPmDocument} rendererRef={rendererRef}>
				<ProgressiveRendererToggle />
				<Doc>
					<h2 data-renderer-start-pos={panelHeadingPos}>Panel section heading</h2>
					<Panel panelType={PanelType.INFO}>
						<p>Panel section content</p>
					</Panel>
					<h2 data-renderer-start-pos={panelFollowingHeadingPos}>Following panel section</h2>
				</Doc>
			</CollapsibleHeadingsProvider>
		</RendererStyleContainer>
	);
}

function MultipleRendererDocumentsToggle({ label, startPos }: { label: string; startPos: number }) {
	const collapsibleHeading = useCollapsibleHeading(startPos, true);
	return <button onClick={collapsibleHeading?.toggle}>{label}</button>;
}

function MultipleRendererDocumentsHarness() {
	const rendererRef = React.useRef<HTMLDivElement>(null);

	return (
		<div ref={rendererRef}>
			<CollapsibleHeadingsProvider
				isEnabled
				pmDocument={multipleRendererDocumentsPmDocument}
				rendererRef={rendererRef}
			>
				<MultipleRendererDocumentsToggle
					label="Toggle first heading"
					startPos={firstRendererHeadingPos}
				/>
				<MultipleRendererDocumentsToggle
					label="Toggle second heading"
					startPos={secondRendererHeadingPos}
				/>
				<Doc>
					<h1 data-renderer-start-pos={firstRendererHeadingPos}>First renderer heading</h1>
					<p>First renderer content</p>
				</Doc>
				<Doc>
					<h1 data-renderer-start-pos={secondRendererHeadingPos}>Second renderer heading</h1>
					<p>Second renderer content</p>
				</Doc>
			</CollapsibleHeadingsProvider>
		</div>
	);
}

let originalBeforeMatchDescriptor: PropertyDescriptor | undefined;

beforeAll(() => {
	originalBeforeMatchDescriptor = Object.getOwnPropertyDescriptor(document.body, 'onbeforematch');
	Object.defineProperty(document.body, 'onbeforematch', {
		configurable: true,
		value: null,
	});
});

afterAll(() => {
	if (originalBeforeMatchDescriptor) {
		Object.defineProperty(document.body, 'onbeforematch', originalBeforeMatchDescriptor);
	} else {
		delete (document.body as unknown as { onbeforematch?: unknown }).onbeforematch;
	}
});

describe('collapsible headings', () => {
	it('builds top-level section ranges from the document model', () => {
		const pmDocument = defaultSchema.nodeFromJSON(documentWithHeadingSections);
		const sections = buildTopLevelHeadingSections(pmDocument);

		expect(sections.map(({ level }) => level)).toEqual([1, 2, 3, 2, 1]);
		expect(sections[0].to).toBe(sections[4].headingPos);
		expect(sections[1].to).toBe(sections[3].headingPos);
		expect(sections[2].to).toBe(sections[3].headingPos);
		expect(sections[3].to).toBe(sections[4].headingPos);
		expect(sections[4].to).toBe(pmDocument.content.size + 1);
		expect(sections.every(({ contentFrom, headingPos }) => contentFrom > headingPos)).toBe(true);
	});

	it('keeps hook results stable until the collapse state changes', async () => {
		const observedStates: ReturnType<typeof useCollapsibleHeading>[] = [];
		const onRender = (collapsibleHeading: ReturnType<typeof useCollapsibleHeading>) => {
			observedStates.push(collapsibleHeading);
		};
		const { rerender } = render(<ProgressiveRendererHarness onRender={onRender} />);

		await waitFor(() => {
			expect(observedStates[observedStates.length - 1]).not.toBeNull();
		});
		const initialState = observedStates[observedStates.length - 1];
		const observedRenderCount = observedStates.length;

		rerender(<ProgressiveRendererHarness onRender={onRender} />);

		await waitFor(() => {
			expect(observedStates.length).toBeGreaterThan(observedRenderCount);
		});
		expect(observedStates[observedStates.length - 1]).toBe(initialState);

		act(() => initialState?.toggle());

		await waitFor(() => {
			expect(observedStates[observedStates.length - 1]?.isCollapsed).toBe(true);
		});
		const collapsedState = observedStates[observedStates.length - 1];
		expect(collapsedState).not.toBe(initialState);
		expect(collapsedState?.toggle).toBe(initialState?.toggle);
	});

	it('preserves collapsed sections when the renderer rerenders an equivalent document', async () => {
		const { rerender } = renderRenderer();
		const betaHeading = screen.getByRole('heading', { name: 'Beta' });
		const betaContent = screen.getByText('Beta content').closest('p');
		if (!betaContent) {
			throw new Error('Expected Beta content to be rendered in a paragraph');
		}

		await userEvent.hover(betaHeading);
		await userEvent.click(screen.getAllByRole('button', { name: 'Collapse section' })[1]);
		await waitFor(() => expect(betaContent).toHaveAttribute('hidden', 'until-found'));

		rerender(<RendererWithIntl document={{ ...documentWithHeadingSections }} />);

		await waitFor(() =>
			expect(screen.getByText('Beta content').closest('p')).toHaveAttribute(
				'hidden',
				'until-found',
			),
		);
		expect(screen.getByRole('button', { name: 'Expand section' })).toHaveAttribute(
			'aria-expanded',
			'false',
		);
	});

	it('does not render controls when collapsible headings are not allowed', () => {
		renderRenderer({ allowCollapsibleHeadings: false });

		expect(screen.queryByRole('button', { name: 'Collapse section' })).not.toBeInTheDocument();
	});

	it('does not render controls outside the supported appearances', () => {
		renderRenderer({ appearance: 'comment' });

		expect(screen.queryByRole('button', { name: 'Collapse section' })).not.toBeInTheDocument();
	});

	it('only renders a control for headings with section content', () => {
		renderRenderer({ document: documentWithEmptyHeadingSections });

		expect(screen.getAllByRole('button', { name: 'Collapse section' })).toHaveLength(1);
	});

	it('does not collapse an empty heading at the same level', async () => {
		renderRenderer({ document: documentWithEmptyHeadingSections });

		const sectionContent = screen.getByText('Only collapsible content').closest('p');
		const emptyFollowingHeading = getDirectRendererChild(
			screen.getByRole('heading', { name: 'Empty final section' }),
		);
		if (!sectionContent || !emptyFollowingHeading) {
			throw new Error('Expected section content and the following heading to be rendered');
		}

		await userEvent.hover(screen.getByRole('heading', { name: 'Section with content' }));
		await userEvent.click(screen.getByRole('button', { name: 'Collapse section' }));

		await waitFor(() => expect(sectionContent).toHaveAttribute('hidden', 'until-found'));
		expect(emptyFollowingHeading).not.toHaveAttribute('hidden');
	});

	it.each(['full-page', 'full-width', 'max'] as const)(
		'renders controls in the %s appearance',
		(appearance) => {
			renderRenderer({ appearance });

			expect(screen.getAllByRole('button', { name: 'Collapse section' })).not.toHaveLength(0);
		},
	);

	it('shows the toggle for keyboard focus', () => {
		renderRenderer();

		const button = screen.getAllByRole('button', { name: 'Collapse section' })[1];
		const buttonContainer = button.parentElement;
		if (!buttonContainer) {
			throw new Error('Expected the collapse button to have a container');
		}
		const matches = button.matches.bind(button);
		const matchesSpy = jest
			.spyOn(button, 'matches')
			.mockImplementation((selector) => (selector === ':focus-visible' ? true : matches(selector)));

		fireEvent.focus(button);

		expect(buttonContainer).not.toHaveCompiledCss('opacity', '0');

		fireEvent.blur(button);

		expect(buttonContainer).toHaveCompiledCss('opacity', '0');
		matchesSpy.mockRestore();
	});

	it('hides an expanded toggle after the pointer leaves the heading', async () => {
		renderRenderer();

		const heading = screen.getByRole('heading', { name: 'Beta' });
		const button = screen.getAllByRole('button', { name: 'Collapse section' })[1];
		const buttonContainer = button.parentElement;
		if (!buttonContainer) {
			throw new Error('Expected the collapse button to have a container');
		}
		const matches = button.matches.bind(button);
		const matchesSpy = jest
			.spyOn(button, 'matches')
			.mockImplementation((selector) =>
				selector === ':focus-visible' ? false : matches(selector),
			);

		await userEvent.hover(heading);
		await userEvent.click(button);
		await userEvent.unhover(heading);

		expect(buttonContainer).not.toHaveCompiledCss('opacity', '0');

		await userEvent.hover(heading);
		await userEvent.click(screen.getByRole('button', { name: 'Expand section' }));
		await userEvent.unhover(heading);

		expect(buttonContainer).toHaveCompiledCss('opacity', '0');
		matchesSpy.mockRestore();
	});

	it('collapses until the next top-level heading of an equal or greater size', async () => {
		const { container } = renderRenderer();
		await expect(container).toBeAccessible();

		const betaContent = screen.getByText('Beta content');
		const gammaHeading = screen.getByRole('heading', { name: 'Gamma' });
		const gammaContent = screen.getByText('Gamma content');
		const deltaHeading = screen.getByRole('heading', { name: 'Delta' });
		const alphaContent = screen.getByText('Alpha content');
		const betaHeading = screen.getByRole('heading', { name: 'Beta' });
		const betaButton = screen.getAllByRole('button', { name: 'Collapse section' })[1];

		expect(betaButton).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getAllByTestId('chevron-down-icon')[1]).toHaveAttribute('data-size', 'small');
		expect(screen.getAllByTestId('chevron-down-icon')[1]).toHaveAttribute('data-label', '');

		await userEvent.hover(betaHeading);
		await userEvent.click(betaButton);

		await waitFor(() => expect(betaContent.closest('p')).toHaveAttribute('hidden', 'until-found'));
		expect(getDirectRendererChild(gammaHeading)).toHaveAttribute('hidden', 'until-found');
		expect(gammaContent.closest('p')).toHaveAttribute('hidden', 'until-found');
		expect(getDirectRendererChild(deltaHeading)).not.toHaveAttribute('hidden');
		expect(alphaContent.closest('p')).not.toHaveAttribute('hidden');

		const expandBetaButton = screen.getByRole('button', { name: 'Expand section' });
		expect(expandBetaButton).toHaveAttribute('aria-expanded', 'false');
		expect(screen.getByTestId('chevron-right-icon')).toHaveAttribute('data-size', 'small');

		await userEvent.click(expandBetaButton);
		await waitFor(() => expect(betaContent.closest('p')).not.toHaveAttribute('hidden'));
	});

	it('tracks every collapsed ancestor of nested section content', async () => {
		renderRenderer();

		const alphaHeading = screen.getByRole('heading', { name: 'Alpha' });
		const betaHeading = screen.getByRole('heading', { name: 'Beta' });
		const betaContent = screen.getByText('Beta content').closest('p');
		const alphaButton = getDirectRendererChild(alphaHeading)?.querySelector('button');
		const betaButton = getDirectRendererChild(betaHeading)?.querySelector('button');
		const alphaPosition = Number(alphaHeading.getAttribute('data-renderer-start-pos'));
		const betaPosition = Number(betaHeading.getAttribute('data-renderer-start-pos'));
		if (!alphaButton || !betaButton || !betaContent) {
			throw new Error('Expected collapsible headings and nested section content');
		}

		await userEvent.hover(betaHeading);
		await userEvent.click(betaButton);
		await userEvent.hover(alphaHeading);
		await userEvent.click(alphaButton);

		await waitFor(() =>
			expect(betaContent).toHaveAttribute(
				'data-renderer-collapsed-content-owners',
				`${alphaPosition},${betaPosition}`,
			),
		);

		await userEvent.click(alphaButton);
		await waitFor(() =>
			expect(betaContent).toHaveAttribute(
				'data-renderer-collapsed-content-owners',
				String(betaPosition),
			),
		);
	});

	it('expands a collapsed section when browser Find reveals a matching heading', async () => {
		renderRenderer();

		const betaContent = screen.getByText('Beta content').closest('p');
		const gammaHeadingWrapper = getDirectRendererChild(
			screen.getByRole('heading', { name: 'Gamma' }),
		);
		if (!betaContent) {
			throw new Error('Expected Beta content to be rendered in a paragraph');
		}
		if (!gammaHeadingWrapper) {
			throw new Error('Expected Gamma to have a collapsible heading wrapper');
		}

		await userEvent.hover(screen.getByRole('heading', { name: 'Beta' }));
		await userEvent.click(screen.getAllByRole('button', { name: 'Collapse section' })[1]);
		await waitFor(() => expect(gammaHeadingWrapper).toHaveAttribute('hidden', 'until-found'));
		expect(window.getComputedStyle(gammaHeadingWrapper).display).toBe('block');

		act(() => {
			gammaHeadingWrapper.dispatchEvent(new Event('beforematch'));
		});

		await waitFor(() => expect(betaContent).not.toHaveAttribute('hidden'));
		expect(screen.queryByRole('button', { name: 'Expand section' })).not.toBeInTheDocument();
	});

	it('uses a collapse-only wrapper when the copy-link heading-wrapper experiment is disabled', () => {
		renderRenderer();

		const alphaHeading = screen.getByRole('heading', { name: 'Alpha' });
		const collapsibleHeadingWrapper = alphaHeading.closest(
			'[data-testid="renderer-collapsible-heading-wrapper"]',
		);

		expect(collapsibleHeadingWrapper).toHaveAttribute(
			'data-testid',
			'renderer-collapsible-heading-wrapper',
		);
		expect(collapsibleHeadingWrapper).not.toHaveClass('renderer-heading-wrapper');
	});

	it('hides a table renderer container within a collapsed section', async () => {
		renderRenderer({ document: documentWithTableSectionContent });

		const tableContainer = getDirectRendererChild(screen.getByText('Table section content'));
		const collapseButton = screen.getAllByRole('button', { name: 'Collapse section' })[0];

		expect(tableContainer).not.toBeNull();
		if (!tableContainer) {
			throw new Error('Expected the table content to have a direct renderer container');
		}

		await userEvent.hover(screen.getByRole('heading', { name: 'Rich content section' }));
		await userEvent.click(collapseButton);

		await waitFor(() => expect(tableContainer).toHaveAttribute('hidden', 'until-found'));
		expect(tableContainer).toHaveAttribute('data-renderer-collapsed-content-owners');
	});

	it('hides a panel renderer container within a collapsed section', async () => {
		render(<PanelRendererHarness />);

		const panelContainer = getDirectRendererChild(screen.getByText('Panel section content'));
		expect(panelContainer).not.toBeNull();
		if (!panelContainer) {
			throw new Error('Expected the panel content to have a direct renderer container');
		}

		const toggleButton = screen.getByRole('button', { name: 'Toggle progressive heading' });
		await userEvent.click(toggleButton);

		await waitFor(() => expect(panelContainer).toHaveAttribute('hidden', 'until-found'));
		expect(panelContainer).toHaveAttribute(
			'data-renderer-collapsed-content-owners',
			String(panelHeadingPos),
		);

		await userEvent.click(toggleButton);
		await waitFor(() => expect(panelContainer).not.toHaveAttribute('hidden'));
		expect(window.getComputedStyle(panelContainer).display).toBe('flex');
	});

	it('does not add controls to headings nested in renderer content', () => {
		const documentWithNestedHeading: DocNode = {
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'heading',
					attrs: { level: 1 },
					content: [{ type: 'text', text: 'Top-level heading' }],
				},
				{
					type: 'layoutSection',
					content: [
						{
							type: 'layoutColumn',
							attrs: { width: 100 },
							content: [
								{
									type: 'heading',
									attrs: { level: 2 },
									content: [{ type: 'text', text: 'Nested heading' }],
								},
							],
						},
					],
				},
			],
		};

		renderRenderer({ document: documentWithNestedHeading });

		expect(screen.getAllByRole('button', { name: 'Collapse section' })).toHaveLength(1);
	});

	it('hides content inserted after a progressively rendered section is collapsed', async () => {
		render(<ProgressiveRendererHarness />);
		await userEvent.click(screen.getByRole('button', { name: 'Toggle progressive heading' }));

		const rendererDocument = screen
			.getByText('Initial progressive content')
			.closest<HTMLElement>('.ak-renderer-document');
		expect(rendererDocument).not.toBeNull();
		if (!rendererDocument) {
			return;
		}
		const progressivelyInsertedContent = rendererDocument.ownerDocument.createElement('p');
		progressivelyInsertedContent.textContent = 'Later progressive content';

		act(() => {
			rendererDocument.appendChild(progressivelyInsertedContent);
		});

		await waitFor(() =>
			expect(progressivelyInsertedContent).toHaveAttribute('hidden', 'until-found'),
		);
		expect(progressivelyInsertedContent).toHaveAttribute(
			'data-renderer-collapsed-content-owners',
			String(progressiveHeadingPos),
		);
	});

	it('collapses headings in every renderer document within the provider', async () => {
		render(<MultipleRendererDocumentsHarness />);

		await userEvent.click(screen.getByRole('button', { name: 'Toggle second heading' }));

		await waitFor(() =>
			expect(screen.getByText('Second renderer content').closest('p')).toHaveAttribute(
				'hidden',
				'until-found',
			),
		);
		expect(screen.getByText('First renderer content').closest('p')).not.toHaveAttribute('hidden');
	});
});
