import type { ExtensionLayout, PanelType } from '@atlaskit/adf-schema';

import type {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	INPUT_METHOD,
	INSERT_MEDIA_VIA,
} from './enums';
import type { InsertSmartLinkAEP } from './smart-links';
import type { InsertAEP, TrackAEP, OperationalAEP } from './utils';

export enum USER_CONTEXT {
	EDIT = 'edit',
	NEW = 'new',
}

export enum LINK_STATUS {
	RESOLVED = 'resolved',
	UNRESOLVED = 'unresolved',
}

export enum LINK_REPRESENTATION {
	TEXT = 'text',
	INLINE_CARD = 'inlineCard',
	BLOCK_CARD = 'blockCard',
	EMBED = 'embed',
}

export enum LINK_RESOURCE {
	JIRA = 'jiraIssue',
	CONFLUENCE = 'confluencePage',
	BITBUCKET_PR = 'bitbucketPR',
	BITBUCKET_REPO = 'bitbucketRepo',
	TRELLO_CARD = 'trelloCard',
	TRELLO_BOARD = 'trelloBoard',
	STATUS_PAGE = 'statusPage',
	BOX = 'boxFile',
	DROPBOX = 'dropboxFile',
	OFFICE = 'office',
	DRIVE = 'drive',
	YOUTUBE = 'youtubeVideo',
	TWITTER = 'twitterTweet',
	OTHER = 'other',
}

type InsertLineBreakAEP = TrackAEP<
	ACTION.INSERTED,
	ACTION_SUBJECT.TEXT,
	ACTION_SUBJECT_ID.LINE_BREAK,
	undefined,
	undefined
>;

type InsertDividerAEP = InsertAEP<
	ACTION_SUBJECT_ID.DIVIDER,
	{
		inputMethod:
			| INPUT_METHOD.QUICK_INSERT
			| INPUT_METHOD.TOOLBAR
			| INPUT_METHOD.INSERT_MENU
			| INPUT_METHOD.FORMATTING
			| INPUT_METHOD.SHORTCUT;
	},
	undefined
>;

type InsertPanelAEP = InsertAEP<
	ACTION_SUBJECT_ID.PANEL,
	{
		inputMethod: INPUT_METHOD.QUICK_INSERT | INPUT_METHOD.TOOLBAR | INPUT_METHOD.INSERT_MENU;
		panelType: PanelType;
	},
	undefined
>;

type InsertCodeBlockAEP = InsertAEP<
	ACTION_SUBJECT_ID.CODE_BLOCK,
	{
		inputMethod:
			| INPUT_METHOD.QUICK_INSERT
			| INPUT_METHOD.TOOLBAR
			| INPUT_METHOD.INSERT_MENU
			| INPUT_METHOD.FORMATTING
			| INPUT_METHOD.INSERT_MENU;
	},
	undefined
>;

type InsertTableAEP = InsertAEP<
	ACTION_SUBJECT_ID.TABLE,
	{
		inputMethod:
			| INPUT_METHOD.QUICK_INSERT
			| INPUT_METHOD.TOOLBAR
			| INPUT_METHOD.INSERT_MENU
			| INPUT_METHOD.FORMATTING
			| INPUT_METHOD.PICKER
			| INPUT_METHOD.SHORTCUT;
		totalRowCount?: number;
		totalColumnCount?: number;
		localId?: string;
	},
	undefined
>;

type InsertExpandAEP = InsertAEP<
	ACTION_SUBJECT_ID.EXPAND | ACTION_SUBJECT_ID.NESTED_EXPAND,
	{
		inputMethod: INPUT_METHOD.QUICK_INSERT | INPUT_METHOD.INSERT_MENU;
	},
	undefined
>;

type InsertActionDecisionAEP = InsertAEP<
	ACTION_SUBJECT_ID.DECISION | ACTION_SUBJECT_ID.ACTION,
	{
		inputMethod:
			| INPUT_METHOD.QUICK_INSERT
			| INPUT_METHOD.TOOLBAR
			| INPUT_METHOD.INSERT_MENU
			| INPUT_METHOD.FORMATTING
			| INPUT_METHOD.KEYBOARD;
		containerAri?: string;
		objectAri?: string;
		localId: string;
		listLocalId: string;
		userContext?: USER_CONTEXT.EDIT | USER_CONTEXT.NEW;
		position: number;
		listSize: number;
	},
	undefined
