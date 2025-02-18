import React from 'react';

import { screen, render, fireEvent } from '@testing-library/react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import * as clickAreaHelper from '../../../../ui/Addon/click-area-helper';

describe('should not call the click handler on content components', () => {
	const Editor = () => {
		const { preset } = usePreset((b) => b.add(basePlugin));
		return (
			<ComposableEditor
				appearance="full-page"
				preset={preset}
				contentComponents={{
					before: [],
					after: <div data-testid="contentComponent">Test content component!</div>,
				}}
			/>
		);
	};
	ffTest(
		'platform_editor_content_component_ignore_click',
		async () => {
			const outsideEditorclickHandler = jest.spyOn(
				clickAreaHelper,
				'outsideProsemirrorEditorClickHandler',
			);

			render(<Editor />);

			const contentComponent = await screen.findByTestId('contentComponent');
			fireEvent.mouseDown(contentComponent);

			expect(outsideEditorclickHandler).not.toHaveBeenCalled();
			outsideEditorclickHandler.mockClear();
		},
		async () => {
			const outsideEditorclickHandler = jest.spyOn(
				clickAreaHelper,
				'outsideProsemirrorEditorClickHandler',
			);

			render(<Editor />);

			const contentComponent = await screen.findByTestId('contentComponent');
			fireEvent.mouseDown(contentComponent);

			expect(outsideEditorclickHandler).toHaveBeenCalled();
			outsideEditorclickHandler.mockClear();
		},
	);
});

describe('should not call the click handler on content components as an array', () => {
	const Editor = () => {
		const { preset } = usePreset((b) => b.add(basePlugin));
		return (
			<ComposableEditor
				appearance="full-page"
				preset={preset}
				contentComponents={{
					before: [],
					after: [
						<div key="1" data-testid="contentComponent">
							Test content component!
						</div>,
						// Confluence may pass in undefined props!
						undefined as any,
					],
				}}
			/>
		);
	};
	ffTest(
		'platform_editor_content_component_ignore_click',
		async () => {
			const outsideEditorclickHandler = jest.spyOn(
				clickAreaHelper,
				'outsideProsemirrorEditorClickHandler',
			);

			render(<Editor />);

			const contentComponent = await screen.findByTestId('contentComponent');
			fireEvent.mouseDown(contentComponent);

			expect(outsideEditorclickHandler).not.toHaveBeenCalled();
			outsideEditorclickHandler.mockClear();
		},
		async () => {
			const outsideEditorclickHandler = jest.spyOn(
				clickAreaHelper,
				'outsideProsemirrorEditorClickHandler',
			);

			render(<Editor />);

			const contentComponent = await screen.findByTestId('contentComponent');
			fireEvent.mouseDown(contentComponent);

			expect(outsideEditorclickHandler).toHaveBeenCalled();
			outsideEditorclickHandler.mockClear();
		},
	);
});
