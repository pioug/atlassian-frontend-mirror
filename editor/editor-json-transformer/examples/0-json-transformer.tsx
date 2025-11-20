/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import React from 'react';

import { css, jsx } from '@compiled/react';
/* eslint-enable @typescript-eslint/consistent-type-imports */

import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
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
		border: `${token('border.width.selected')} solid`,
		marginTop: token('space.100', '8px'),
		marginRight: token('space.100', '8px'),
		marginBottom: token('space.100', '8px'),
		marginLeft: token('space.100', '8px'),
		paddingTop: token('space.100', '8px'),
		paddingRight: token('space.100', '8px'),
		paddingBottom: token('space.100', '8px'),
		paddingLeft: token('space.100', '8px'),
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

export const mediaProvider: Promise<MediaProvider> = storyMediaProviderFactory();

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class Example extends React.PureComponent<{}, { output: string }> {
	state = { output: '' };
	transformer: JSONTransformer = new JSONTransformer();

	handleChangeInTheEditor = (editorView: EditorView): void => {
		const output = JSON.stringify(this.transformer.encode(editorView.state.doc), null, 2);
		this.setState({ output });
	};

	render(): jsx.JSX.Element {
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
