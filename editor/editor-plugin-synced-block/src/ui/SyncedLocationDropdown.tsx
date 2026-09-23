/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { css, jsx, cssMap, keyframes, cx } from '@compiled/react';
import type { IntlShape } from 'react-intl';

import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { SYNCED_BLOCKS_DOCUMENTATION_URL } from '@atlaskit/editor-common/sync-block';
import type {
	ExtractInjectionAPI,
	FloatingToolbarCustomRenderContext,
} from '@atlaskit/editor-common/types';
import { FloatingToolbarButton as Button } from '@atlaskit/editor-common/ui';
import { ArrowKeyNavigationType, DropdownContainer } from '@atlaskit/editor-common/ui-menu';
import { getPageIdAndTypeFromConfluencePageAri } from '@atlaskit/editor-synced-block-provider';
import type {
	SyncBlockSourceInfo,
	SyncBlockStoreManager,
	ReferencesSourceInfo,
	SyncBlockProduct,
} from '@atlaskit/editor-synced-block-provider';
import type { SyncBlockJiraIssueType } from '@atlaskit/editor-synced-block-provider/types';
// eslint-disable-next-line import/order -- CI requires icon-lab imports before core icon imports.
import PageLiveDocIcon from '@atlaskit/icon-lab/core/page-live-doc';
import BugIcon from '@atlaskit/icon/core/bug';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import EpicIcon from '@atlaskit/icon/core/epic';
import PageIcon from '@atlaskit/icon/core/page';
import QuotationMarkIcon from '@atlaskit/icon/core/quotation-mark';
import StatusErrorIcon from '@atlaskit/icon/core/status-error';
import StoryIcon from '@atlaskit/icon/core/story';
import SubtaskIcon from '@atlaskit/icon/core/subtasks';
import TaskIcon from '@atlaskit/icon/core/task';
import IconTile from '@atlaskit/icon/icon-tile';
import { ConfluenceIcon, JiraIcon } from '@atlaskit/logo';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import Lozenge from '@atlaskit/lozenge/lozenge';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { Box, Text, Inline, Anchor, Stack } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner/spinner';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import type { SyncedBlockPlugin } from '../syncedBlockPluginType';
import { SYNCED_BLOCK_BUTTON_TEST_ID } from '../types';
import { SyncedLocationsEmptyStateIllustration } from './assets/SyncedLocationsEmptyStateIllustration';

interface Props {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	floatingToolbarRenderContext?: FloatingToolbarCustomRenderContext;
	intl: IntlShape;
	isSource: boolean;
	localId: string;
	resourceId: string;
	syncBlockStore: SyncBlockStoreManager;
}

const fadeIn = keyframes({
	from: {
		opacity: 0,
	},
	to: {
		opacity: 1,
	},
});

const headingStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-ds--menu--heading-item]': {
		color: token('color.text.subtlest'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		marginBlock: `${token('space.050')} !important`,
	},
});

const dropdownItemStyles = css({
	// Reduce gap between icon and title
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'a > span': {
		columnGap: `${token('space.075')}`,
	},
});

