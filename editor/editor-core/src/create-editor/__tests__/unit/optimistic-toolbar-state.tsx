import React from 'react';

import { renderToString } from 'react-dom/server';
import { createIntl, IntlProvider } from 'react-intl';

import * as isSSRModule from '@atlaskit/editor-common/is-ssr';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset/builder';
import ProviderFactory from '@atlaskit/editor-common/provider-factory/provider-factory';
import type {
	NextEditorPlugin,
	PublicPluginAPI,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import { basePlugin } from '@atlaskit/editor-plugin-base/basePlugin';
import { editorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePlugin';
import { toolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin';
import { userPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences/user-preferences-plugin';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import * as editorSSRRendererModule from '@atlaskit/editor-ssr-renderer/editor-ssr-renderer';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { act } from '@atlassian/testing-library/act';
import { screen } from '@atlassian/testing-library/screen';

import type { EditorProps } from '../../../types/editor-props';
import ReactEditorView, { type EditorViewProps } from '../../ReactEditorView';

const initialStateProbe: NextEditorPlugin<
	'initialStateProbe',
	{ sharedState: EditorState | undefined }
> = () => ({
	name: 'initialStateProbe',
	getSharedState: (state) => state,
});

type Options = {
	appearance?: EditorProps['appearance'];
	customControls?: EditorProps['primaryToolbarComponents'];
	docking?: 'top' | 'none';
	editorControls?: boolean;
	mode?: 'controlled' | 'always-pinned';
	modeOverride?: 'always-pinned';
	viewMode?: 'edit' | 'view';
};

const createProps = ({
	appearance = 'full-page',
	docking = 'top',
	mode = 'controlled',
	viewMode = 'edit',
	customControls,
	modeOverride,
}: Options = {}) => {
	const preset = new EditorPresetBuilder()
		.add(basePlugin)
		.add([userPreferencesPlugin, { initialUserPreferences: { toolbarDockingPosition: docking } }])
		.add([
			toolbarPlugin,
			{
				contextualFormattingEnabled: mode,
				contextualFormattingModeOverride: modeOverride ? () => modeOverride : undefined,
			},
		])
		.add([editorViewModePlugin, { mode: viewMode }])
		.add(initialStateProbe);
	const observations: Array<{ hasState: boolean; hasView: boolean }> = [];
	let readState: (() => EditorState | undefined) | undefined;
	const render: NonNullable<EditorViewProps['render']> = ({ editor, editorAPI, view }) => {
		const api = editorAPI as PublicPluginAPI<[typeof initialStateProbe]> | undefined;
		readState = api?.initialStateProbe?.sharedState.currentState;
		observations.push({ hasState: Boolean(readState?.()), hasView: Boolean(view) });
		return editor;
	};
	const props: EditorViewProps = {
		preset,
		render,
		intl: createIntl({ locale: 'en' }),
		providerFactory: ProviderFactory.create({}),
		portalProviderAPI: {
			render: jest.fn(),
			remove: jest.fn(),
			destroy: jest.fn(),
		},
		nodeViewPortalProviderAPI: {
			render: jest.fn(),
			remove: jest.fn(),
			destroy: jest.fn(),
		},
		onEditorCreated: jest.fn(),
		onEditorDestroyed: jest.fn(),
		editorProps: {
			appearance,
			primaryToolbarComponents: customControls,
			defaultValue: {
				type: 'doc',
				version: 1,
				content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Document content' }] }],
			},
		},
	};
	return { props, observations, currentState: () => readState?.() };
};

describe('optimistic toolbar state before EditorView mounts', () => {
	beforeEach(() => {
		setupEditorExperiments('test', { platform_editor_controls: 'variant1' });
	});

	afterEach(() => {
		jest.restoreAllMocks();
		setupEditorExperiments('test', {});
	});

	describe.each([false, true])('SSR = %s', (ssr) => {
		beforeEach(() => {
			jest.spyOn(isSSRModule, 'isSSR').mockReturnValue(ssr);
			jest.spyOn(editorSSRRendererModule, 'EditorSSRRenderer');
		});

		const renderEditor = (options: Options, enabled = true, platformEnabled = enabled) => {
			setupEditorExperiments('test', {
				platform_editor_controls: options.editorControls === false ? 'control' : 'variant1',
				platform_editor_ssr_toolbar_optimistic: enabled,
			});
			if (platformEnabled) {
				mockExpEnabled('platform_editor_ssr_toolbar_optimistic');
			} else {
				mockExpDisabled('platform_editor_ssr_toolbar_optimistic');
			}
			const result = createProps(options);
			const editor = <ReactEditorView {...result.props} />;
			if (ssr) {
				const html = renderToString(<IntlProvider locale="en">{editor}</IntlProvider>);
				expect(html).toContain('Document content');
			} else {
				renderWithIntl(editor);
				expect(screen.getByRole('textbox')).toHaveTextContent('Document content');
				// Deferring shared state must not prevent the real view from publishing it.
				expect(result.currentState()?.doc.textContent).toBe('Document content');
				const { view } = jest.mocked(result.props.onEditorCreated).mock.calls[0][0];
				act(() => view.dispatch(view.state.tr.insertText('Updated ', 1)));
				expect(result.currentState()?.doc.textContent).toBe('Updated Document content');
				expect(result.currentState()).toBe(view.state);
			}
			return result;
		};

		it.each([
			['docked toolbar', { docking: 'top' }, true],
			['undocked toolbar', { docking: 'none' }, false],
			['docked max-width toolbar', { appearance: 'max', docking: 'top' }, true],
			['undocked max-width toolbar', { appearance: 'max', docking: 'none' }, false],
			['view mode', { docking: 'top', viewMode: 'view' }, false],
			['forced-pinned toolbar', { docking: 'none', mode: 'always-pinned' }, true],
			['config override forcing pinning', { docking: 'none', modeOverride: 'always-pinned' }, true],
			['legacy editor controls', { docking: 'none', editorControls: false }, true],
			['custom controls', { docking: 'none', customControls: <span>Custom control</span> }, true],
		] as Array<[string, Options, boolean]>)(
			'only exposes initial state when needed: %s',
			(_name, options, expected) => {
				const { observations } = renderEditor(options);
				expect(observations[0]).toEqual({ hasState: expected, hasView: false });
				if (ssr) {
					const renderer = jest.mocked(editorSSRRendererModule.EditorSSRRenderer);
					expect(Boolean(renderer.mock.calls[0][0].prebuiltEditorState)).toBe(expected);
					expect(Boolean(renderer.mock.calls[0][0].prebuiltPMPlugins)).toBe(expected);
				}
			},
		);

		it.each(['top', 'none'] as const)(
			'preserves control initialization for %s when disabled',
			(docking) => {
				const { observations } = renderEditor({ docking }, false);
				expect(observations[0]).toEqual({ hasState: false, hasView: false });
			},
		);

		it.each([false, true])(
			'uses the editor experiment value %s when platform overrides disagree',
			(enabled) => {
				// The production smoke harness configures these two override stores separately.
				const { observations } = renderEditor({ docking: 'top' }, enabled, !enabled);
				expect(observations[0]).toEqual({ hasState: enabled, hasView: false });
			},
		);
	});
});
