/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useState } from 'react';

import { IntlProvider } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { EditorContext } from '@atlaskit/editor-core/editor-context';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { AbstractMentionResource } from '@atlaskit/mention/resource';
import type {
	InlineInvitePopupResult,
	UserRole,
	MentionDescription,
	MentionsResult,
} from '@atlaskit/mention/types';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags/setBooleanFeatureFlagResolver';
import { Popup } from '@atlaskit/popup/popup';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	editorContainer: {
		width: '700px',
	},
	popupContent: {
		width: '360px',
	},
});

const DEMO_USERS: MentionDescription[] = [
	{
		id: 'demo-1',
		name: 'Alex Doe',
		mentionName: 'Alex Doe',
		nickname: 'Alex Doe',
		accessLevel: 'CONTAINER',
	},
	{
		id: 'demo-2',
		name: 'Sam Lee',
		mentionName: 'Sam Lee',
		nickname: 'Sam Lee',
		accessLevel: 'CONTAINER',
	},
];

type DemoInlineInvitePopupProps = {
	anchorElement: HTMLElement | null;
	onDismiss: () => void;
	onInviteComplete: (result: InlineInvitePopupResult) => void;
	onReady: (show: ((email: string) => void) | null) => void;
};

const DemoInlineInvitePopup = ({
	anchorElement,
	onDismiss,
	onInviteComplete,
	onReady,
}: DemoInlineInvitePopupProps): React.JSX.Element => {
	const [email, setEmail] = useState<string | null>(null);
	const [isInviting, setIsInviting] = useState(false);

	const show = useCallback((emailToShow: string) => {
		setEmail(emailToShow);
	}, []);

	useEffect(() => {
		onReady(show);
		return () => onReady(null);
	}, [onReady, show]);

	const handleDismiss = useCallback(() => {
		setEmail(null);
		onDismiss();
	}, [onDismiss]);

	const handleInvite = useCallback(async () => {
		if (!email) {
			return;
		}
		setIsInviting(true);
		await new Promise((resolve) => {
			setTimeout(resolve, 800);
		});
		setIsInviting(false);
		onInviteComplete({
			error: [],
			failure: false,
			invited: [{ email, id: `demo-user-${email}` }],
			requested: [],
		});
		setEmail(null);
	}, [email, onInviteComplete]);

	return (
		<Popup
			isOpen={!!email}
			onClose={handleDismiss}
			placement="bottom-start"
			content={() =>
				email ? (
					<Box xcss={styles.popupContent}>
						<Stack space="space.150">
							<Text>Invite {email} to this workspace?</Text>
							<Inline space="space.100">
								<Button appearance="primary" onClick={handleInvite} isLoading={isInviting}>
									Invite
								</Button>
								<Button onClick={handleDismiss}>Cancel</Button>
							</Inline>
						</Stack>
					</Box>
				) : null
			}
			trigger={(triggerProps) => {
				if (anchorElement && typeof triggerProps.ref === 'function') {
					triggerProps.ref(anchorElement);
				}
				return null;
			}}
		/>
	);
};

class DemoMentionResource extends AbstractMentionResource {
	productName = 'confluence';
	shouldEnableInvite = true;
	userRole: UserRole = 'admin';
	userEmailDomain = 'example.com';
	InlineInvitePopup = DemoInlineInvitePopup;
	showInlineInvitePopup?: (email: string) => void;

	getShouldEnableInlineInvite = (): boolean => true;

	filter(query = ''): void {
		const normalizedQuery = query.toLowerCase();
		const mentions = normalizedQuery
			? DEMO_USERS.filter((mention) => mention.name?.toLowerCase().includes(normalizedQuery))
			: DEMO_USERS;
		setTimeout(() => {
			const result: MentionsResult = { mentions, query };
			this._notifyListeners(result);
		}, 10);
	}
}

const demoMentionResource = new DemoMentionResource();
const mentionProviderPromise = Promise.resolve(demoMentionResource);

const InlineInvitePopupExample = (): React.JSX.Element => {
	setBooleanFeatureFlagResolver((flag) => flag === 'inline_invite_from_mentions_kill_switch');

	const universalPreset = useUniversalPreset({
		props: {
			appearance: 'comment',
			mentionProvider: mentionProviderPromise,
			placeholder: 'Type @ then a name with no matches (e.g. "@newperson")…',
		},
	});
	const { preset } = usePreset(() => universalPreset, [universalPreset]);

	return (
		<IntlProvider locale="en">
			<EditorContext>
				<Box xcss={styles.editorContainer}>
					<ComposableEditor
						appearance="comment"
						preset={preset}
						mentionProvider={mentionProviderPromise}
					/>
				</Box>
			</EditorContext>
		</IntlProvider>
	);
};

export default InlineInvitePopupExample;
