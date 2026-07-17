import React, { useCallback, useEffect, useRef, type MutableRefObject } from 'react';

import { useIntl } from 'react-intl';

import { cssMap, cx } from '@atlaskit/css';
import { appearancePropsMap } from '@atlaskit/editor-common/card';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { getActiveLinkMark } from '@atlaskit/editor-common/link';
import { PASTE_MENU, useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isSupportedInParent } from '@atlaskit/editor-common/utils';
import { Fragment, type Slice } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { ToolbarDropdownItemSection, useToolbarDropdownMenu } from '@atlaskit/editor-toolbar';
import type {
	AsyncHiddenContext,
	RegisterComponent,
} from '@atlaskit/editor-ui-control-model/types';
import MinusIcon from '@atlaskit/icon/core/minus';
import SmartLinkCardIcon from '@atlaskit/icon/core/smart-link-card';
import SmartLinkEmbedIcon from '@atlaskit/icon/core/smart-link-embed';
import SmartLinkInlineIcon from '@atlaskit/icon/core/smart-link-inline';
import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { type CardContext, useSmartCardContext } from '@atlaskit/link-provider/context';
import { Box, Flex, Pressable } from '@atlaskit/primitives/compiled';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { token } from '@atlaskit/tokens';

import type { CardPlugin } from '../cardPluginType';
import { changeSelectedCardToLink, setSelectedCardAppearance } from '../pm-plugins/doc';

import { getSingleSmartLinkUrlFromSlice } from './currentPastedSmartLink';
import { getCardAtPasteRange } from './pasteDisplayAsUtils';

export const SMART_LINK_DISPLAY_AS_PASTE_MENU_SECTION_KEY =
	'smart-link-display-as-paste-menu-section';

type PasteOptionsToolbarSharedState = {
	pasteEndPos: number;
	pasteStartPos: number;
};

type CardSharedState = {
	cards: Array<{ pos: number }>;
	selectedInlineLinkPosition?: number;
};

type PasteSharedStateApi = {
	paste?: {
		sharedState: {
			currentState: () =>
				| {
						lastContentPasted?: { pastedSlice?: Slice } | null;
				  }
				| undefined;
		};
	};
};

// Subset of `PasteMenuRuleFactories` we structurally consume here — kept local
// to avoid importing the toolbar package (see cycle note below).
type PasteMenuRulesSubset = {
	notSingleLinkRule: () => boolean;
};

// `pasteOptionsToolbarPlugin` is intentionally NOT declared in `CardPluginDependencies`
// because doing so introduces a runtime package cycle
// (editor-plugin-card -> editor-plugin-paste-options-toolbar -> editor-plugin-paste
// -> editor-plugin-card) AND a TS2719 "two different types with this name exist" error
// at downstream consumers (e.g. Jira's `EditorAfterBanner.tsx`). The `api` shape is augmented locally instead.
type PasteOptionsToolbarApi = {
	pasteOptionsToolbarPlugin: {
		actions: {
			getPasteMenuRules: () => PasteMenuRulesSubset;
		};
		sharedState: {
			currentState: () => PasteOptionsToolbarSharedState | undefined;
		};
	};
};

type PasteDisplayAppearance = 'url' | 'inline' | 'block' | 'embed';
type SmartCardClient = CardContext['connections']['client'];

