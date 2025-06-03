/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import { mediaPlugin } from '@atlaskit/editor-plugin-media';
import { layoutPlugin } from '@atlaskit/editor-plugins/layout';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { token } from '@atlaskit/tokens';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';

import { JSONTransformer } from '../src';

const container = css({
	display: 'grid',
	gridTemplateColumns: '50% 50%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'#output': {
		border: '2px solid',
		margin: token('space.100', '8px'),
		padding: token('space.100', '8px'),
		whiteSpace: 'pre-wrap',
		fontSize: 'xx-small',
		'&:focus': {
			outline: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:empty:not(:focus)::before': {
			content: 'attr(data-placeholder)',
			fontSize: '14px',
		},
	},
});

const createPreset = () =>
	createDefaultPreset({
		featureFlags: { macroInteractionUpdates: true },
		paste: {},
		appearance: 'comment',
	})
		.add(gridPlugin)
		.add(layoutPlugin)
		.add([
			mediaPlugin,
			{
				featureFlags: {
					mediaInline: true,
				},
				provider: storyMediaProviderFactory(),
				allowMediaSingle: true,
				allowResizing: true,
				allowLinking: true,
				allowResizingInTables: true,
				allowAltTextOnImages: true,
				allowCaptions: true,
				altTextValidator: (value: string) => {
					const errors = [];
					// Ignored via go/ees005
					// eslint-disable-next-line require-unicode-regexp
					if (!/^[A-Z]/g.test(value)) {
						errors.push('Please start with capital letter.');
					}
					// Ignored via go/ees005
					// eslint-disable-next-line require-unicode-regexp
					if (!/^[^"<>&\\]*$/g.test(value)) {
						errors.push('Please remove special characters.');
					}
					// Ignored via go/ees005
					// eslint-disable-next-line require-unicode-regexp
					if (!/(\w.+\s).+/g.test(value)) {
						errors.push('Please use at least two words.');
					}
					return errors;
				},
			},
		]);

const schema = getSchemaBasedOnStage('stage0');

const Layouts = () => {
	const [{ output }, setOutput] = React.useState<{ output: string }>({ output: '' });
	const { current: transformer } = React.useRef(new JSONTransformer(schema));
	const { preset } = usePreset(createPreset);

	const handleChangeInTheEditor = React.useCallback(
		(editorView: EditorView) => {
			const output = JSON.stringify(transformer.encode(editorView.state.doc), null, 2);
			setOutput({ output });
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	return (
		<div css={container}>
			<ComposableEditor
				appearance="comment"
				preset={preset}
				onChange={handleChangeInTheEditor}
				taskDecisionProvider={Promise.resolve(getMockTaskDecisionResource())}
			/>
			<div
				id="output"
				data-placeholder="This is an empty document (or something has gone really wrong)"
			>
				{output}
			</div>
		</div>
	);
};

export default Layouts;
