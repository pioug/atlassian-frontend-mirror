import React from 'react';

// eslint-disable-next-line
import { screen, waitFor } from '@testing-library/react';

import type { EditorPlugin } from '@atlaskit/editor-common/types';
import { ContextPanelConsumer, ContextPanelWidthProvider } from '@atlaskit/editor-common/ui';
import { contextPanelPlugin } from '@atlaskit/editor-plugins/context-panel';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

import { ContextPanel, SwappableContentArea } from '../../../ui/ContextPanel';
import {
	ContextPanelContentCompiled,
	ContextPanelWrapperCompiled,
} from '../../../ui/ContextPanel/index-compiled';
import {
	ContextPanelContentEmotion,
	ContextPanelWrapperEmotion,
} from '../../../ui/ContextPanel/index-emotion';

// Temporary test to validate emotion -> compiled migration. This can be removed on platform_editor_core_non_ecc_static_css clean up

describe('ContextPanel migration parity', () => {
	const DEFAULT_CONTEXT_PANEL_WIDTHS = ['320px', '20pc'];
	const parityCases = [
		{ customWidth: undefined, visible: true, disableAnimation: false },
		{ customWidth: 280, visible: true, disableAnimation: false },
		{ customWidth: 280, visible: true, disableAnimation: true },
		{ customWidth: undefined, visible: false, disableAnimation: false },
		{ customWidth: undefined, visible: false, disableAnimation: true },
	];

	type ParityCase = {
		customWidth?: number;
		disableAnimation: boolean;
		visible: boolean;
	};

	type WrapperStyles = {
		overflowX: string;
		overflowY: string;
		transitionDuration: string;
		transitionProperty: string;
		width: string;
	};

	type ContentStyles = WrapperStyles & {
		boxSizing: string;
	};

	const getWrapperStyles = (element: HTMLElement): WrapperStyles => {
		const styles = window.getComputedStyle(element);
		return {
			width: styles.width,
			overflowX: styles.overflowX,
			overflowY: styles.overflowY,
			transitionProperty: styles.transitionProperty,
			transitionDuration: styles.transitionDuration,
		};
	};

	const getContentStyles = (element: HTMLElement): ContentStyles => {
		const styles = window.getComputedStyle(element);
		return {
			width: styles.width,
			overflowX: styles.overflowX,
			overflowY: styles.overflowY,
			transitionProperty: styles.transitionProperty,
			transitionDuration: styles.transitionDuration,
			boxSizing: styles.boxSizing,
		};
	};

	const expectVisibilityWidth = (width: string, visible: boolean) => {
		if (visible) {
			expect(width).not.toBe('0px');
		} else {
			expect(width).toBe('0px');
		}
	};

	const expectOptionalHiddenOverflowX = (overflowX: string) => {
		if (overflowX) {
			expect(overflowX).toBe('hidden');
		}
	};

	const expectDefaultWidth = (width: string) => {
		expect(DEFAULT_CONTEXT_PANEL_WIDTHS).toContain(width);
	};

	// Compiled and Emotion can serialize the same default width using different but
	// equivalent CSS units in tests (for example 320px vs 20pc). Normalize before
	// comparing so parity checks assert on resolved size rather than raw unit choice.
	const normalizeWidth = (width: string) => {
		if (width.endsWith('pc')) {
			return `${parseFloat(width) * 16}px`;
		}

		return width;
	};

	const expectMatchingNormalizedWidth = (compiledWidth: string, emotionWidth: string) => {
		expect(normalizeWidth(compiledWidth)).toBe(normalizeWidth(emotionWidth));
	};

	const expectSharedAnimationStyles = (
		compiled: WrapperStyles | ContentStyles,
		emotion: WrapperStyles | ContentStyles,
	) => {
		expect(compiled.transitionProperty).toBe(emotion.transitionProperty);
		expect(compiled.transitionDuration).toBe(emotion.transitionDuration);
	};

	const expectWrapperBehavior = (element: HTMLElement, { customWidth, visible }: ParityCase) => {
		const styles = getWrapperStyles(element);

		expectVisibilityWidth(styles.width, visible);
		if (customWidth) {
			expect(styles.width).toBe(`${customWidth}px`);
			expect(styles.overflowX).toBe('hidden');
		}
	};

	const expectContentBehavior = (element: HTMLElement, { customWidth, visible }: ParityCase) => {
		const styles = getContentStyles(element);

		expectVisibilityWidth(styles.width, visible);
		if (customWidth) {
			expect(styles.width).toBe(`${customWidth}px`);
		}
		expectOptionalHiddenOverflowX(styles.overflowX);
	};

	const expectWrapperParity = (
		compiled: HTMLElement,
		emotion: HTMLElement,
		{ customWidth, visible }: ParityCase,
	) => {
		expectWrapperBehavior(compiled, { customWidth, visible, disableAnimation: false });
		expectWrapperBehavior(emotion, { customWidth, visible, disableAnimation: false });

		const compiledStyles = getWrapperStyles(compiled);
		const emotionStyles = getWrapperStyles(emotion);

		if (!visible) {
			expectMatchingNormalizedWidth(compiledStyles.width, emotionStyles.width);
			return;
		}

		if (customWidth) {
			expectMatchingNormalizedWidth(compiledStyles.width, emotionStyles.width);
		} else {
			expectDefaultWidth(compiledStyles.width);
			expectDefaultWidth(emotionStyles.width);
			expectMatchingNormalizedWidth(compiledStyles.width, emotionStyles.width);
		}
	};

	const expectContentParity = (
		compiled: HTMLElement,
		emotion: HTMLElement,
		{ customWidth, visible }: ParityCase,
	) => {
		expectContentBehavior(compiled, { customWidth, visible, disableAnimation: false });
		expectContentBehavior(emotion, { customWidth, visible, disableAnimation: false });

		const compiledStyles = getContentStyles(compiled);
		const emotionStyles = getContentStyles(emotion);

		if (!visible) {
			expectMatchingNormalizedWidth(compiledStyles.width, emotionStyles.width);
			return;
		}

		if (customWidth) {
			expectMatchingNormalizedWidth(compiledStyles.width, emotionStyles.width);
		} else {
			expectDefaultWidth(compiledStyles.width);
			expectDefaultWidth(emotionStyles.width);
			expectMatchingNormalizedWidth(compiledStyles.width, emotionStyles.width);
		}

		expect(compiledStyles.boxSizing).toBe(emotionStyles.boxSizing);
		expect(compiledStyles.overflowY).toBe(emotionStyles.overflowY);
		if (compiledStyles.overflowX || emotionStyles.overflowX) {
			expect(compiledStyles.overflowX || 'hidden').toBe(emotionStyles.overflowX || 'hidden');
		}
	};

	const renderParityCase = ({ customWidth, visible, disableAnimation }: ParityCase) => {
		renderWithIntl(
			<>
				<ContextPanelWrapperCompiled
					data-testid="wrapper-compiled"
					customWidth={customWidth}
					visible={visible}
					disableAnimation={disableAnimation}
				/>
				<ContextPanelWrapperEmotion
					data-testid="wrapper-emotion"
					customWidth={customWidth}
					visible={visible}
					disableAnimation={disableAnimation}
				/>
				<ContextPanelContentCompiled
					data-testid="content-compiled"
					customWidth={customWidth}
					visible={visible}
					disableAnimation={disableAnimation}
					hasPadding={false}
				/>
				<ContextPanelContentEmotion
					data-testid="content-emotion"
					customWidth={customWidth}
					visible={visible}
					disableAnimation={disableAnimation}
					hasPadding={false}
				/>
			</>,
		);

		return {
			wrapperCompiled: screen.getByTestId('wrapper-compiled'),
			wrapperEmotion: screen.getByTestId('wrapper-emotion'),
			contentCompiled: screen.getByTestId('content-compiled'),
			contentEmotion: screen.getByTestId('content-emotion'),
		};
	};

	it.each(parityCases)(
		'matches wrapper and content CSS parity for customWidth=$customWidth visible=$visible disableAnimation=$disableAnimation',
		(testCase) => {
			const { wrapperCompiled, wrapperEmotion, contentCompiled, contentEmotion } =
				renderParityCase(testCase);

			expectWrapperParity(wrapperCompiled, wrapperEmotion, testCase);
			expectContentParity(contentCompiled, contentEmotion, testCase);
			expectSharedAnimationStyles(
				getWrapperStyles(wrapperCompiled),
				getWrapperStyles(wrapperEmotion),
			);
			expectSharedAnimationStyles(
				getContentStyles(contentCompiled),
				getContentStyles(contentEmotion),
			);
		},
	);
});

