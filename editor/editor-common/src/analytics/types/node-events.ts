import type { PanelType } from '@atlaskit/adf-schema';

import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, INPUT_METHOD } from './enums';
import type { ChangeTypeAEP, TrackAEP } from './utils';

export enum LAYOUT_TYPE {
	SINGLE_COL = 'singleColumn',
	TWO_COLS_EQUAL = 'twoColumnsEqual',
	THREE_COLS_EQUAL = 'threeColumnsEqual',
	LEFT_SIDEBAR = 'twoColumnsLeftSidebar',
	RIGHT_SIDEBAR = 'twoColumnsRightSidebar',
	THREE_WITH_SIDEBARS = 'threeColumnsWithSidebars ',
	FOUR_COLS_EQUAL = 'fourColumnsEqual',
	FIVE_COLS_EQUAL = 'fiveColumnsEqual',
}

export enum SMART_LINK_TYPE {
	INLINE_CARD = 'inline',
	BLOCK_CARD = 'block',
	URL = 'url',
}

type DeletePanelAEP = TrackAEP<
	ACTION.DELETED,
	ACTION_SUBJECT.PANEL,
	undefined,
	{ inputMethod: INPUT_METHOD.FLOATING_TB | INPUT_METHOD.TOOLBAR },
	undefined
>;

type ChangePanelAEP = ChangeTypeAEP<
	ACTION_SUBJECT.PANEL,
	undefined,
	{ newType: PanelType; previousType: PanelType },
	undefined
>;

type ChangeSmartLinkAEP = ChangeTypeAEP<
	ACTION_SUBJECT.SMART_LINK,
	undefined,
	{ newType: SMART_LINK_TYPE; previousType: SMART_LINK_TYPE },
	undefined
>;

type VisitedSmartLink = TrackAEP<
	ACTION.VISITED,
	ACTION_SUBJECT.SMART_LINK,
	ACTION_SUBJECT_ID.CARD_BLOCK | ACTION_SUBJECT_ID.CARD_INLINE,
	{
		inputMethod:
			| INPUT_METHOD.TOOLBAR
			| INPUT_METHOD.FLOATING_TB
			| INPUT_METHOD.BUTTON
			| INPUT_METHOD.CARD
			| INPUT_METHOD.DOUBLE_CLICK
			| INPUT_METHOD.META_CLICK;
	},
	undefined
>;

type VisitedHyperlink = TrackAEP<
	ACTION.VISITED,
	ACTION_SUBJECT.HYPERLINK,
	undefined,
	{ inputMethod: INPUT_METHOD.TOOLBAR },
	undefined
>;

type DeletedSmartLink = TrackAEP<
	ACTION.DELETED,
	ACTION_SUBJECT.SMART_LINK,
	ACTION_SUBJECT_ID.CARD_BLOCK | ACTION_SUBJECT_ID.CARD_INLINE,
	{
		displayMode: ACTION_SUBJECT_ID.CARD_BLOCK | ACTION_SUBJECT_ID.CARD_INLINE;
		inputMethod: INPUT_METHOD.FLOATING_TB | INPUT_METHOD.TOOLBAR | INPUT_METHOD.CARD;
	},
	undefined
>;

export type NodeDeletedAEP = TrackAEP<
	ACTION.DELETED,
	| ACTION_SUBJECT.PANEL
	| ACTION_SUBJECT.LAYOUT
	| ACTION_SUBJECT.EXPAND
	| ACTION_SUBJECT.TABLE
	| ACTION_SUBJECT.EXTENSION
	| ACTION_SUBJECT.BODIED_EXTENSION
	| ACTION_SUBJECT.SMART_LINK
	| ACTION_SUBJECT.CODE_BLOCK
	| ACTION_SUBJECT.MEDIA_SINGLE
	| ACTION_SUBJECT.MEDIA_GROUP
	| ACTION_SUBJECT.MEDIA_INLINE,
	undefined,
	{ inputMethod: INPUT_METHOD.FLOATING_TB | INPUT_METHOD.TOOLBAR },
	undefined
>;

type ChangedLayoutAEP = TrackAEP<
	ACTION.CHANGED_LAYOUT,
	ACTION_SUBJECT.LAYOUT,
	undefined,
	{
		newLayout?: LAYOUT_TYPE;
		previousLayout?: LAYOUT_TYPE;
	},
	undefined
>;

type DeletedLayoutAEP = TrackAEP<
	ACTION.DELETED,
	ACTION_SUBJECT.LAYOUT,
	undefined,
	{ inputMethod?: INPUT_METHOD.FLOATING_TB | INPUT_METHOD.TOOLBAR; layout?: LAYOUT_TYPE },
	undefined
>;

type DeletedExpandAEP = TrackAEP<
	ACTION.DELETED,
	ACTION_SUBJECT.EXPAND | ACTION_SUBJECT.NESTED_EXPAND,
	undefined,
	{
		inputMethod: INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB;
	},
	undefined
>;

type UnsupportedContentAEP = TrackAEP<
	ACTION.UNSUPPORTED_CONTENT_ENCOUNTERED,
	ACTION_SUBJECT.DOCUMENT,
	| ACTION_SUBJECT_ID.UNSUPPORTED_BLOCK
	| ACTION_SUBJECT_ID.UNSUPPORTED_INLINE
	| ACTION_SUBJECT_ID.UNSUPPORTED_MARK,
	{
		unsupportedNode: {
			ancestry: string;
			parentType: string;
			type: string;
		};
	},
	undefined
>;

export type NodeEventPayload =
	| ChangePanelAEP
	| DeletePanelAEP
	| DeletedSmartLink
	| VisitedSmartLink
	| VisitedHyperlink
	| ChangedLayoutAEP
	| DeletedLayoutAEP
	| DeletedExpandAEP
	| NodeDeletedAEP
	| ChangeSmartLinkAEP
	| UnsupportedContentAEP;
