import React from 'react';

import { useIntl } from 'react-intl';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
import type { IsRecommendedItem } from '@atlaskit/editor-common/quick-insert/is-recommended-item';
import {
	BLOCK_TEMPLATES_SECTION,
	CREATE_SECTION,
	DATA_AND_CHARTS_SECTION,
	EMBED_SECTION,
	MEDIA_SECTION,
	MENU,
	OTHER_SECTION,
	RECOMMENDED_SECTION,
	ROVO_SECTION,
	STRUCTURE_SECTION,
	TEXT_FORMATTING_SECTION,
	VIEW_ALL_ELEMENTS_MENU_ITEM,
} from '@atlaskit/editor-common/quick-insert/keys';
import { messages } from '@atlaskit/editor-common/quick-insert/messages';
import {
	CATEGORY_VIEW_MORE_RANK,
	QUICK_INSERT_MENU_RANK,
} from '@atlaskit/editor-common/quick-insert/rank';
import type { RegisteredItemRankResolver } from '@atlaskit/editor-common/registered-menu/item-rank';
import { getMenuFooterSectionKey } from '@atlaskit/editor-common/type-ahead-get-menu-footer-section-key';
import { getSectionOverflowItemKey } from '@atlaskit/editor-common/type-ahead-get-section-overflow-item-key';
import type { EmptyStateHandler } from '@atlaskit/editor-common/types/empty-state-handler';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { IsHiddenOptions, RegisterComponent } from '@atlaskit/editor-ui-control-model/types';

import type { QuickInsertPlugin } from '../quickInsertPluginType';
import {
	createRecommendedSnapshotCache,
	MAX_RECOMMENDED_ITEMS,
	RECOMMENDED_SLOT_KEY_PREFIX,
} from './getRecommendedComponents';
import { QuickInsertMenuFooterItem } from './QuickInsertMenuFooterItem';
import { QuickInsertRecommendedSlot } from './QuickInsertRecommendedSlot';
import { QuickInsertSectionOverflowMenuItem } from './QuickInsertSectionOverflowMenuItem';
import QuickInsertMenuRoot from './registered-menu/QuickInsertMenuRoot';
import { QuickInsertMenuSection } from './registered-menu/QuickInsertMenuSection';

const categories = [
	{ message: messages.categoryRecommended, section: RECOMMENDED_SECTION },
	{ message: messages.categoryStructure, section: STRUCTURE_SECTION },
	{ message: messages.categoryMedia, section: MEDIA_SECTION },
	{ message: messages.categoryCreate, section: CREATE_SECTION },
	{ message: messages.categoryEmbed, section: EMBED_SECTION },
	{ message: messages.categoryTextFormatting, section: TEXT_FORMATTING_SECTION },
	{ message: messages.categoryRovo, section: ROVO_SECTION },
	{ message: messages.categoryDataAndCharts, section: DATA_AND_CHARTS_SECTION },
	{ message: messages.categoryBlockTemplates, section: BLOCK_TEMPLATES_SECTION },
	{ message: messages.categoryOther, section: OTHER_SECTION },
] as const;

const createSectionComponent = (message: (typeof categories)[number]['message']) => {
	const SectionComponent = ({ children }: React.PropsWithChildren): React.JSX.Element => {
		const { formatMessage } = useIntl();

		return (
			<QuickInsertMenuSection title={formatMessage(message)}>{children}</QuickInsertMenuSection>
		);
	};

	return SectionComponent;
};

type Params = {
	api: ExtractInjectionAPI<QuickInsertPlugin> | undefined;
	emptyStateHandler?: EmptyStateHandler;
	fireAnalyticsEvent?: EditorAnalyticsAPI['fireAnalyticsEvent'];
	getItemRank?: RegisteredItemRankResolver;
	includeElementBrowserItems: boolean;
	isRecommendedItem?: IsRecommendedItem;
	maxRecommendedItems?: number;
};

export const getQuickInsertComponents = ({
	api,
	includeElementBrowserItems,
	isRecommendedItem,
	maxRecommendedItems,
	getItemRank,
	emptyStateHandler,
	fireAnalyticsEvent,
}: Params): RegisterComponent[] => {
	const recommendedSnapshot = createRecommendedSnapshotCache({
		api,
		isRecommendedItem,
		maxRecommendedItems,
	});
	const recommendedSlots: RegisterComponent[] = Array.from(
		{ length: MAX_RECOMMENDED_ITEMS },
		(_, index) => ({
			key: `${RECOMMENDED_SLOT_KEY_PREFIX}${index}`,
			type: 'menu-item',
			parents: [{ key: RECOMMENDED_SECTION.key, type: RECOMMENDED_SECTION.type, rank: index }],
			match: () => null,
			isHidden: ({ surfaceContext } = {}) =>
				!recommendedSnapshot.getSnapshot(surfaceContext)[index],
			component: ({ children, parents, surfaceContext }) => (
				<QuickInsertRecommendedSlot
					parents={parents}
					surfaceContext={surfaceContext}
					index={index}
					getSnapshot={recommendedSnapshot.getSnapshot}
				>
					{children}
				</QuickInsertRecommendedSlot>
			),
		}),
	);

	return [
		{
			key: MENU.key,
			type: MENU.type,
			component: ({ children }) => (
				<QuickInsertMenuRoot
					getItemRank={getItemRank}
					emptyStateHandler={emptyStateHandler}
					fireAnalyticsEvent={fireAnalyticsEvent}
				>
					{children}
				</QuickInsertMenuRoot>
			),
		},
		...recommendedSlots,
		...categories.flatMap(({ message, section }) => [
			{
				key: section.key,
				type: section.type,
				parents: [
					{
						key: MENU.key,
						type: MENU.type,
						rank: QUICK_INSERT_MENU_RANK[section.key],
					},
				],
				component: createSectionComponent(message),
				isHidden:
					section.key === RECOMMENDED_SECTION.key
						? ({ surfaceContext }: IsHiddenOptions = {}) =>
								recommendedSnapshot.getSnapshot(surfaceContext).length === 0
						: undefined,
			},
			...(includeElementBrowserItems && section.key !== RECOMMENDED_SECTION.key
				? [
						{
							key: getSectionOverflowItemKey(section.key),
							type: 'menu-item' as const,
							parents: [
								{
									key: section.key,
									type: section.type,
									rank: CATEGORY_VIEW_MORE_RANK,
								},
							],
							component: () => (
								<QuickInsertSectionOverflowMenuItem api={api} category={section.key} />
							),
						},
					]
				: []),
		]),
		...(includeElementBrowserItems
			? [
					{
						key: getMenuFooterSectionKey(MENU.key),
						type: 'menu-section' as const,
						parents: [
							{
								key: MENU.key,
								type: MENU.type,
								rank: Number.MAX_SAFE_INTEGER,
							},
						],
					},
					{
						key: VIEW_ALL_ELEMENTS_MENU_ITEM.key,
						type: VIEW_ALL_ELEMENTS_MENU_ITEM.type,
						parents: [
							{
								key: getMenuFooterSectionKey(MENU.key),
								type: 'menu-section' as const,
								rank: 100,
							},
						],
						component: () => <QuickInsertMenuFooterItem api={api} />,
					},
				]
			: []),
	];
};