describe('SwappableContentArea', () => {
	it('renders children', () => {
		renderWithIntl(
			<SwappableContentArea editorAPI={undefined} visible>
				<div data-testid="child-component">Child Component</div>
			</SwappableContentArea>,
		);
		expect(screen.getByTestId('child-component')).toBeInTheDocument();
		expect(screen.getByLabelText('Context panel')).toBeInTheDocument();
	});

	// ContextPanel animates by doing a CSS transition on the container's width,
	// and inside the container, sliding the content off screen.
	//
	// The container clips content to avoid scroll and overlaying with any elements
	// that might be on the right.

	describe('container', () => {
		it('displays content when visible is true', () => {
			renderWithIntl(<SwappableContentArea editorAPI={undefined} visible />);
			const panel = screen.getByTestId('context-panel-panel');
			expect(panel).toHaveStyle('width: 320px');
		});
		it('hides content when visible is false', () => {
			renderWithIntl(<SwappableContentArea editorAPI={undefined} visible={false} />);
			const panel = screen.getByTestId('context-panel-panel');
			expect(panel).toHaveStyle('width: 0px');
		});
		it('clips content using the container', () => {
			renderWithIntl(<SwappableContentArea editorAPI={undefined} visible />);
			const panel = screen.getByTestId('context-panel-panel');
			expect(panel).toHaveStyle('overflow: hidden');
		});
	});

	describe('content', () => {
		it('is scrollable up/down', () => {
			renderWithIntl(<SwappableContentArea editorAPI={undefined} visible />);
			const content = screen.getByTestId('context-panel-content');
			expect(content).toHaveStyle('overflow-y: auto');
		});
	});
});