// logo icon does not fit in ADS IconTile, hence we need custom styles to match with other icons
const logoTileStyles = css({
	backgroundColor: token('color.background.neutral'),
	width: '20px',
	height: '20px',
	borderRadius: token('radius.tile'),
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const SYNCED_LOCATIONS_DROPDOWN_TEST_ID = 'synced-block-synced-locations-dropdown';

const styles = cssMap({
	title: {
		color: token('color.text.subtle'),
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
	},
	note: {
		color: token('color.text.subtlest'),
		whiteSpace: 'nowrap',
	},
	lozenge: {
		marginInlineStart: token('space.075'),
		minWidth: '60px',
	},
	noResultsContainer: {
		width: '235px',
		textAlign: 'center',
	},
	activationDropdownContent: {
		width: '400px',
		paddingBlock: token('space.0'),
	},
	activationNoResultsContainer: {
		boxSizing: 'border-box',
		width: '400px',
		paddingTop: token('space.300'),
		paddingBottom: token('space.300'),
	},
	activationNoResultsContent: {
		width: '290px',
		marginInline: 'auto',
		textAlign: 'center',
	},
	/**
	 * Jira rows append a field name to the title, so they need more room than a
	 * Confluence-only list. Matches the width the activation empty state already uses.
	 */
	fieldAwareDropdownContent: {
		width: '400px',
	},
	/**
	 * The field name gets its own line because appending it to the title lost it entirely.
	 * The title ellipsises first, so at realistic work item summaries nothing was left of
	 * the field. See the informational VR baseline for this dropdown.
	 */
	fieldSecondLine: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	dropdownContent: {
		width: '342px',
		maxHeight: '304px',
		paddingBlock: token('space.025'),
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	containerWithMinHeight: {
		minHeight: '144px',
	},
	contentContainer: {
		width: '100%',
		alignSelf: 'stretch',
		overflowY: 'auto',
		animation: `${fadeIn} 700ms ease-in-out`,
	},
	errorContainer: {
		width: '235px',
		display: 'flex',
	},
	errorIcon: {
		marginBlock: token('space.negative.050'),
	},
	learnMoreLink: {
		textDecoration: 'none',
	},
	requestAccess: {
		width: '106px',
		whiteSpace: 'nowrap',
		marginInlineStart: token('space.075'),
		color: token('color.text.subtlest'),
	},
});

type FetchStatus = 'none' | 'loading' | 'success' | 'error';

/**
 * One field-aware dropdown row. Every string the row shows is composed here from the untouched
 * provider `reference`. Only built with `editor_synced_blocks_jira_custom_rich_text` on.
 */
export type SyncedLocationItem = {
	/**
	 * Work item or page title, with the untitled fallback and the block index applied.
	 * Never carries the field name, so the row and the tooltip can place it differently.
	 */
	baseTitle: string;
	/** Jira field holding the block, when the provider resolved one. */
	fieldName?: string;
	/** `sourceAri` plus the block's position within that source. */
	key: string;
	/** Same-location note shown after the title. */
	note?: string;
	reference: SyncBlockSourceInfo;
};

/** Decided once per fetch. The control shape is what the dropdown held before the experiment. */
type SyncedLocations =
	| { kind: 'control'; references: SyncBlockSourceInfo[] }
	| { items: SyncedLocationItem[]; kind: 'field-aware' };

const EMPTY_LOCATIONS: SyncedLocations = { kind: 'control', references: [] };

const countLocations = (locations: SyncedLocations): number =>
	locations.kind === 'control' ? locations.references.length : locations.items.length;

interface ReferenceDataState {
	fetchStatus: FetchStatus;
	locations: SyncedLocations;
}

const shouldApplyMinHeight = (fetchStatus: FetchStatus, itemCount: number) => {
	// When there are 1/2 items, dropdown height is less than minHeight 144px
	return !(fetchStatus === 'success' && itemCount > 0);
};

const ItemTitle = ({
	title,
	formatMessage,
	onSameDocument,
	isSource,
	hasAccess,
	productType,
}: {
	formatMessage: IntlShape['formatMessage'];
	hasAccess?: boolean;
	isSource?: boolean;
	onSameDocument?: boolean;
	productType?: SyncBlockProduct;
	title: string;
}) => {
	return (
		<Inline>
			<Box as="span" xcss={styles.title}>
				{title}
			</Box>
			{onSameDocument && (
				<Box as="span" xcss={styles.note}>
					&nbsp;-{' '}
					{formatMessage(
						productType === 'confluence-page'
							? messages.syncedLocationDropdownTitleNoteForConfluencePage
							: messages.syncedLocationDropdownTitleNoteForJiraWorkItem,
					)}
				</Box>
			)}
			{isSource && (
				<Box as="span" xcss={styles.lozenge}>
					<Lozenge>{formatMessage(messages.syncedLocationDropdownSourceLozenge)}</Lozenge>
				</Box>
			)}
			{!hasAccess && (
				<Box as="span" xcss={styles.requestAccess}>
					{formatMessage(messages.syncedLocationDropdownRequestAccess)}
				</Box>
			)}
		</Inline>
	);
};

const productIconMap = {
	'confluence-page': ConfluenceIcon,
	'jira-work-item': JiraIcon,
};

const subTypeIconMap = {
	live: PageLiveDocIcon,
	page: PageIcon,
};

const getConfluenceSubTypeIcon = (sourceAri: string, subType?: string | null) => {
	try {
		const { type: pageType } = getPageIdAndTypeFromConfluencePageAri({ ari: sourceAri });
		if (pageType === 'blogpost') {
			return QuotationMarkIcon;
		} else {
			return subType && subType in subTypeIconMap
				? subTypeIconMap[subType as keyof typeof subTypeIconMap]
				: PageIcon;
		}
	} catch {
		return PageIcon;
	}
};

const ProductIcon = ({ product }: { product?: SyncBlockProduct }) => {
	const ProductIcon = product ? (productIconMap[product] ?? AtlassianIcon) : AtlassianIcon;

	return (
		<span css={logoTileStyles}>
			<ProductIcon size="xxsmall" appearance="neutral" />
		</span>
	);
};

// Map AGG issue-type names to ADS icons. The mapping is by the English `name` returned
// from AGG because Jira's REST/GraphQL API does not localise it at this layer. Custom
// (non-default) issue types fall through to the AGG `iconUrl`.
//
// Type the icons as the same shape as `TaskIcon` so we don't import `NewCoreIconProps`
// from a private icon entrypoint.
type IssueTypeIconComponent = typeof TaskIcon;
const jiraIssueTypeIconMap: Record<
	string,
	{ icon: IssueTypeIconComponent; messageKey: keyof typeof messages }
> = {
	Task: { icon: TaskIcon, messageKey: 'syncedLocationDropdownIssueTypeTask' },
	Bug: { icon: BugIcon, messageKey: 'syncedLocationDropdownIssueTypeBug' },
	Story: { icon: StoryIcon, messageKey: 'syncedLocationDropdownIssueTypeStory' },
	Epic: { icon: EpicIcon, messageKey: 'syncedLocationDropdownIssueTypeEpic' },
	Subtask: { icon: SubtaskIcon, messageKey: 'syncedLocationDropdownIssueTypeSubtask' },
	'Sub-task': { icon: SubtaskIcon, messageKey: 'syncedLocationDropdownIssueTypeSubtask' },
};

/**
 * Creates an icon component from a custom Jira issue-type `iconUrl` that conforms to the
 * ADS icon component contract expected by `IconTile`. This lets us reuse `IconTile` for
 * custom issue types — ensuring consistent sizing, background, and border-radius with the
 * standard ADS icons used for known issue types (Bug, Story, etc.).
 *
 * The returned component ignores ADS icon props (color, spacing, etc.) because the image
 * is an external raster/SVG asset that doesn't respond to design tokens.
 */
const customIconCache = new Map<string, IssueTypeIconComponent>();

const createCustomIssueTypeIcon = (iconUrl: string): IssueTypeIconComponent => {
	const cached = customIconCache.get(iconUrl);
	if (cached) {
		return cached;
	}
	const CustomIssueTypeIcon = () => <img src={iconUrl} alt="" width="12" height="12" />;
	CustomIssueTypeIcon.displayName = 'CustomIssueTypeIcon';
	customIconCache.set(iconUrl, CustomIssueTypeIcon);
	return CustomIssueTypeIcon;
};

/**
 * Returns the icon to render for a Jira issue type, or `null` when neither an ADS icon
 * mapping nor an AGG-provided `iconUrl` is available so the caller can fall back to a
 * generic product icon.
 *
 * Implemented as a plain function (not a React component) so the `null` check actually
 * narrows — a JSX expression always evaluates to a truthy `ReactElement` object,
 * meaning callers cannot distinguish a "would render nothing" component from one that
 * renders an icon.
 */
const renderJiraIssueTypeIcon = (
	issueType: SyncBlockJiraIssueType,
	intl: IntlShape,
): ReactNode | null => {
	const mapped = jiraIssueTypeIconMap[issueType.name];
	if (mapped) {
		const label = intl.formatMessage(messages[mapped.messageKey]);
		return <IconTile icon={mapped.icon} label={label} appearance={'gray'} size="xsmall" />;
	}

	// Custom Jira issue types — render inside `IconTile` using a wrapper component so the
	// icon gets the same tile background, border-radius, and sizing as known issue types.
	if (issueType.iconUrl) {
		const CustomIcon = createCustomIssueTypeIcon(issueType.iconUrl);
		const label = intl.formatMessage(messages.syncedLocationDropdownIssueTypeGeneric);
		return <IconTile icon={CustomIcon} label={label} appearance={'gray'} size="xsmall" />;
	}

	return null;
};

const ItemIcon = ({ reference, intl }: { intl: IntlShape; reference: SyncBlockSourceInfo }) => {
	const { hasAccess, subType, productType, sourceAri, issueType } = reference;

	if (productType === 'confluence-page' && hasAccess) {
		return (
			<IconTile
				icon={getConfluenceSubTypeIcon(sourceAri, subType)}
				label=""
				appearance={'gray'}
				size="xsmall"
			/>
		);
	}

	// Render a Jira issue-type icon when we have one.
	// Falls through to the generic product icon when:
	//   - we don't have access (issueType is not surfaced for no-access references),
	//   - AGG returned no `issueType` (partial index, deleted, etc.), or
	//   - the issue type is unrecognised AND has no `iconUrl`.
	if (productType === 'jira-work-item' && hasAccess && issueType) {
		const icon = renderJiraIssueTypeIcon(issueType, intl);
		if (icon !== null) {
			return icon;
		}
	}

	// Generic product fallback for `jira-work-item` (and any future product).
	return <ProductIcon product={productType} />;
};

export const processReferenceData = (
	referenceData: ReferencesSourceInfo['references'],
	intl: IntlShape,
): SyncBlockSourceInfo[] => {
	const { formatMessage } = intl;
	const sourceInfoMap: SourceInfoMap = new Map();
	referenceData?.forEach((reference) => {
		if (!reference) {
			return;
		}
		if (sourceInfoMap.has(reference.sourceAri)) {
			sourceInfoMap.get(reference.sourceAri)?.push(reference);
		} else {
			sourceInfoMap.set(reference.sourceAri, [reference]);
		}
	});

	for (const references of sourceInfoMap.values()) {
		if (references.length > 1) {
			references.forEach(
				(reference, index) =>
					(reference.title = `${
						reference.title === '' && reference.hasAccess
							? formatMessage(messages.syncedLocationDropdownUntitledPage)
							: reference.title
					}: ${formatMessage(messages.syncedLocationDropdownTitleBlockIndex, {
						index: index + 1,
					})}`),
			);
		}
	}

	const sortedReferences = Array.from(sourceInfoMap.values())
		.flat()
		.sort((a, b) => {
			if (a.isSource !== b.isSource) {
				return b.isSource ? 1 : -1;
			}

			if (a.hasAccess !== b.hasAccess) {
				return a.hasAccess ? -1 : 1;
			}

			return (a.title || '').localeCompare(b.title || '');
		});

	return sortedReferences;
};

const isFieldAwareLocationList = (references: ReferencesSourceInfo['references']): boolean =>
	(references?.some((reference) => reference?.productType === 'jira-work-item') ?? false) &&
	isExperimentEnabled('editor_synced_blocks_jira_custom_rich_text');

const groupBySourceAri = (
	referenceData: ReferencesSourceInfo['references'],
): Map<string, SyncBlockSourceInfo[]> => {
	const groups = new Map<string, SyncBlockSourceInfo[]>();
	referenceData?.forEach((reference) => {
		if (!reference) {
			return;
		}
		const group = groups.get(reference.sourceAri);
		if (group) {
			group.push(reference);
		} else {
			groups.set(reference.sourceAri, [reference]);
		}
	});
	return groups;
};

/** Sources first, then accessible locations. `0` leaves the title order to the caller. */
const compareLocationOrder = (a: SyncBlockSourceInfo, b: SyncBlockSourceInfo): number => {
	if (a.isSource !== b.isSource) {
		return b.isSource ? 1 : -1;
	}

	if (a.hasAccess !== b.hasAccess) {
		return a.hasAccess ? -1 : 1;
	}

	return 0;
};

/** The title alone. The field name is placed by the row and the tooltip, not baked in here. */
const getBaseTitle = ({
	blockIndex,
	formatMessage,
	reference,
}: {
	/** 1-based position within the source. Set only when several blocks share a `sourceAri`. */
	blockIndex: number | undefined;
	formatMessage: IntlShape['formatMessage'];
	reference: SyncBlockSourceInfo;
}): string => {
	const title =
		reference.title === '' && reference.hasAccess
			? formatMessage(messages.syncedLocationDropdownUntitledPage)
			: reference.title || reference.url || '';

	return blockIndex === undefined
		? title
		: `${title}: ${formatMessage(messages.syncedLocationDropdownTitleBlockIndex, {
				index: blockIndex,
			})}`;
};

/** Jira rows are noted from `locationScope`; other rows keep the pre-experiment `onSameDocument` note. */
const getFieldAwareNote = (
	reference: SyncBlockSourceInfo,
	formatMessage: IntlShape['formatMessage'],
): string | undefined => {
	if (reference.productType !== 'jira-work-item') {
		if (!reference.onSameDocument) {
			return undefined;
		}
		return formatMessage(
			reference.productType === 'confluence-page'
				? messages.syncedLocationDropdownTitleNoteForConfluencePage
				: messages.syncedLocationDropdownTitleNoteForJiraWorkItem,
		);
	}

	// A provider that computes no scope still reports `onSameDocument`. It is the same host
	// comparison `getLocationScope` starts with, and in Jira the host document is one field.
	const locationScope =
		reference.locationScope ?? (reference.onSameDocument ? 'same-document' : undefined);

	switch (locationScope) {
		case 'same-document':
			return formatMessage(messages.syncedLocationDropdownTitleNoteForJiraWorkItemField);
		case 'same-parent-document':
			return formatMessage(messages.syncedLocationDropdownTitleNoteForJiraWorkItem);
		default:
			return undefined;
	}
};

export const buildFieldAwareItems = (
	referenceData: ReferencesSourceInfo['references'],
	formatMessage: IntlShape['formatMessage'],
): SyncedLocationItem[] =>
	Array.from(groupBySourceAri(referenceData).values())
		.flatMap((group) =>
			group.map((reference, index) => {
				const fieldName =
					reference.productType === 'jira-work-item' ? reference.fieldName : undefined;
				const note = getFieldAwareNote(reference, formatMessage);

				return {
					baseTitle: getBaseTitle({
						blockIndex: group.length > 1 ? index + 1 : undefined,
						formatMessage,
						reference,
					}),
					...(fieldName !== undefined && { fieldName }),
					key: `${reference.sourceAri}#${index}`,
					...(note !== undefined && { note }),
					reference,
				};
			}),
		)
		.sort(
			(a, b) =>
				compareLocationOrder(a.reference, b.reference) || a.baseTitle.localeCompare(b.baseTitle),
		);

const toSyncedLocations = (
	references: ReferencesSourceInfo['references'],
	intl: IntlShape,
): SyncedLocations =>
	isFieldAwareLocationList(references)
		? { kind: 'field-aware', items: buildFieldAwareItems(references, intl.formatMessage) }
		: { kind: 'control', references: processReferenceData(references, intl) };

export const SyncedLocationDropdown = ({
	syncBlockStore,
	resourceId,
	intl,
	isSource,
	localId,
	api,
	floatingToolbarRenderContext,
}: Props): JSX.Element => {
	return (
		<EditorPositionedSyncedLocationDropdown
			syncBlockStore={syncBlockStore}
			resourceId={resourceId}
			intl={intl}
			isSource={isSource}
			localId={localId}
			api={api}
			floatingToolbarRenderContext={floatingToolbarRenderContext}
		/>
	);
};

const EditorPositionedSyncedLocationDropdown = ({
	syncBlockStore,
	resourceId,
	intl,
	isSource,
	localId,
	api,
	floatingToolbarRenderContext,
}: Props): JSX.Element => {
	const triggerTitle = intl.formatMessage(messages.syncedLocationDropdownTitle);
	const [isOpen, setIsOpen] = useState(false);

	const content = isOpen ? (
		<DropdownContent
			syncBlockStore={syncBlockStore}
			resourceId={resourceId}
			intl={intl}
			isSource={isSource}
			localId={localId}
			api={api}
		/>
	) : null;

	const toggleOpen = useCallback(() => {
		setIsOpen((currentIsOpen) => !currentIsOpen);
	}, []);

	const closeDropdown = useCallback(() => {
		setIsOpen(false);
	}, []);

	const setDisableParentScroll = floatingToolbarRenderContext?.setDisableParentScroll;

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		setDisableParentScroll?.(true);

		return () => {
			setDisableParentScroll?.(false);
		};
	}, [isOpen, setDisableParentScroll]);

	const trigger = useMemo(
		() => (
			<Button
				areAnyNewToolbarFlagsEnabled={true}
				testId={SYNCED_BLOCK_BUTTON_TEST_ID.syncedBlockToolbarSyncedLocationsTrigger}
				selected={isOpen}
				iconAfter={
					<ChevronDownIcon color="currentColor" spacing="spacious" label="" size="small" />
				}
				onClick={toggleOpen}
				ariaHasPopup
			>
				{triggerTitle}
			</Button>
		),
		[isOpen, toggleOpen, triggerTitle],
	);

	return (
		<DropdownContainer
			testId={SYNCED_LOCATIONS_DROPDOWN_TEST_ID}
			isOpen={isOpen}
			trigger={trigger}
			handleClickOutside={closeDropdown}
			handleEscapeKeydown={closeDropdown}
			mountTo={floatingToolbarRenderContext?.popupsMountPoint}
			boundariesElement={floatingToolbarRenderContext?.popupsBoundariesElement}
			scrollableElement={floatingToolbarRenderContext?.popupsScrollableElement}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			arrowKeyNavigationProviderOptions={{ type: ArrowKeyNavigationType.MENU }}
		>
			{content}
		</DropdownContainer>
	);
};

export const SyncedLocationDropdownWithCount = ({
	syncBlockStore,
	resourceId,
	intl,
	isSource,
	localId,
	api,
	floatingToolbarRenderContext,
}: Props): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const { fetchStatus, locations } = useReferenceData({
		intl,
		isSource,
		localId,
		resourceId,
		syncBlockStore,
	});
	const referenceCount = useMemo(() => {
		switch (locations.kind) {
			case 'control':
				return locations.references.filter(({ isSource: isSourceItem }) => !isSourceItem).length;
			case 'field-aware':
				return locations.items.filter(({ reference }) => !reference.isSource).length;
		}
	}, [locations]);
	const tooltipContent =
		!isOpen && fetchStatus === 'success' && referenceCount === 0
			? intl.formatMessage(messages.syncedLocationDropdownNoReferencesTooltip)
			: null;
	const content = isOpen ? (
		<DropdownContentWithReferenceData
			resourceId={resourceId}
			intl={intl}
			api={api}
			fetchStatus={fetchStatus}
			locations={locations}
		/>
	) : null;

	const toggleOpen = useCallback(() => {
		setIsOpen((currentIsOpen) => !currentIsOpen);
	}, []);

	const closeDropdown = useCallback(() => {
		setIsOpen(false);
	}, []);

	const setDisableParentScroll = floatingToolbarRenderContext?.setDisableParentScroll;

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		setDisableParentScroll?.(true);

		return () => {
			setDisableParentScroll?.(false);
		};
	}, [isOpen, setDisableParentScroll]);

	const trigger = useMemo(
		() => (
			<Button
				areAnyNewToolbarFlagsEnabled={true}
				testId={SYNCED_BLOCK_BUTTON_TEST_ID.syncedBlockToolbarSyncedLocationsTrigger}
				selected={isOpen}
				iconAfter={
					<ChevronDownIcon color="currentColor" spacing="spacious" label="" size="small" />
				}
				onClick={toggleOpen}
				ariaHasPopup
				tooltipContent={tooltipContent ?? undefined}
			>
				<SyncedLocationTriggerContent
					intl={intl}
					fetchStatus={fetchStatus}
					referenceCount={referenceCount}
				/>
			</Button>
		),
		[fetchStatus, intl, isOpen, referenceCount, toggleOpen, tooltipContent],
	);

	return (
		<DropdownContainer
			alignDropdownWithParentElement
			alignX="left"
			testId={SYNCED_LOCATIONS_DROPDOWN_TEST_ID}
			isOpen={isOpen}
			trigger={trigger}
			handleClickOutside={closeDropdown}
			handleEscapeKeydown={closeDropdown}
			mountTo={floatingToolbarRenderContext?.popupsMountPoint}
			boundariesElement={floatingToolbarRenderContext?.popupsBoundariesElement}
			scrollableElement={floatingToolbarRenderContext?.popupsScrollableElement}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			arrowKeyNavigationProviderOptions={{ type: ArrowKeyNavigationType.MENU }}
		>
			{content}
		</DropdownContainer>
	);
};

