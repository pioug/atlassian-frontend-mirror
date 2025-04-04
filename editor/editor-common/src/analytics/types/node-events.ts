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
	{ inputMethod: INPUT_METHOD.TOOLBAR },
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
	{ inputMethod: INPUT_METHOD.TOOLBAR | INPUT_METHOD.CARD },
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
		inputMethod: INPUT_METHOD.TOOLBAR | INPUT_METHOD.CARD;
		displayMode: ACTION_SUBJECT_ID.CARD_BLOCK | ACTION_SUBJECT_ID.CARD_INLINE;
	},
	undefined
>;

type ChangedLayoutAEP = TrackAEP<
	ACTION.CHANGED_LAYOUT,
	ACTION_SUBJECT.LAYOUT,
	undefined,
	{
		previousLayout?: LAYOUT_TYPE;
		newLayout?: LAYOUT_TYPE;
	},
	undefined
>;

type DeletedLayoutAEP = TrackAEP<
	ACTION.DELETED,
	ACTION_SUBJECT.LAYOUT,
	undefined,
	{ layout?: LAYOUT_TYPE },
	undefined
>;

type DeletedExpandAEP = TrackAEP<
	ACTION.DELETED,
	ACTION_SUBJECT.EXPAND | ACTION_SUBJECT.NESTED_EXPAND,
	undefined,
	{
		inputMethod: INPUT_METHOD.TOOLBAR;
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
			type: string;
			parentType: string;
			ancestry: string;
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
	| ChangeSmartLinkAEP
	| UnsupportedContentAEP;
