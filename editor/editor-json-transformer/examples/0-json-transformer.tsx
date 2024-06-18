/** @jsx jsx */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { Editor } from '@atlaskit/editor-core';
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

export const mediaProvider = storyMediaProviderFactory();

export default class Example extends React.PureComponent<{}, { output: string }> {
	state = { output: '' };
	transformer = new JSONTransformer();

	handleChangeInTheEditor = (editorView: EditorView) => {
		const output = JSON.stringify(this.transformer.encode(editorView.state.doc), null, 2);
		this.setState({ output });
	};

	render() {
		return (
			<div css={container}>
				<Editor
					appearance="comment"
					allowRule={true}
					allowTables={true}
					allowBorderMark={true}
					media={{
						provider: mediaProvider,
						allowMediaSingle: true,
						allowResizing: true,
						allowLinking: true,
						allowResizingInTables: true,
						allowAltTextOnImages: true,
						altTextValidator: (value: string) => {
							const errors = [];
							if (!/^[A-Z]/g.test(value)) {
								errors.push('Please start with capital letter.');
							}
							if (!/^[^"<>&\\]*$/g.test(value)) {
								errors.push('Please remove special characters.');
							}
							if (!/(\w.+\s).+/g.test(value)) {
								errors.push('Please use at least two words.');
							}
							return errors;
						},
						allowCaptions: true,
						featureFlags: {
							mediaInline: true,
						},
					}}
					onChange={this.handleChangeInTheEditor}
					taskDecisionProvider={Promise.resolve(getMockTaskDecisionResource())}
				/>
				<div
					id="output"
					data-placeholder="This is an empty document (or something has gone really wrong)"
				>
					{this.state.output}
				</div>
			</div>
		);
	}
}