type SourceInfoMap = Map<string, SyncBlockSourceInfo[]>;

const DropdownContent = ({ syncBlockStore, resourceId, intl, isSource, localId, api }: Props) => {
	const [fetchStatus, setFetchStatus] = useState<FetchStatus>('none');
	const [locations, setLocations] = useState<SyncedLocations>(EMPTY_LOCATIONS);

	useEffect(() => {
		setFetchStatus('loading');

		const getReferenceData = async () => {
			const response = await syncBlockStore.fetchReferencesSourceInfo(
				resourceId,
				localId,
				isSource,
			);

			if (response.error) {
				setFetchStatus('error');
				return;
			}
			setLocations(toSyncedLocations(response.references, intl));
			setFetchStatus('success');
		};
		void getReferenceData();
	}, [syncBlockStore, intl, isSource, localId, resourceId]);

	return (
		<DropdownContentWithReferenceData
			resourceId={resourceId}
			intl={intl}
			api={api}
			fetchStatus={fetchStatus}
			locations={locations}
		/>
	);
};

const useReferenceData = ({
	syncBlockStore,
	resourceId,
	intl,
	isSource,
	localId,
}: Pick<
	Props,
	'syncBlockStore' | 'resourceId' | 'intl' | 'isSource' | 'localId'
>): ReferenceDataState => {
	const [isNewSourceBlock] = useState(
		() => isSource && syncBlockStore.sourceManager.isNewSourceBlock(resourceId),
	);
	const [state, setState] = useState<{
		fetchStatus: FetchStatus;
		locations: SyncedLocations;
	}>(() => ({
		fetchStatus: isNewSourceBlock ? 'success' : 'loading',
		locations: EMPTY_LOCATIONS,
	}));

	useEffect(() => {
		let isCurrentRequest = true;
		setState({
			fetchStatus: isNewSourceBlock ? 'success' : 'loading',
			locations: EMPTY_LOCATIONS,
		});

		const getReferenceData = async () => {
			const response = await syncBlockStore.fetchReferencesSourceInfo(
				resourceId,
				localId,
				isSource,
			);

			if (!isCurrentRequest) {
				return;
			}

			if (isNewSourceBlock) {
				syncBlockStore.sourceManager.clearNewSourceBlock(resourceId);
			}
			if (response.error) {
				setState({ fetchStatus: 'error', locations: EMPTY_LOCATIONS });
				return;
			}
			setState({
				fetchStatus: 'success',
				locations: toSyncedLocations(response.references, intl),
			});
		};

		void getReferenceData();

		return () => {
			isCurrentRequest = false;
		};
	}, [syncBlockStore, resourceId, intl, isSource, localId, isNewSourceBlock]);

	return {
		fetchStatus: state.fetchStatus,
		locations: state.locations,
	};
};

