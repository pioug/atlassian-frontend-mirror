/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import React from 'react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { MentionProvider } from '@atlaskit/mention/resource';
import { MentionResource } from '@atlaskit/mention/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import type { ActivityProvider } from '@atlaskit/activity';
// eslint-disable-next-line  no-restricted-imports -- Legacy package outside of AFM lacks entry points
import { MockActivityResource } from '@atlaskit/activity/dist/es5/support';
import type { EmojiProvider } from '@atlaskit/emoji';
import { token } from '@atlaskit/tokens';
import { BitbucketTransformer } from '../../src';
import { content } from './styles';

const rejectedPromise = Promise.reject(new Error('Simulated provider rejection'));
const pendingPromise = new Promise<any>(() => {});

const providers = {
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
	emojiProvider: {
		resolved: getEmojiResource({ uploadSupported: true }),
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

export interface State {
	reloadEditor: boolean;
	editorEnabled: boolean;
	mentionProvider: 'resolved' | 'pending' | 'rejected' | 'undefined';
	emojiProvider: 'resolved' | 'pending' | 'rejected' | 'undefined';
	activityProvider: 'resolved' | 'pending' | 'rejected' | 'undefined';
	document?: string;
}

export type Props = {
	renderEditor: (props: {
		disabled: boolean;
		mentionProvider?: Promise<MentionProvider>;
		emojiProvider?: Promise<EmojiProvider>;
		activityProvider?: Promise<ActivityProvider> | MockActivityResource;
		onChange: (view: EditorView) => void;
	}) => React.ReactChild;
};

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class ToolsDrawer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			reloadEditor: false,
			editorEnabled: true,
			mentionProvider: 'resolved',
			emojiProvider: 'resolved',
			activityProvider: 'resolved',
			document: '',
		};
	}

	private onChange = (editorView: EditorView) => {
		const { schema, doc } = editorView.state;
		const document = new BitbucketTransformer(schema).encode(doc);
		this.setState({
			document,
		});
	};

	render() {
		const {
			mentionProvider,
			emojiProvider,
			activityProvider,
			document,
			reloadEditor,
			editorEnabled,
		} = this.state;
		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			<div css={content}>
				<div style={{ padding: `${token('space.075', '6px')} 0` }}>️️️ Bitbucket Editor</div>
				{reloadEditor
					? ''
					: this.props.renderEditor({
							disabled: !editorEnabled,
							mentionProvider: providers.mentionProvider[mentionProvider],
							emojiProvider: providers.emojiProvider[emojiProvider],
							activityProvider: providers.activityProvider[activityProvider],
							onChange: this.onChange,
						})}
				<legend>Markdown output:</legend>
				<pre>{document}</pre>
			</div>
		);
	}
}
