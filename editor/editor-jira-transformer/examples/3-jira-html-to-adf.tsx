/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import React from 'react';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { token } from '@atlaskit/tokens';
import { JIRATransformer } from '../src';

const container = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'#source, #output': {
		boxSizing: 'border-box',
		margin: token('space.100', '8px'),
		padding: token('space.100', '8px'),
		whiteSpace: 'pre-wrap',
		width: '100%',
		'&:focus': {
			outline: 'none',
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'#source': {
		height: '80px',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'#output': {
		border: '1px solid',
		minHeight: '480px',
	},
});

const jiraTransformer = new JIRATransformer(defaultSchema);
const adfTransformer = new JSONTransformer();

function getADF(html: string) {
	const pmNode = jiraTransformer.parse(html);
	return adfTransformer.encode(pmNode);
}

export interface State {
	source: string;
}

class Example extends React.PureComponent<{}, State> {
	state: State = { source: '' };

	handleChange = (evt: React.FormEvent<HTMLTextAreaElement>) => {
		this.setState({ source: evt.currentTarget.value });
	};

	render() {
		return (
			<div css={container}>
				<textarea id="source" onChange={this.handleChange} />
				<pre id="output">{JSON.stringify(getADF(this.state.source), null, 2)}</pre>
			</div>
		);
	}
}

export default () => <Example />;