const SyncedLocationTriggerContent = ({
	intl,
	fetchStatus,
	referenceCount,
}: Pick<ReferenceDataState, 'fetchStatus'> & { intl: IntlShape; referenceCount: number }) => {
	const { formatMessage } = intl;
	const triggerTitle = formatMessage(messages.syncedLocationDropdownTitle);
	const syncedLocationCount = referenceCount === 0 ? 0 : referenceCount + 1;

	switch (fetchStatus) {
		case 'loading':
			return (
				<Inline alignBlock="center" space="space.050">
					{triggerTitle}
					<Spinner size="small" label={formatMessage(messages.syncedLocationDropdownLoading)} />
				</Inline>
			);
		case 'success': {
			const count = syncedLocationCount > 99 ? '99+' : intl.formatNumber(syncedLocationCount);

			return formatMessage(messages.syncedLocationDropdownTitleWithCount, { count });
		}
		case 'none':
		case 'error':
			return triggerTitle;
	}
};

type DropdownContentProps = Pick<Props, 'resourceId' | 'intl' | 'api'> &
	Pick<ReferenceDataState, 'fetchStatus' | 'locations'>;

const DropdownContentWithReferenceData = ({
	resourceId,
	intl,
	api,
	fetchStatus,
	locations,
}: DropdownContentProps) => {
	const { formatMessage } = intl;
	const locationCount = countLocations(locations);

	const handleLocationClick = () => {
		api?.analytics?.actions?.fireAnalyticsEvent({
			eventType: EVENT_TYPE.OPERATIONAL,
			action: ACTION.CLICKED,
			actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
			actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_CLICK_SYNCED_LOCATION,
			attributes: {
				resourceId,
			},
		});
	};

	const content = () => {
		switch (fetchStatus) {
			case 'loading':
				return <LoadingScreen formatMessage={formatMessage} />;
			case 'error':
				return <ErrorScreen formatMessage={formatMessage} />;
			case 'success':
				if (locationCount > 0) {
					return (
						<div
							css={[styles.contentContainer, headingStyles]}
							data-testid="synced-locations-dropdown-content"
						>
							<DropdownItemGroup
								title={formatMessage(messages.syncedLocationDropdownHeading, {
									count: `${locationCount > 99 ? '99+' : locationCount}`,
								})}
							>
								{locations.kind === 'field-aware' ? (
									<FieldAwareLocationRows
										items={locations.items}
										intl={intl}
										handleLocationClick={handleLocationClick}
									/>
								) : (
									<ControlLocationRows
										referenceData={locations.references}
										intl={intl}
										handleLocationClick={handleLocationClick}
									/>
								)}
							</DropdownItemGroup>
						</div>
					);
				} else {
					return <NoResultScreen formatMessage={formatMessage} />;
				}
		}
	};

	return (
		<Box
			xcss={cx(
				styles.dropdownContent,
				// Read off the discriminant rather than the experiment, so the control cohort
				// cannot reach this width and no second exposure is fired for a style.
				locations.kind === 'field-aware' && styles.fieldAwareDropdownContent,
				expValEqualsNoExposure('platform_editor_sync_block_activation', 'isEnabled', true) &&
					fetchStatus === 'success' &&
					locationCount === 0 &&
					styles.activationDropdownContent,
				shouldApplyMinHeight(fetchStatus, locationCount) && styles.containerWithMinHeight,
			)}
		>
			{content()}
		</Box>
	);
};

