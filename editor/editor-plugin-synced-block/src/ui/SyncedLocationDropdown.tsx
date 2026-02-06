/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState, useEffect } from 'react';

import { css, jsx, cssMap, keyframes, cx } from '@compiled/react';
import { type IntlShape } from 'react-intl-next';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { FloatingToolbarButton as Button } from '@atlaskit/editor-common/ui';
import type {
	SyncBlockSourceInfo,
	SyncBlockStoreManager,
	ReferencesSourceInfo,
	SyncBlockProduct,
} from '@atlaskit/editor-synced-block-provider';
import { IconTile } from '@atlaskit/icon';
import PageLiveDocIcon from '@atlaskit/icon-lab/core/page-live-doc';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import PageIcon from '@atlaskit/icon/core/page';
import QuotationMarkIcon from '@atlaskit/icon/core/quotation-mark';
import StatusErrorIcon from '@atlaskit/icon/core/status-error';
import { ConfluenceIcon, JiraIcon, AtlassianIcon } from '@atlaskit/logo';
import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Text, Inline, Anchor, Stack } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

interface Props {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
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
	blogpost: QuotationMarkIcon,
};

const getConfluenceSubTypeIcon = (subType?: string | null) => {
	return subType && subType in subTypeIconMap
		? subTypeIconMap[subType as keyof typeof subTypeIconMap]
		: PageIcon;
};

const ProductIcon = ({ product }: { product?: SyncBlockProduct }) => {
	const ProductIcon = product ? (productIconMap[product] ?? AtlassianIcon) : AtlassianIcon;

	return (
		<span css={logoTileStyles}>
			<ProductIcon size="xxsmall" appearance="neutral" />
		</span>
	);
};

const ItemIcon = ({ reference }: { reference: SyncBlockSourceInfo }) => {
	const { hasAccess, subType, productType } = reference;

	if (productType === 'confluence-page' && hasAccess) {
		return (
			<IconTile
				icon={getConfluenceSubTypeIcon(subType)}
				label=""
				appearance={'gray'}
				size="xsmall"
			/>
		);
	}

	return <ProductIcon product={productType} />;
};

export const processReferenceData = (
	referenceData: ReferencesSourceInfo['references'],
	intl: IntlShape,
) => {
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
					(reference.title = `${reference.title}: ${formatMessage(
						messages.syncedLocationDropdownTitleBlockIndex,
						{ index: index + 1 },
					)}`),
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

export const SyncedLocationDropdown = ({
	syncBlockStore,
	resourceId,
	intl,
	isSource,
	localId,
	api,
}: Props): JSX.Element => {
	const { formatMessage } = intl;
	const triggerTitle = formatMessage(messages.syncedLocationDropdownTitle);
	const [isOpen, setIsOpen] = useState(false);

	return (
		<DropdownMenu
			isOpen={isOpen}
			onOpenChange={({ isOpen }) => setIsOpen(isOpen)}
			testId={
				fg('platform_synced_block_patch_1') ? 'synced-block-synced-locations-dropdown' : undefined
			}
			trigger={({ triggerRef, ...triggerProps }) => (
				<Button
					ref={triggerRef}
					areAnyNewToolbarFlagsEnabled={true}
					selected={fg('platform_synced_block_patch_1') ? isOpen : undefined}
					iconAfter={
						<ChevronDownIcon color="currentColor" spacing="spacious" label="" size="small" />
					}
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...triggerProps}
				>
					{triggerTitle}
				</Button>
			)}
		>
			{isOpen && (
				<DropdownContent
					syncBlockStore={syncBlockStore}
					resourceId={resourceId}
					intl={intl}
					isSource={isSource}
					localId={localId}
					api={api}
				/>
			)}
		</DropdownMenu>
	);
};

type SourceInfoMap = Map<string, SyncBlockSourceInfo[]>;

const DropdownContent = ({ syncBlockStore, resourceId, intl, isSource, localId, api }: Props) => {
	const { formatMessage } = intl;
	const [fetchStatus, setFetchStatus] = useState<FetchStatus>('none');
	const [referenceData, setReferenceData] = useState<SyncBlockSourceInfo[]>([]);

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
			setReferenceData(processReferenceData(response.references, intl));
			setFetchStatus('success');
		};
		getReferenceData();
	}, [syncBlockStore, intl, isSource, localId, resourceId]);

	const handleLocationClick = () => {
		if (fg('platform_synced_block_patch_1')) {
			api?.analytics?.actions?.fireAnalyticsEvent({
				eventType: EVENT_TYPE.OPERATIONAL,
				action: ACTION.CLICKED,
				actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
				actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_CLICK_SYNCED_LOCATION,
				attributes: {
					resourceId,
				},
			});
		}
	};

	const content = () => {
		switch (fetchStatus) {
			case 'loading':
				return <LoadingScreen />;
			case 'error':
				return <ErrorScreen formatMessage={formatMessage} />;
			case 'success':
				if (referenceData.length > 0) {
					return (
						<div
							css={[styles.contentContainer, headingStyles]}
							data-testid="synced-locations-dropdown-content"
						>
							<DropdownItemGroup
								title={formatMessage(messages.syncedLocationDropdownHeading, {
									count: `${referenceData.length > 99 ? '99+' : referenceData.length}`,
								})}
							>
								{referenceData.map((reference) => (
									<div key={reference.title} css={dropdownItemStyles}>
										<Tooltip content={reference.title || reference.url || ''}>
											<DropdownItem
												elemBefore={<ItemIcon reference={reference} />}
												href={reference.url}
												target="_blank"
												key={reference.title}
												onClick={() => handleLocationClick()}
											>
												<ItemTitle
													title={reference.title || reference.url || ''}
													formatMessage={formatMessage}
													onSameDocument={reference.onSameDocument}
													isSource={reference.isSource}
													hasAccess={reference.hasAccess}
													productType={reference.productType}
												/>
											</DropdownItem>
										</Tooltip>
									</div>
								))}
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
				shouldApplyMinHeight(fetchStatus, referenceData.length) && styles.containerWithMinHeight,
			)}
		>
			{content()}
		</Box>
	);
};

const LoadingScreen = () => {
	return (
		<Box>
			<Spinner></Spinner>
		</Box>
	);
};

const ErrorScreen = ({ formatMessage }: { formatMessage: IntlShape['formatMessage'] }) => {
	return (
		<Box
			xcss={styles.errorContainer}
			testId={
				fg('platform_synced_block_patch_1') ? 'synced-locations-dropdown-content-error' : undefined
			}
		>
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
	return (
		<Stack
			xcss={styles.noResultsContainer}
			space="space.100"
			testId={
				fg('platform_synced_block_patch_1')
					? 'synced-locations-dropdown-content-no-results'
					: undefined
			}
		>
			<Text as="p">{formatMessage(messages.syncedLocationDropdownNoResults)}</Text>
			<Text as="p">
				<Anchor
					href="https://hello.atlassian.net/wiki/x/tAtCeAE"
					target="_blank"
					xcss={styles.learnMoreLink}
				>
					{formatMessage(messages.syncedLocationDropdownLearnMoreLink)}
				</Anchor>
			</Text>
		</Stack>
	);
};
