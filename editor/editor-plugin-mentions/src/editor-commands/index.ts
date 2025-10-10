import uuid from 'uuid';

import type { ExtractInjectionAPI, EditorCommand } from '@atlaskit/editor-common/types';
import { getAnnotationMarksForPos } from '@atlaskit/editor-common/utils';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import {
	isResolvingMentionProvider,
	type MentionProvider,
	type MentionDescription,
} from '@atlaskit/mention/resource';
import { fg } from '@atlaskit/platform-feature-flags';

import type { MentionsPlugin } from '../mentionsPluginType';

export type InsertMentionParameters = Pick<
	MentionDescription,
	'name' | 'id' | 'userType' | 'isXProductUser' | 'nickname' | 'accessLevel'
> & {
	localId?: string;
	/**
	 * The name is the name that will be displayed in the editor and stored in the ADF.
	 * If using "sanitizePrivateContent" with the mentions plugin, you can pass an empty
	 * name (ie. `name: ''`) to ensure the name is resolved by the mention provider (based
	 * on the id).
	 *
	 * !Warning: This is set without check if it matches the value in the mention provider, that
	 * must be done on the client side if using this.
	 */
	name: string;
};

type InternalParams = {
	api: ExtractInjectionAPI<MentionsPlugin> | undefined;
	mentionInsertDisplayName: boolean;
	sanitizePrivateContent: boolean;
};

type SingleMentionFragmentParams = {
	mentionInsertDisplayName: boolean | undefined;
	mentionProvider: MentionProvider | undefined;
	sanitizePrivateContent: boolean | undefined;
	tr: Transaction;
};

export const createSingleMentionFragment =
	({
		mentionInsertDisplayName,
		mentionProvider,
		tr,
		sanitizePrivateContent,
	}: SingleMentionFragmentParams) =>
	({
		name,
		id,
		userType,
		nickname,
		localId,
		accessLevel,
		isXProductUser,
	}: InsertMentionParameters) => {
		const schema = tr.doc.type.schema;
		const trimmedNickname = nickname && nickname.startsWith('@') ? nickname.slice(1) : nickname;
		const renderName = mentionInsertDisplayName || !trimmedNickname ? name : trimmedNickname;
		if (isXProductUser && mentionProvider && mentionProvider.inviteXProductUser) {
			mentionProvider.inviteXProductUser(id, name);
		}

		// Don't insert into document if document data is sanitized.
		const text = sanitizePrivateContent ? '' : `@${renderName}`;

		if (sanitizePrivateContent && isResolvingMentionProvider(mentionProvider)) {
			// Cache (locally) for later rendering
			mentionProvider.cacheMentionName(id, renderName);
		}

		const annotationMarksForPos: Mark[] | undefined = fg(
			'editor_inline_comments_paste_insert_nodes',
		)
			? getAnnotationMarksForPos(tr.selection.$head)
			: undefined;

		const mentionNode = schema.nodes.mention.createChecked(
			{
				text,
				id,
				accessLevel,
				userType: userType === 'DEFAULT' ? null : userType,
				localId: localId ?? uuid(),
			},
			null,
			fg('editor_inline_comments_paste_insert_nodes') ? annotationMarksForPos : undefined,
		);
		const space = schema.text(
			' ',
			fg('editor_inline_comments_paste_insert_nodes') ? annotationMarksForPos : undefined,
		);
		return Fragment.from([mentionNode, space]);
	};

export const insertMention =
	({ sanitizePrivateContent, api, mentionInsertDisplayName }: InternalParams) =>
	({
		name,
		id,
		userType,
		localId,
		nickname,
		accessLevel,
		isXProductUser,
	}: InsertMentionParameters): EditorCommand => {
		return ({ tr }) => {
			const mentionProvider = api?.mention.sharedState.currentState()?.mentionProvider;
			const mentionFragment = createSingleMentionFragment({
				sanitizePrivateContent,
				mentionProvider,
				mentionInsertDisplayName,
				tr,
			})({ name, id, userType, nickname, localId, accessLevel, isXProductUser });
			return tr.insert(tr.selection.from, mentionFragment);
		};
	};