type LocationRowsProps = {
	handleLocationClick: () => void;
	intl: IntlShape;
};

// The pre-experiment rows. This block is master's, moved into a component; remove with the experiment.
const ControlLocationRows = ({
	referenceData,
	intl,
	handleLocationClick,
}: LocationRowsProps & { referenceData: SyncBlockSourceInfo[] }) => {
	const { formatMessage } = intl;

	return (
		<Fragment>
			{referenceData.map((reference) => {
				const title =
					reference.title === '' && reference.hasAccess
						? formatMessage(messages.syncedLocationDropdownUntitledPage)
						: reference.title || reference.url || '';

				return (
					<div key={reference.title} css={dropdownItemStyles}>
						<Tooltip content={title}>
							<DropdownItem
								elemBefore={<ItemIcon reference={reference} intl={intl} />}
								href={reference.url}
								target="_blank"
								key={reference.title}
								rel="noopener noreferrer"
								// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
								onClick={() => handleLocationClick()}
							>
								<ItemTitle
									title={title}
									formatMessage={formatMessage}
									onSameDocument={reference.onSameDocument}
									isSource={reference.isSource}
									hasAccess={reference.hasAccess}
									productType={reference.productType}
								/>
							</DropdownItem>
						</Tooltip>
					</div>
				);
			})}
		</Fragment>
	);
};