const styles = cssMap({
	appearanceBox: {
		backgroundColor: token('elevation.surface.sunken'),
		marginTop: token('space.100'),
		marginRight: token('space.100'),
		marginBottom: token('space.100'),
		marginLeft: token('space.100'),
		paddingTop: token('space.050'),
		paddingRight: token('space.050'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.050'),
		borderRadius: token('radius.medium'),
	},
	iconWrapper: {
		backgroundColor: token('elevation.surface'),
		display: 'flex',
		width: '100%',
		justifyContent: 'space-around',
	},
	iconButton: {
		alignItems: 'center',
		borderColor: token('color.border'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderRadius: token('radius.medium'),
		color: token('color.text'),
		display: 'flex',
		height: '32px',
		justifyContent: 'center',
		width: '100%',
		backgroundColor: token('color.background.neutral.subtle'),
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
	},
	iconButtonSelected: {
		alignItems: 'center',
		backgroundColor: token('color.background.selected'),
		borderColor: token('color.border.selected'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderRadius: token('radius.medium'),
		color: token('color.text'),
		display: 'flex',
		height: '32px',
		justifyContent: 'center',
		width: '100%',
		'&:hover': {
			backgroundColor: token('color.background.selected.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.selected.pressed'),
		},
	},
	iconButtonDisabled: {
		alignItems: 'center',
		backgroundColor: token('color.background.disabled'),
		borderColor: token('color.border.disabled'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderRadius: token('radius.medium'),
		color: token('color.text.disabled'),
		display: 'flex',
		height: '32px',
		justifyContent: 'center',
		width: '100%',
	},
});

type AppearanceOptionIconButtonProps = {
	appearance: PasteDisplayAppearance;
	currentAppearance: PasteDisplayAppearance;
	Icon: React.ComponentType<{ label: string }>;
	isDisabled: boolean;
	label: string;
	onClick: () => void;
};

type AppearanceButtonProps = {
	currentAppearance: PasteDisplayAppearance;
	label: string;
	onClick: () => void;
};

type ToggleableAppearanceButtonProps = AppearanceButtonProps & {
	isDisabled: boolean;
};

const AppearanceOptionIconButton = ({
	appearance,
	currentAppearance,
	isDisabled,
	label,
	Icon,
	onClick,
}: AppearanceOptionIconButtonProps) => {
	return (
		<Box xcss={styles.iconWrapper}>
			<Pressable
				xcss={cx(
					styles.iconButton,
					isDisabled && styles.iconButtonDisabled,
					!isDisabled && currentAppearance === appearance && styles.iconButtonSelected,
				)}
				aria-label={label}
				aria-pressed={currentAppearance === appearance}
				isDisabled={isDisabled}
				onClick={onClick}
			>
				<Icon label={label} />
			</Pressable>
		</Box>
	);
};

const InlineAppearanceIconButton = ({
	currentAppearance,
	isDisabled,
	label,
	onClick,
}: ToggleableAppearanceButtonProps) => (
	<AppearanceOptionIconButton
		appearance="inline"
		currentAppearance={currentAppearance}
		isDisabled={isDisabled}
		label={label}
		Icon={SmartLinkInlineIcon}
		onClick={onClick}
	/>
);

const BlockAppearanceIconButton = ({
	currentAppearance,
	isDisabled,
	label,
	onClick,
}: ToggleableAppearanceButtonProps) => (
	<AppearanceOptionIconButton
		appearance="block"
		currentAppearance={currentAppearance}
		isDisabled={isDisabled}
		label={label}
		Icon={SmartLinkCardIcon}
		onClick={onClick}
	/>
);

const EmbedAppearanceIconButton = ({
	currentAppearance,
	isDisabled,
	label,
	onClick,
}: ToggleableAppearanceButtonProps) => (
	<AppearanceOptionIconButton
		appearance="embed"
		currentAppearance={currentAppearance}
		isDisabled={isDisabled}
		label={label}
		Icon={SmartLinkEmbedIcon}
		onClick={onClick}
	/>
);

const getCurrentPastedSlice = (
	api: ExtractInjectionAPI<CardPlugin> | undefined,
): Slice | undefined => {
	const apiWithPaste = api as (ExtractInjectionAPI<CardPlugin> & PasteSharedStateApi) | undefined;
	const pasteState = apiWithPaste?.paste?.sharedState.currentState();
	const slice = pasteState?.lastContentPasted?.pastedSlice;
	return slice;
};

const getCardUrlAtPasteRange = ({
	editorView,
	pasteStartPos,
	pasteEndPos,
}: {
	editorView: EditorView;
	pasteEndPos: number;
	pasteStartPos: number;
}): string | undefined => {
	const cardAtPasteRange = getCardAtPasteRange(editorView.state, pasteStartPos, pasteEndPos);
	const maybeAttrs = cardAtPasteRange
		? (editorView.state.doc.nodeAt(cardAtPasteRange.pos)?.attrs as
				| { data?: { url?: unknown }; url?: unknown }
				| undefined)
		: undefined;
	const maybeUrl = maybeAttrs?.url ?? maybeAttrs?.data?.url;

	return typeof maybeUrl === 'string' ? maybeUrl : undefined;
};

export const setAppearanceSelection = ({
	editorView,
	pasteStartPos,
	pasteEndPos,
	targetPos,
}: {
	editorView: EditorView;
	pasteEndPos: number;
	pasteStartPos: number;
	targetPos: number | undefined;
}): boolean => {
	const { state, dispatch } = editorView;
	const maxPos = state.doc.content.size;
	const clampedStart = Math.max(0, Math.min(pasteStartPos, maxPos));
	const clampedEnd = Math.max(0, Math.min(pasteEndPos, maxPos));
	const from = Math.min(clampedStart, clampedEnd);
	const to = Math.max(clampedStart, clampedEnd);
	const isTargetPosInBounds =
		targetPos !== undefined && targetPos >= 0 && targetPos <= state.doc.content.size;

	try {
		const nextSelection =
			isTargetPosInBounds && targetPos !== undefined
				? NodeSelection.create(state.doc, targetPos)
				: TextSelection.create(state.doc, from, to);
		const tr = state.tr.setSelection(nextSelection);
		dispatch(tr);
		return true;
	} catch {
		return false;
	}
};

export const getFirstLinkRangeInSelection = (
	editorView: EditorView,
): { from: number; to: number } | undefined => {
	const { state } = editorView;
	const linkMarkType = state.schema.marks.link;
	if (!linkMarkType) {
		return;
	}

	let firstLinkRange: { from: number; to: number } | undefined;
	state.doc.nodesBetween(state.selection.from, state.selection.to, (node, pos) => {
		if (firstLinkRange || !node.isText) {
			return;
		}
		if (linkMarkType.isInSet(node.marks)) {
			firstLinkRange = { from: pos, to: pos + node.nodeSize };
		}
	});

	return firstLinkRange;
};

export const normalizeSelectionToLinkRangeForUrlAppearance = ({
	editorView,
	targetPos,
}: {
	editorView: EditorView;
	targetPos: number | undefined;
}): void => {
	if (targetPos !== undefined || getActiveLinkMark(editorView.state)) {
		return;
	}

	const firstLinkRange = getFirstLinkRangeInSelection(editorView);
	if (!firstLinkRange) {
		return;
	}

	const linkRangeSelectionTr = editorView.state.tr.setSelection(
		TextSelection.create(editorView.state.doc, firstLinkRange.from, firstLinkRange.to),
	);
	editorView.dispatch(linkRangeSelectionTr);
};

const PasteDisplayAsMenuHorizontalView = ({
	api,
	allowBlockCards,
	allowEmbeds,
}: {
	allowBlockCards: boolean;
	allowEmbeds?: boolean;
	api: ExtractInjectionAPI<CardPlugin> | undefined;
}) => {
	const intl = useIntl();
	const { editorView } = useEditorToolbar();
	const toolbarDropdownMenu = useToolbarDropdownMenu();
	const smartCardContext = useSmartCardContext();
	const frameRef = useRef<number | null>(null);
	const isApplyingRef = useRef(false);
	const apiWithPasteOptionsToolbar = api as
		| (ExtractInjectionAPI<CardPlugin> & PasteOptionsToolbarApi)
		| undefined;
	const pasteRange = useSharedPluginStateWithSelector(
		apiWithPasteOptionsToolbar,
		['pasteOptionsToolbarPlugin'],
		(states) => {
			const pluginState = states.pasteOptionsToolbarPluginState as
				| PasteOptionsToolbarSharedState
				| undefined;
			return pluginState
				? {
						pasteEndPos: pluginState.pasteEndPos,
						pasteStartPos: pluginState.pasteStartPos,
					}
				: undefined;
		},
	);
	// Subscribe to card state so the menu re-renders when resolved card metadata updates.
	useSharedPluginStateWithSelector(api, ['card'], (states) => {
		return states.cardState as CardSharedState | undefined;
	});
	const pastedLinkUrlFromSlice = getSingleSmartLinkUrlFromSlice(getCurrentPastedSlice(api));

	const pastedLinkUrlFromCard =
		editorView && pasteRange
			? getCardUrlAtPasteRange({
					editorView,
					pasteStartPos: pasteRange.pasteStartPos,
					pasteEndPos: pasteRange.pasteEndPos,
				})
			: undefined;

	const pastedLinkUrl = pastedLinkUrlFromSlice ?? pastedLinkUrlFromCard;
	const pastedLinkUrlState = pastedLinkUrl
		? smartCardContext.value?.store?.getState()?.[pastedLinkUrl]
		: undefined;
	const hasResolvedSmartLinkData = Boolean(pastedLinkUrlState?.details);

	const currentAppearance: PasteDisplayAppearance | undefined =
		editorView && pasteRange
			? (getCardAtPasteRange(editorView.state, pasteRange.pasteStartPos, pasteRange.pasteEndPos)
					?.appearance ?? 'url')
			: undefined;

	const handleClick = useCallback(
		(appearance: PasteDisplayAppearance) => () => {
			if (
				!editorView ||
				!pasteRange ||
				!pastedLinkUrl ||
				!currentAppearance ||
				isApplyingRef.current
			) {
				return;
			}

			isApplyingRef.current = true;

			const { state, dispatch } = editorView;
			const { pasteStartPos, pasteEndPos } = pasteRange;
			const cardAtPasteRange = getCardAtPasteRange(state, pasteStartPos, pasteEndPos);

			if (appearance === 'url') {
				if (cardAtPasteRange) {
					changeSelectedCardToLink(
						pastedLinkUrl,
						pastedLinkUrl,
						true,
						state.doc.nodeAt(cardAtPasteRange.pos) ?? undefined,
						cardAtPasteRange.pos,
						api?.analytics?.actions,
					)(state, dispatch, editorView);
				}
				toolbarDropdownMenu?.closeMenu(null);
				isApplyingRef.current = false;
				return;
			}

			const targetPos = cardAtPasteRange?.pos;
			const targetNodeAttrs =
				targetPos === undefined
					? undefined
					: (state.doc.nodeAt(targetPos)?.attrs as
							| { data?: { url?: unknown }; url?: unknown }
							| undefined);
			const targetNodeUrl = targetNodeAttrs?.url ?? targetNodeAttrs?.data?.url;
			const isRecoveredAdjacentPastedCard =
				expValEqualsNoExposure('confluence_editor_paste_3p_link_actions_menu', 'isEnabled', true) &&
				targetPos === pasteStartPos - 1 &&
				pasteStartPos === pasteEndPos &&
				targetNodeUrl === pastedLinkUrl;
			if (targetPos !== undefined && targetPos < pasteStartPos && !isRecoveredAdjacentPastedCard) {
				isApplyingRef.current = false;
				return;
			}

			const didApplySelection = setAppearanceSelection({
				editorView,
				pasteStartPos,
				pasteEndPos,
				targetPos,
			});
			if (!didApplySelection) {
				toolbarDropdownMenu?.closeMenu(null);
				isApplyingRef.current = false;
				return;
			}
			normalizeSelectionToLinkRangeForUrlAppearance({ editorView, targetPos });

			frameRef.current = requestAnimationFrame(() => {
				frameRef.current = null;
				setSelectedCardAppearance(appearance, api?.analytics?.actions)(
					editorView.state,
					editorView.dispatch,
					editorView,
				);
				toolbarDropdownMenu?.closeMenu(null);
				isApplyingRef.current = false;
			});
		},
		[api, currentAppearance, editorView, pasteRange, pastedLinkUrl, toolbarDropdownMenu],
	);

	useEffect(() => {
		return () => {
			if (frameRef.current !== null) {
				cancelAnimationFrame(frameRef.current);
			}
			isApplyingRef.current = false;
		};
	}, []);

	if (!editorView || !pasteRange || !pastedLinkUrl || !currentAppearance) {
		return null;
	}

	const preview =
		allowEmbeds &&
		pastedLinkUrl &&
		smartCardContext.value?.extractors.getPreview(pastedLinkUrl, 'web');

	const blockCardNodeType = editorView.state.schema.nodes.blockCard;
	const embedCardNodeType = editorView.state.schema.nodes.embedCard;

	const isBlockSupportedFromAppearanceContext =
		allowBlockCards &&
		blockCardNodeType &&
		isSupportedInParent(
			editorView.state,
			Fragment.from(blockCardNodeType.createChecked({})),
			currentAppearance === 'url' || currentAppearance === 'inline' ? undefined : currentAppearance,
		);
	const isEmbedSupportedFromAppearanceContext =
		allowEmbeds &&
		preview &&
		embedCardNodeType &&
		isSupportedInParent(
			editorView.state,
			Fragment.from(embedCardNodeType.createChecked({})),
			currentAppearance === 'url' || currentAppearance === 'inline' ? undefined : currentAppearance,
		);
	const isSmartLinkConvertible = hasResolvedSmartLinkData;
	const isBlockSupportedFromSelection =
		allowBlockCards &&
		blockCardNodeType &&
		isSupportedInParent(
			editorView.state,
			Fragment.from(blockCardNodeType.createChecked({})),
			undefined,
		);
	const isEmbedSupportedFromSelection =
		allowEmbeds &&
		preview &&
		embedCardNodeType &&
		isSupportedInParent(
			editorView.state,
			Fragment.from(embedCardNodeType.createChecked({})),
			undefined,
		);
	const isBlockSupported = Boolean(
		isBlockSupportedFromAppearanceContext || isBlockSupportedFromSelection,
	);
	const isEmbedSupported = Boolean(
		isEmbedSupportedFromAppearanceContext || isEmbedSupportedFromSelection,
	);

	return (
		<Flex xcss={styles.appearanceBox} gap="space.050">
			<AppearanceOptionIconButton
				appearance="url"
				currentAppearance={currentAppearance}
				isDisabled={false}
				label={intl.formatMessage(appearancePropsMap.url.title)}
				Icon={MinusIcon}
				onClick={handleClick('url')}
			/>
			<InlineAppearanceIconButton
				currentAppearance={currentAppearance}
				isDisabled={!isSmartLinkConvertible}
				label={intl.formatMessage(appearancePropsMap.inline.title)}
				onClick={handleClick('inline')}
			/>
			<BlockAppearanceIconButton
				currentAppearance={currentAppearance}
				isDisabled={!isSmartLinkConvertible || !isBlockSupported}
				label={intl.formatMessage(appearancePropsMap.block.title)}
				onClick={handleClick('block')}
			/>
			<EmbedAppearanceIconButton
				currentAppearance={currentAppearance}
				isDisabled={!isEmbedSupported}
				label={intl.formatMessage(appearancePropsMap.embed.title)}
				onClick={handleClick('embed')}
			/>
		</Flex>
	);
};

const PasteDisplayAsMenuSection = ({
	api,
	allowBlockCards,
	allowEmbeds,
}: {
	allowBlockCards: boolean;
	allowEmbeds?: boolean;
	api: ExtractInjectionAPI<CardPlugin> | undefined;
}) => {
	const intl = useIntl();
	return (
		<ToolbarDropdownItemSection
			title={intl.formatMessage({
				defaultMessage: 'Display as',
				description: 'Section title for Smart Link display options in the paste actions menu.',
				id: 'fabric.editor.pasteDisplayAsMenu.displayAs',
			})}
		>
			<PasteDisplayAsMenuHorizontalView
				api={api}
				allowBlockCards={allowBlockCards}
				allowEmbeds={allowEmbeds}
			/>
		</ToolbarDropdownItemSection>
	);
};

export const getPasteDisplayAsMenuComponents = ({
	api,
	allowBlockCards,
	allowEmbeds,
	getEditorView,
	smartCardClientRef,
}: {
	allowBlockCards: boolean;
	allowEmbeds?: boolean;
	api: ExtractInjectionAPI<CardPlugin> | undefined;
	getEditorView: () => EditorView | undefined;
	smartCardClientRef: MutableRefObject<SmartCardClient | undefined>;
}): RegisterComponent[] => {
	const smartlinkAsyncHidden = async (context: AsyncHiddenContext) => {
		const { pastedUrl } = context;
		if (!pastedUrl) {
			return false;
		}

		const isEnabled = expValEqualsNoExposure(
			'confluence_editor_paste_3p_link_actions_menu',
			'isEnabled',
			true,
		);
		const smartCardClient = smartCardClientRef?.current;
		if (!isEnabled || !smartCardClient) {
			return true;
		}

		try {
			const response: JsonLd.Response = await smartCardClient.fetchData(pastedUrl);
			return response.meta?.access !== 'granted';
		} catch {
			// Network / auth errors → hide
			return true;
		}
	};

	return [
		{
			type: 'menu-section',
			key: SMART_LINK_DISPLAY_AS_PASTE_MENU_SECTION_KEY,
			parents: [
				{
					type: PASTE_MENU.type,
					key: PASTE_MENU.key,
					rank: 60,
				},
			],
			isAsyncHidden: smartlinkAsyncHidden,
			isHidden: () => {
				if (
					!expValEqualsNoExposure('confluence_editor_paste_3p_link_actions_menu', 'isEnabled', true)
				) {
					return true;
				}

				const apiWithPasteOptionsToolbar = api as
					| (ExtractInjectionAPI<CardPlugin> & PasteOptionsToolbarApi)
					| undefined;
				const pasteRange =
					apiWithPasteOptionsToolbar?.pasteOptionsToolbarPlugin?.sharedState.currentState();
				const editorView = getEditorView();

				if (!editorView || !pasteRange) {
					return true;
				}

				// Slice-shape check — delegated to the toolbar plugin's shared
				// `notSingleLinkRule` via the structural cast (see note above).
				const rules =
					apiWithPasteOptionsToolbar?.pasteOptionsToolbarPlugin?.actions.getPasteMenuRules();
				if (!rules || rules.notSingleLinkRule()) {
					return true;
				}

				const urlFromSlice = getSingleSmartLinkUrlFromSlice(getCurrentPastedSlice(api));
				if (urlFromSlice) {
					return false;
				}

				// Fallback: plain-text URL paste that the card plugin already resolved into a card node in the doc.
				const urlFromCard = getCardUrlAtPasteRange({
					editorView,
					pasteStartPos: pasteRange.pasteStartPos,
					pasteEndPos: pasteRange.pasteEndPos,
				});
				return !urlFromCard;
			},
			component: () => (
				<PasteDisplayAsMenuSection
					api={api}
					allowBlockCards={allowBlockCards}
					allowEmbeds={allowEmbeds}
				/>
			),
		},
	];
};