describe('ContextPanelWidthProvider', () => {
	it('should broadcast width', async () => {
		let broadCast: (width: number) => void = () => {};
		const { container } = renderWithIntl(
			<ContextPanelWidthProvider>
				<ContextPanelConsumer>
					{({ width, broadcastWidth }) => {
						broadCast = broadcastWidth;
						return <div>{width}</div>;
					}}
				</ContextPanelConsumer>
			</ContextPanelWidthProvider>,
		);
		broadCast(320);

		await waitFor(() => expect(container).toHaveTextContent('320'));
	});

	it('should broadcast width with SwappableContentArea', async () => {
		const { container } = renderWithIntl(
			<ContextPanelWidthProvider>
				<SwappableContentArea editorAPI={undefined} visible>
					<ContextPanelConsumer>
						{({ width }) => {
							return <div>{width}</div>;
						}}
					</ContextPanelConsumer>
				</SwappableContentArea>
			</ContextPanelWidthProvider>,
		);

		await waitFor(() => expect(container).toHaveTextContent('320'));
	});
});

const editorFactory = createEditorFactory();

const mockContextPanelPlugin: EditorPlugin = {
	name: 'mockContextPanelPlugin',
	pluginsOptions: {
		contextPanel: (state) => <p>mario saxaphone</p>,
	},
};

describe('ContextPanel', () => {
	it('renders SwappableContentArea', () => {
		renderWithIntl(
			<ContextPanel editorAPI={undefined} visible={true}>
				<div>yoshi bongo</div>
			</ContextPanel>,
		);
		const contentArea = screen.getByTestId('context-panel-panel');
		expect(contentArea).toBeInTheDocument();
	});

	it('passes top-level props and children to SwappableContentArea', () => {
		renderWithIntl(
			<ContextPanel editorAPI={undefined} visible={true}>
				<div>yoshi bongo</div>
			</ContextPanel>,
		);
		expect(screen.getByText('yoshi bongo')).toBeInTheDocument();
	});

	it('uses pluginContent instead if plugins define content', () => {
		const { editorAPI } = editorFactory({
			editorPlugins: [mockContextPanelPlugin, contextPanelPlugin({ config: undefined })],
			doc: doc(p('hello')),
		});
		renderWithIntl(
			<ContextPanel editorAPI={editorAPI} visible={true}>
				<div>yoshi bongo</div>
			</ContextPanel>,
		);
		expect(screen.queryByText('yoshi bongo')).not.toBeInTheDocument();
		expect(screen.getByText('mario saxaphone')).toBeInTheDocument();
	});

	describe('renders the context panel with correct role and aria attributes', () => {
		it('has dialog semantics with aria-modal=false and no aria-labelledby', () => {
			renderWithIntl(
				<ContextPanel editorAPI={undefined} visible={true}>
					<div id="context-panel-title">Blog posts</div>
				</ContextPanel>,
			);
			const panel = screen.getByTestId('context-panel-panel');
			expect(panel).toBeInTheDocument();
			expect(panel).toHaveAttribute('role', 'dialog');
			expect(panel).toHaveAttribute('aria-modal', 'false');
			expect(panel).toHaveAttribute('aria-label', 'Context panel');
			expect(panel).not.toHaveAttribute('aria-labelledby');
		});
	});

	it('should focus editor on ESC from the sidebar config panel', async () => {
		const { editorAPI } = editorFactory({
			doc: doc(p('hello')),
		});

		// @ts-expect-error
		const editorFocusSpy = jest.spyOn(editorAPI?.core.actions, 'focus');
		const { rerender } = renderWithIntl(
			<ContextPanel editorAPI={editorAPI} visible={true}>
				<div>yoshi bongo</div>
			</ContextPanel>,
		);
		// Update the component to simulate closing the sidebar
		rerender(
			<ContextPanel editorAPI={editorAPI} visible={false}>
				<div>yoshi bongo</div>
			</ContextPanel>,
		);
		expect(editorFocusSpy).toHaveBeenCalled();
	});
});