>;

type InsertEmojiAEP = InsertAEP<
	ACTION_SUBJECT_ID.EMOJI,
	{
		inputMethod: INPUT_METHOD.TYPEAHEAD | INPUT_METHOD.PICKER | INPUT_METHOD.ASCII;
	},
	undefined
>;

type InsertStatusAEP = InsertAEP<
	ACTION_SUBJECT_ID.STATUS,
	{
		inputMethod: INPUT_METHOD.QUICK_INSERT | INPUT_METHOD.TOOLBAR | INPUT_METHOD.INSERT_MENU;
	},
	undefined
>;

export type InputMethodInsertMedia =
	| INPUT_METHOD.CLIPBOARD
	| INPUT_METHOD.PICKER_CLOUD
	| INPUT_METHOD.DRAG_AND_DROP
	| INPUT_METHOD.BROWSER
	| INPUT_METHOD.MEDIA_PICKER;

export type InsertMediaVia =
	| INSERT_MEDIA_VIA.EXTERNAL_UPLOAD
	| INSERT_MEDIA_VIA.EXTERNAL_URL
	| INSERT_MEDIA_VIA.LOCAL_UPLOAD;

type InsertMediaSingleAEP = InsertAEP<
	ACTION_SUBJECT_ID.MEDIA,
	{
		inputMethod: InputMethodInsertMedia;
		fileExtension?: string;
		type: ACTION_SUBJECT_ID.MEDIA_SINGLE | ACTION_SUBJECT_ID.MEDIA_GROUP;
		insertMediaVia?: InsertMediaVia;
	},
	undefined
>;

type InsertMediaGroupAEP = InsertAEP<
	ACTION_SUBJECT_ID.MEDIA,
	{
		inputMethod?: InputMethodInsertMedia;
		fileExtension?: string;
		type: ACTION_SUBJECT_ID.MEDIA_SINGLE | ACTION_SUBJECT_ID.MEDIA_GROUP;
		insertMediaVia?: InsertMediaVia;
	},
	undefined
>;

type InsertMediaInlineAEP = InsertAEP<
	ACTION_SUBJECT_ID.MEDIA,
	{
		inputMethod?: InputMethodInsertMedia;
		fileExtension?: string;
		type: ACTION_SUBJECT_ID.MEDIA_INLINE;
		insertMediaVia?: InsertMediaVia;
	},
	undefined
>;

export type InputMethodInsertLink =
	| INPUT_METHOD.TYPEAHEAD
	| INPUT_METHOD.CLIPBOARD
	| INPUT_METHOD.FORMATTING
	| INPUT_METHOD.AUTO_DETECT
	| INPUT_METHOD.MANUAL;

type InsertLinkAEP = InsertAEP<
	ACTION_SUBJECT_ID.LINK,
	{
		inputMethod: InputMethodInsertLink;
		fromCurrentDomain: boolean;
	},
	{
		linkDomain: string;
	}
>;

type InsertLinkPreviewAEP = InsertAEP<
	ACTION_SUBJECT_ID.LINK_PREVIEW,
	{
		status: LINK_STATUS.RESOLVED | LINK_STATUS.UNRESOLVED;
		representation?:
			| LINK_REPRESENTATION.TEXT
			| LINK_REPRESENTATION.INLINE_CARD
			| LINK_REPRESENTATION.INLINE_CARD
			| LINK_REPRESENTATION.BLOCK_CARD;
		resourceType?:
			| LINK_RESOURCE.JIRA
			| LINK_RESOURCE.CONFLUENCE
			| LINK_RESOURCE.BITBUCKET_PR
			| LINK_RESOURCE.BITBUCKET_REPO
			| LINK_RESOURCE.TRELLO_CARD
			| LINK_RESOURCE.TRELLO_BOARD
			| LINK_RESOURCE.STATUS_PAGE
			| LINK_RESOURCE.BOX
			| LINK_RESOURCE.DROPBOX
			| LINK_RESOURCE.OFFICE
			| LINK_RESOURCE.DRIVE
			| LINK_RESOURCE.YOUTUBE
			| LINK_RESOURCE.TWITTER
			| LINK_RESOURCE.OTHER;
	},
	undefined