const FieldAwareItemTitle = ({
	item: { baseTitle, fieldName, note, reference },
	formatMessage,
}: {
	formatMessage: IntlShape['formatMessage'];
	item: SyncedLocationItem;
}) => {
	const titleLine = (
		<Inline>
			<Box as="span" xcss={styles.title}>
				{baseTitle}
			</Box>
			{note && (
				<Box as="span" xcss={styles.note}>
					&nbsp;- {note}
				</Box>
			)}
			{reference.isSource && (
				<Box as="span" xcss={styles.lozenge}>
					<Lozenge>{formatMessage(messages.syncedLocationDropdownSourceLozenge)}</Lozenge>
				</Box>
			)}
			{!reference.hasAccess && (
				<Box as="span" xcss={styles.requestAccess}>
					{formatMessage(messages.syncedLocationDropdownRequestAccess)}
				</Box>
			)}
		</Inline>
	);

	if (fieldName === undefined) {
		return titleLine;
	}

	// AGG localises the field name, so it is shown as given rather than wrapped in a message.
	return (
		<Stack>
			{titleLine}
			<Box as="span" xcss={styles.fieldSecondLine}>
				<Text size="small" color="color.text.subtlest">
					{fieldName}
				</Text>
			</Box>
		</Stack>
	);
};

