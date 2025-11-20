/* eslint-disable jsdoc/check-tag-names */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/* eslint-enable jsdoc/check-tag-names */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@compiled/react';
// eslint-disable-next-line @atlaskit/editor/warn-no-restricted-imports -- Example file, requires core
import { Editor, EditorContext, WithEditorActions } from '@atlaskit/editor-core';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { token } from '@atlaskit/tokens';
import { MarkdownTransformer } from '../src';
import exampleMarkdown from '../example-helpers/exampleMarkdown';

const container = css({
	display: 'grid',
	gridTemplateColumns: '50% 50%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'#source': {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = { actions: any };
type State = { source: string };

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class Example extends React.PureComponent<Props, State> {
	state: State = { source: exampleMarkdown };

	componentDidMount() {
		window.setTimeout(() => {
			this.props.actions.replaceDocument(this.state.source);
		});
	}

	handleUpdateToSource = (e: React.FormEvent<HTMLDivElement>) => {
		const value = e.currentTarget.innerText;
		this.setState({ source: value }, () => this.props.actions.replaceDocument(value));
	};

	render() {
		return (
			<div css={container}>
				<div
					id="source"
					contentEditable={true}
					data-placeholder="Enter Markdown to convert"
					onInput={this.handleUpdateToSource}
				>
					{exampleMarkdown}
				</div>
				<Editor
					appearance="comment"
					allowRule={true}
					allowTables={true}
					media={{
						allowMediaSingle: true,
					}}
					contentTransformerProvider={(schema) => new MarkdownTransformer(schema)}
					taskDecisionProvider={Promise.resolve(getMockTaskDecisionResource())}
				/>
			</div>
		);
	}
}

export default (): JSX.Element => (
	<EditorContext>
		<WithEditorActions render={(actions) => <Example actions={actions} />} />
	</EditorContext>
);