>;

type InsertMediaLinkAEP = InsertAEP<
	ACTION_SUBJECT_ID.MEDIA_LINK,
	{
		inputMethod: INPUT_METHOD.TYPEAHEAD | INPUT_METHOD.MANUAL;
		insertType?: INSERT_MEDIA_VIA;
	},
	undefined
>;

type InsertLayoutAEP = InsertAEP<
	ACTION_SUBJECT_ID.LAYOUT,
	{
		inputMethod:
			| INPUT_METHOD.TOOLBAR
			| INPUT_METHOD.INSERT_MENU
			| INPUT_METHOD.QUICK_INSERT
			| INPUT_METHOD.DRAG_AND_DROP;
		// For DRAG_AND_DROP inputMethod, track distinctive types of source nodes that are dragged to create layout
		// and whether there are multiple nodes
		nodeTypes?: string;
		hasSelectedMultipleNodes?: boolean;
		columnCount?: number;
	},
	undefined
>;

export type InsertDateAEP = InsertAEP<
	ACTION_SUBJECT_ID.DATE,
	{
		inputMethod:
			| INPUT_METHOD.QUICK_INSERT
			| INPUT_METHOD.TOOLBAR
			| INPUT_METHOD.INSERT_MENU
			| INPUT_METHOD.INLINE_SUGGESTION_FLOATING_TB;
	},
	undefined
>;

type InsertExtensionAEP = InsertAEP<
	ACTION_SUBJECT_ID.EXTENSION,
	{
		extensionType: string;
		extensionKey: string;
		key: string;
		inputMethod: INPUT_METHOD.QUICK_INSERT | INPUT_METHOD.TOOLBAR;
	},
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any
>;

type InsertNodeViaExtensionAPIAEP = InsertAEP<
	undefined,
	{
		nodeType: string;
		inputMethod: INPUT_METHOD.EXTENSION_API;

		// referentiality specific info
		hasReferentiality: boolean;
		nodeTypesReferenced?: string[];
		// /referentiality

		layout?: ExtensionLayout;

		// if nodeType === extension
		// eg. ${manifest.type} - com.atlassian.ecosystem
		extensionType?: string;
		/**
		 * extensionkey follows this format:
		 * ${manifest.key}:${manifest.modules.nodes.name}
		 * e.g: 'awesome:item', 'awesome:default', 'awesome:list'
		 */
		extensionKey?: string;
		// /extension
	},
	undefined
>;

type InsertPlaceholderTextAEP = InsertAEP<
	ACTION_SUBJECT_ID.PLACEHOLDER_TEXT,
	{
		inputMethod: INPUT_METHOD.QUICK_INSERT | INPUT_METHOD.TOOLBAR | INPUT_METHOD.INSERT_MENU;
	},
	undefined
>;

type FailedToInsertMediaPayload = OperationalAEP<
	ACTION.FAILED_TO_INSERT,
	ACTION_SUBJECT.DOCUMENT,
	ACTION_SUBJECT_ID.MEDIA_INLINE | ACTION_SUBJECT_ID.MEDIA_SINGLE | ACTION_SUBJECT_ID.MEDIA_GROUP,
	{
		inputMethod?: InputMethodInsertMedia;
		fileExtension?: string;
		insertMediaVia?: InsertMediaVia;
		reason?: string;
	}
>;

export type InsertEventPayload =
	| InsertDividerAEP
	| InsertLineBreakAEP
	| InsertPanelAEP
	| InsertCodeBlockAEP
	| InsertTableAEP
	| InsertExpandAEP
	| InsertActionDecisionAEP
	| InsertEmojiAEP
	| InsertStatusAEP
	| InsertMediaSingleAEP
	| InsertMediaGroupAEP
	| InsertMediaInlineAEP
	| InsertLinkAEP
	| InsertLinkPreviewAEP
	| InsertMediaLinkAEP
	| InsertSmartLinkAEP
	| InsertLayoutAEP
	| InsertExtensionAEP
	| InsertNodeViaExtensionAPIAEP
	| InsertDateAEP
	| InsertPlaceholderTextAEP
	| FailedToInsertMediaPayload;
