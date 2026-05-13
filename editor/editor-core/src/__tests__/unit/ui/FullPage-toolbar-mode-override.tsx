/**
 * Verifies the `FullPage.tsx` mount-gate fix for the toolbar runtime override.
 *
 * When `toolbarDockingPosition === 'none'` (user prefers the floating toolbar)
 * AND the toolbar plugin's `contextualFormattingModeOverride` runtime field is
 * `'always-pinned'` (e.g. Markdown Mode source/preview view), the primary
 * toolbar must still mount — otherwise the override has no UI to drive.
 *
 * `platform_editor_controls = variant1` is set via `eeTest`; individual fg
 * gates are toggled per-test via `passGate` / `failGate`.
 */

import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { skipAutoA11y } from '@atlassian/a11y-jest-testing';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

// Drives the runtime override returned to `FullPage.tsx`'s selector.
const mockToolbarOverride: { value: 'always-pinned' | undefined } = { value: undefined };

// Selector mock dispatched by the subscribed plugin set so we don't break
// other consumers (e.g. ContextPanel, Toolbar) that share the same hook.
jest.mock('@atlaskit/editor-common/hooks', () => {
	const actual = jest.requireActual('@atlaskit/editor-common/hooks');
	return {
		...actual,
		useSharedPluginStateWithSelector: jest
			.fn()
			.mockImplementation((_api: unknown, plugins: string[]) => {
				if (plugins.includes('primaryToolbar')) {
					// FullPage selector — shape includes the new override field.
					return {
						primaryToolbarComponents: undefined,
						interactionState: 'hasNotHadInteraction',
						editorViewMode: 'edit',
						contextualFormattingModeOverride: mockToolbarOverride.value,
					};
				}
				if (plugins.includes('connectivity')) {
					// Toolbar.tsx selector inside the rendered toolbar surface.
					return {
						connectivityStateMode: 'online',
						editorViewMode: 'edit',
						editorToolbarDockingPreference: 'none',
					};
				}
				if (plugins.includes('toolbar')) {
					// FullPageToolbarNext / Section pull the override field directly.
					return mockToolbarOverride.value;
				}
				return undefined;
			}),
	};
});

jest.mock('@atlaskit/editor-common/use-shared-plugin-state-selector', () => ({
	useSharedPluginStateSelector: jest
		.fn()
		.mockImplementation((_api: unknown, selector: string) => {
			if (selector === 'userPreferences.preferences') {
				return { toolbarDockingPosition: 'none' };
			}
			return undefined;
		}),
}));

import { FullPageEditor as FullPage } from '../../../ui/Appearance/FullPage/FullPage';
import EditorContext from '../../../ui/EditorContext';

const mockEditorView = {
	state: {},
	dispatch: jest.fn(),
} as unknown as EditorView;

// Minimal `editorAPI` that satisfies `Boolean(editorAPI?.toolbar)` so
// `isToolbarAIFCEnabled` resolves true and `<FullPageToolbarNext>` is the
// branch under test.
const editorAPI = {
	toolbar: {
		actions: {
			getComponents: () => [{ type: 'toolbar', key: 'primary-toolbar' }],
			contextualFormattingMode: () => 'controlled',
		},
		sharedState: {
			currentState: () => ({ contextualFormattingModeOverride: mockToolbarOverride.value }),
			onChange: () => () => {},
		},
	},
} as any;

const renderFullPage = () =>
	render(
		<IntlProvider locale="en">
			<EditorContext>
				<FullPage
					editorAPI={editorAPI}
					editorView={mockEditorView}
					providerFactory={{} as any}
					editorDOMElement={<div />}
					featureFlags={{}}
					disabled={false}
				/>
			</EditorContext>
		</IntlProvider>,
	);

eeTest
	.describe('platform_editor_controls', 'FullPage → primary toolbar mount gate (runtime override)')
	.variant('variant1', () => {
		beforeEach(() => {
			mockToolbarOverride.value = undefined;
		});

		it("hides the primary toolbar when docking pref is 'none' and no runtime override", async () => {
			// Override is undefined, so `forcePrimaryToolbarPinned` short-circuits
			// before reading the toolbar-mode-override gate — only the preferences
			// gate is actually evaluated.
			passGate('platform_editor_use_preferences_plugin');
			renderFullPage();
			expect(screen.queryByTestId('ak-editor-main-toolbar')).not.toBeInTheDocument();
			await expect(document.body).toBeAccessible();
		});

		// The mounted toolbar surface here is built from mocked sub-components
		// whose `aria-controls="ak-editor-textarea"` points at an element that
		// only exists in real editor renders. The auto-a11y check is opted out
		// for this test; the sibling test above covers the a11y baseline.
		it(
			"mounts the primary toolbar when docking pref is 'none' but override forces 'always-pinned'",
			skipAutoA11y(() => {
				passGate('platform_editor_use_preferences_plugin');
				passGate('platform_editor_toolbar_mode_override');
				mockToolbarOverride.value = 'always-pinned';
				renderFullPage();
				expect(screen.getByTestId('ak-editor-main-toolbar')).toBeInTheDocument();
			}),
		);

		it("keeps the primary toolbar hidden when override is 'always-pinned' but the gate is off", async () => {
			passGate('platform_editor_use_preferences_plugin');
			failGate('platform_editor_toolbar_mode_override');
			mockToolbarOverride.value = 'always-pinned';
			renderFullPage();
			expect(screen.queryByTestId('ak-editor-main-toolbar')).not.toBeInTheDocument();
			await expect(document.body).toBeAccessible();
		});
	});
