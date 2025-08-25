/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { ActivityProvider } from '@atlaskit/activity';
// eslint-disable-next-line no-restricted-imports -- Legacy package outside of AFM lacks entry points
import { MockActivityResource } from '@atlaskit/activity/dist/es5/support';
import type { MentionProvider } from '@atlaskit/mention/resource';
import { MentionResource } from '@atlaskit/mention/resource';
import type { EmojiProvider } from '@atlaskit/emoji';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { token } from '@atlaskit/tokens';

import { SlackTransformer } from '../src';

import { content } from './styles';

const rejectedPromise = Promise.reject(new Error('Simulated provider rejection'));
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
	activityProvider: 'resolved' | 'pending' | 'rejected' | 'undefined';
	document?: string;
	editorEnabled: boolean;
	emojiProvider: 'resolved' | 'pending' | 'rejected' | 'undefined';
	mentionProvider: 'resolved' | 'pending' | 'rejected' | 'undefined';
	reloadEditor: boolean;
}

export type Props = {
	renderEditor: (props: {
		activityProvider?: Promise<ActivityProvider> | MockActivityResource;
		disabled: boolean;
		emojiProvider?: Promise<EmojiProvider>;
		mentionProvider?: Promise<MentionProvider>;
		onChange: (view: EditorView) => void;
	}) => React.ReactChild;
};

export default function ToolsDrawer({ renderEditor }: Props) {
	const [
		{ mentionProvider, emojiProvider, activityProvider, document, reloadEditor, editorEnabled },
		setState,
	] = useState<State>({
		reloadEditor: false,
		editorEnabled: true,
		mentionProvider: 'resolved',
		emojiProvider: 'resolved',
		activityProvider: 'resolved',
		document: '',
	});

	const handleChange = (editorView: EditorView) => {
		const { doc } = editorView.state;
		const document = new SlackTransformer().encode(doc);

		setState((prevState) => ({
			...prevState,
			document,
		}));
	};

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<div css={content}>
			<div style={{ padding: `${token('space.075', '6px')} 0` }}>️️️Slack Editor</div>
			{reloadEditor
				? ''
				: renderEditor({
						disabled: !editorEnabled,
						mentionProvider: providers.mentionProvider[mentionProvider],
						emojiProvider: providers.emojiProvider[emojiProvider],
						activityProvider: providers.activityProvider[activityProvider],
						onChange: handleChange,
					})}
			<legend>Markdown output:</legend>
			<pre>{document}</pre>
		</div>
	);
}
