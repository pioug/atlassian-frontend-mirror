import React from 'react';

import { render } from '@testing-library/react';

import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { featureFlagsPlugin } from '@atlaskit/editor-plugins/feature-flags';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import createUniversalPreset from '../../../presets/universal';
import { RenderTracking } from '../../../utils/performance/components/RenderTracking';
import { ComposableEditor } from '../../composable-editor';

jest.mock('../../../utils/performance/components/RenderTracking', () => {
	return { RenderTracking: jest.fn(() => null) };
});

describe('ComposableEditor', () => {
	afterEach(jest.clearAllMocks);
	describe('render with presets passed in', () => {
		it('should render correctly with the preset prop', () => {
			const preset = createUniversalPreset({
				appearance: 'full-page',
				props: { paste: {} },
				featureFlags: {},
			});
			const { container } = render(<ComposableEditor preset={preset} />);
			const editorElement = container.getElementsByClassName('akEditor');
			expect(editorElement.length).toBe(1);
		});

		it('should not throw if passing a Preset that contains the base plugin', () => {
			const preset = new EditorPresetBuilder().add([featureFlagsPlugin, {}]).add(basePlugin);

			expect(() => {
				render(<ComposableEditor preset={preset} />);
			}).not.toThrow();
		});
	});

	ffTest.on('platform_editor_disable_rerender_tracking_jira', 'rerenders', () => {
		it('should not render RenderTracking', () => {
			const preset = createUniversalPreset({
				appearance: 'full-page',
				props: { paste: {} },
				featureFlags: {},
			});

			render(<ComposableEditor preset={preset} />);

			expect(RenderTracking).toHaveBeenCalledTimes(2);
			expect(RenderTracking).not.toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'editor',
				}),
			);
		});
	});

	ffTest.off('platform_editor_disable_rerender_tracking_jira', 'rerenders', () => {
		it('should render RenderTracking', () => {
			const preset = createUniversalPreset({
				appearance: 'full-page',
				props: { paste: {} },
				featureFlags: {},
			});

			render(<ComposableEditor preset={preset} />);

			expect(RenderTracking).toHaveBeenCalled();
		});
	});
});

// Check typing of `ComposableEditor` is as expected
// eslint-disable-next-line
function EditorTyping() {
	// @ts-expect-error no preset prop
	const test1 = <ComposableEditor />;

	const test2 = (
		// @ts-expect-error no allow-* props
		<ComposableEditor preset={new EditorPresetBuilder()} allowDate={true} />
	);

	const test4 = (
		<ComposableEditor
			preset={new EditorPresetBuilder()}
			// @ts-expect-error no allow-* props
			allowTextAlignment={true}
		/>
	);

	const test5 = (
		<ComposableEditor
			preset={new EditorPresetBuilder()}
			// @ts-expect-error no allow-* props
			allowTables={true}
		/>
	);

	const test6 = (
		<ComposableEditor
			preset={new EditorPresetBuilder()}
			// @ts-expect-error no allow-* props
			allowTextColor={true}
		/>
	);

	const test7 = (
		<ComposableEditor
			preset={new EditorPresetBuilder()}
			// @ts-expect-error no insertMenuItems
			insertMenuItems={[]}
		/>
	);

	const test8 = (
		<ComposableEditor
			preset={new EditorPresetBuilder()}
			// @ts-expect-error no UNSAFE_cards
			UNSAFE_cards={null}
		/>
	);

	const test9 = (
		<ComposableEditor
			preset={new EditorPresetBuilder()}
			// @ts-expect-error no smartLinks
			smartLinks={null}
		/>
	);

	const test10 = (
		<ComposableEditor
			preset={new EditorPresetBuilder()}
			// @ts-expect-error no allow-* props
			allowAnalyticsGASV3={true}
		/>
	);

	const test11 = (
		<ComposableEditor
			preset={new EditorPresetBuilder()}
			// @ts-expect-error no codeBlock
			codeBlock={null}
		/>
	);

	const test12 = (
		<ComposableEditor
			preset={new EditorPresetBuilder()}
			// @ts-expect-error no textFormatting
			textFormatting={null}
		/>
	);

	// eslint-disable-next-line
	console.log(test1);

	// eslint-disable-next-line
	console.log(test2);

	// eslint-disable-next-line
	console.log(test4);

	// eslint-disable-next-line
	console.log(test5);

	// eslint-disable-next-line
	console.log(test6);

	// eslint-disable-next-line
	console.log(test7);

	// eslint-disable-next-line
	console.log(test8);

	// eslint-disable-next-line
	console.log(test9);

	// eslint-disable-next-line
	console.log(test10);

	// eslint-disable-next-line
	console.log(test11);

	// eslint-disable-next-line
	console.log(test12);
}

// eslint-disable-next-line
console.log(typeof EditorTyping);