const FieldAwareLocationRows = ({
	items,
	intl,
	handleLocationClick,
}: LocationRowsProps & { items: SyncedLocationItem[] }) => {
	const { formatMessage } = intl;

	return (
		<Fragment>
			{items.map((item) => (
				<div key={item.key} css={dropdownItemStyles}>
					<Tooltip
						content={
							item.fieldName ? (
								// Two lines in the tooltip's own text flow. Wrapping them in `Text` would
								// default to `font.body` and override the container's `font.body.small`,
								// so the field-aware tooltip would not match every other one.
								<Fragment>
									{item.baseTitle}
									<br />
									{formatMessage(messages.syncedLocationDropdownTooltipFieldName, {
										fieldName: item.fieldName,
									})}
								</Fragment>
							) : (
								item.baseTitle
							)
						}
					>
						<DropdownItem
							elemBefore={<ItemIcon reference={item.reference} intl={intl} />}
							href={item.reference.url}
							target="_blank"
							rel="noopener noreferrer"
							// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
							onClick={() => handleLocationClick()}
						>
							<FieldAwareItemTitle item={item} formatMessage={formatMessage} />
						</DropdownItem>
					</Tooltip>
				</div>
			))}
		</Fragment>
	);
};

const LoadingScreen = ({ formatMessage }: { formatMessage: IntlShape['formatMessage'] }) => {
	return (
		<Box>
			<Spinner label={formatMessage(messages.syncedLocationDropdownLoading)} />
		</Box>
	);
};

