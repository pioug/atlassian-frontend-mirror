import React from 'react';

import { render } from '@testing-library/react';

import { EditorPresetBuilder } from '@atlaskit/editor-common/preset/builder';
import type { EditorAppearance } from '@atlaskit/editor-common/types/editor-appearance';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { UiComponentFactoryParams } from '@atlaskit/editor-common/types/ui-components';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { featureFlagsPlugin } from '@atlaskit/editor-plugins/feature-flags';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import { ComposableEditor } from '../../composable-editor';

const renderEditor = (appearance: EditorAppearance, popupsScrollableElement?: HTMLElement) => {
	const contentComponent = jest.fn((_props: UiComponentFactoryParams) => null);
	const primaryToolbarComponent = jest.fn((_props: UiComponentFactoryParams) => null);
	const testPlugin: NextEditorPlugin<'test'> = () => ({
		name: 'test',
		contentComponent,
		primaryToolbarComponent,
	});
	const preset = new EditorPresetBuilder()
		.add([featureFlagsPlugin, {}])
		.add(basePlugin)
		.add(testPlugin);

	const { container } = render(
		<ComposableEditor
			appearance={appearance}
			preset={preset}
			popupsScrollableElement={popupsScrollableElement}
		/>,
	);

	return { container, contentComponent, primaryToolbarComponent };
};

describe.each([false, true])('popup scroll container with experiment enabled: %s', (enabled) => {
	beforeEach(() => {
		if (enabled) {
			mockExpEnabled('platform_editor_improve_inp_batch_3');
		} else {
			mockExpDisabled('platform_editor_improve_inp_batch_3');
		}
	});

	it.each(['full-page', 'full-width', 'max'] as const)(
		'uses the existing editor startup render to supply the container for %s',
		(appearance) => {
			const { container, contentComponent, primaryToolbarComponent } = renderEditor(appearance);
			const scrollContainer = container.querySelector('.fabric-editor-popup-scroll-parent');
			const callsWithEditorView = contentComponent.mock.calls.filter(([props]) => props.editorView);

			expect(scrollContainer).not.toBeNull();
			// Mount the real editor: no manual rerender or callback-ref state update is needed.
			// Factories can also be called before the editor view exists.
			expect(callsWithEditorView).toHaveLength(1);
			expect(callsWithEditorView[0][0].containerElement).toBe(scrollContainer);
			expect(callsWithEditorView[0][0].popupsScrollableElement).toBe(
				enabled ? scrollContainer : undefined,
			);
			expect(primaryToolbarComponent).toHaveBeenCalledWith(
				expect.objectContaining({ popupsScrollableElement: undefined }),
			);
		},
	);

	it('preserves an explicit consumer scroll container for content and toolbar popups', () => {
		const popupsScrollableElement = document.createElement('div');
		const { contentComponent, primaryToolbarComponent } = renderEditor(
			'full-page',
			popupsScrollableElement,
		);

		expect(contentComponent).toHaveBeenCalledWith(
			expect.objectContaining({ popupsScrollableElement }),
		);
		expect(primaryToolbarComponent).toHaveBeenCalledWith(
			expect.objectContaining({ popupsScrollableElement }),
		);
	});

	it.each(['comment', 'chromeless'] as const)(
		'does not default the scroll container for %s',
		(appearance) => {
			const { contentComponent } = renderEditor(appearance);

			expect(contentComponent).toHaveBeenCalledWith(
				expect.objectContaining({ popupsScrollableElement: undefined }),
			);
		},
	);
});
