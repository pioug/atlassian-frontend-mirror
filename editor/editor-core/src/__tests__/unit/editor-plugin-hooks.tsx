import React, { useEffect } from 'react';

import { render } from '@testing-library/react';

import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import type { EditorAppearance, NextEditorPlugin } from '@atlaskit/editor-common/types';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { featureFlagsPlugin } from '@atlaskit/editor-plugins/feature-flags';

import { ComposableEditor } from '../../composable-editor';

const allAppearances: EditorAppearance[] = ['comment', 'chromeless', 'full-page', 'full-width'];

describe('ComposableEditor', () => {
	describe('renders plugin hooks on all appearances', () => {
		it.each(allAppearances)('should render plugin hooks for %s', (appearance) => {
			const testFunc = jest.fn();
			const preset = new EditorPresetBuilder()
				.add([featureFlagsPlugin, {}])
				.add(basePlugin)
				.add([testPlugin, testFunc]);

			render(<ComposableEditor appearance={appearance} preset={preset} />);

			expect(testFunc).toHaveBeenCalledTimes(1);
		});
	});
});

const testPlugin: NextEditorPlugin<'test', { pluginConfiguration: any }> = ({
	config: testFunc,
}) => ({
	name: 'test',

	usePluginHook() {
		useEffect(() => {
			testFunc();
		}, []);
	},
});