const ErrorScreen = ({ formatMessage }: { formatMessage: IntlShape['formatMessage'] }) => {
	return (
		<Box xcss={styles.errorContainer} testId="synced-locations-dropdown-content-error">
			<Box xcss={styles.errorIcon}>
				<StatusErrorIcon
					color={token('color.icon.danger')}
					spacing="spacious"
					label=""
					size="small"
				/>
			</Box>
			<Text as="p" size="medium">
				{formatMessage(messages.syncedLocationDropdownError)}
			</Text>
		</Box>
	);
};

const NoResultScreen = ({ formatMessage }: { formatMessage: IntlShape['formatMessage'] }) => {
	return expValEquals('platform_editor_sync_block_activation', 'isEnabled', true) ? (
		<Box
			xcss={styles.activationNoResultsContainer}
			testId="synced-locations-dropdown-content-no-results"
		>
			<Stack alignInline="center" xcss={styles.activationNoResultsContent} space="space.150">
				<SyncedLocationsEmptyStateIllustration />
				<Text as="p">{formatMessage(messages.syncedLocationDropdownActivationNoResults)}</Text>
				<Text as="p">
					<Anchor
						href={SYNCED_BLOCKS_DOCUMENTATION_URL}
						target="_blank"
						rel="noopener noreferrer"
						xcss={styles.learnMoreLink}
					>
						{formatMessage(messages.syncedLocationDropdownLearnMoreLink)}
					</Anchor>
				</Text>
			</Stack>
		</Box>
	) : (
		<Stack
			xcss={styles.noResultsContainer}
			space="space.100"
			testId="synced-locations-dropdown-content-no-results"
		>
			<Text as="p">{formatMessage(messages.syncedLocationDropdownNoResults)}</Text>
			<Text as="p">
				<Anchor
					href={SYNCED_BLOCKS_DOCUMENTATION_URL}
					target="_blank"
					rel="noopener noreferrer"
					xcss={styles.learnMoreLink}
				>
					{formatMessage(messages.syncedLocationDropdownLearnMoreLink)}
				</Anchor>
			</Text>
		</Stack>
	);
};
