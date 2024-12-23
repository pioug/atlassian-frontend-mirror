/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import React from 'react';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
// eslint-disable-next-line no-restricted-imports -- Legacy package outside of AFM lacks entry points
import { MockActivityResource } from '@atlaskit/activity/dist/es5/support';
import { JIRATransformer } from '../src';

import { content } from './styles';

import { MentionResource } from '@atlaskit/mention/resource';
import { token } from '@atlaskit/tokens';

const rejectedPromise = Promise.reject(new Error('Simulated provider rejection'));
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pendingPromise = new Promise<any>(() => {});

interface Providers {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	mentionProvider: any;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	activityProvider: any;
}

const providers: Providers = {
	mentionProvider: {
		resolved: Promise.resolve(mentionResourceProvider),
		'resolved 2': Promise.resolve(
			new MentionResource({
				url: 'https://pf-mentions-service.staging.atlassian.io/mentions/f7ebe2c0-0309-4687-b913-41d422f2110b',
				containerId: 'b0d035bd-9b98-4386-863b-07286c34dc14',
				productId: 'hipchat',
			}),
		),
		pending: pendingPromise,
		rejected: rejectedPromise,
		undefined: undefined,
	},
	activityProvider: {
		resolved: new MockActivityResource(),
		pending: pendingPromise,
		rejected: rejectedPromise,
		undefined: undefined,
	},
};
rejectedPromise.catch(() => {});

export interface RenderEditorProps {
	disabled: boolean;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onChange: (editorView: any) => void;
	mentionProvider: string;
	activityProvider: string;
}

export interface State {
	reloadEditor: boolean;
	editorEnabled: boolean;
	mentionProvider: string;
	activityProvider: string;
	document?: string;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components, @typescript-eslint/no-explicit-any
export default class ToolsDrawer extends React.Component<any, State> {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(props: any) {
		super(props);

		this.state = {
			reloadEditor: false,
			editorEnabled: true,
			mentionProvider: 'resolved',
			activityProvider: 'resolved',
			document: '',
		};
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private onChange = (editorView: any) => {
		const { schema, doc } = editorView.state;
		const document = new JIRATransformer(schema).encode(doc);
		this.setState({
			document,
		});
	};

	render() {
		const { mentionProvider, activityProvider, document, reloadEditor, editorEnabled } = this.state;
		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			<div css={content}>
				<div style={{ padding: `${token('space.075', '6px')} 0` }}>Editor</div>
				{reloadEditor
					? ''
					: this.props.renderEditor({
							disabled: !editorEnabled,
							mentionProvider: providers.mentionProvider[mentionProvider],
							activityProvider: providers.activityProvider[activityProvider],
							onChange: this.onChange,
						} as RenderEditorProps)}
				<legend>Output:</legend>
				<pre>{document}</pre>
			</div>
		);
	}
}
