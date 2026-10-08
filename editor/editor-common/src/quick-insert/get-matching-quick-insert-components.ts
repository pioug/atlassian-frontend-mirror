import type { IntlShape } from 'react-intl';

import {
	getComponentIdentity,
	resolveSurface,
	willComponentRender,
} from '@atlaskit/editor-ui-control-model/surface-renderer';
import type { SurfaceIdentifier } from '@atlaskit/editor-ui-control-model/surface-renderer/types';
import type {
	RegisterComponent,
	RegisterMenuItem,
	RegisterMenuSection,
	SurfaceContext,
} from '@atlaskit/editor-ui-control-model/types';

import { isMenuFooterSectionKey } from '../type-ahead/isMenuFooterSectionKey';
import { isSectionOverflowItemKey } from '../type-ahead/isSectionOverflowItemKey';
import type { QuickInsertMenuModel, QuickInsertMenuSection } from './build-quick-insert-menu-model';
import { ASK_ROVO_MENU_ITEM } from './keys';

const SEARCH_TOP_MATCH_LIMIT = 5;

type MatchedItem = {
	identity: string;
	item: RegisterMenuItem;
	itemRank: number;
	score: number;
	section: RegisterMenuSection;
	sectionRank: number;
	sourceIndex: number;
};

const getRank = (component: RegisterComponent, parentKey: string): number =>
	component.parents?.find((parent) => parent.key === parentKey)?.rank ?? Number.MAX_SAFE_INTEGER;

const compareMatchedItems = (a: MatchedItem, b: MatchedItem): number =>
	a.sectionRank - b.sectionRank ||
	a.score - b.score ||
	a.itemRank - b.itemRank ||
	a.sourceIndex - b.sourceIndex ||
	a.identity.localeCompare(b.identity);

const compareSearchResults = (a: MatchedItem, b: MatchedItem): number =>
	a.score - b.score ||
	a.sectionRank - b.sectionRank ||
	a.itemRank - b.itemRank ||
	a.sourceIndex - b.sourceIndex ||
	a.identity.localeCompare(b.identity);

const getSearchResults = (matches: MatchedItem[]): RegisterMenuItem[] => {
	const topMatches = Array.from(matches)
		.sort(compareSearchResults)
		.slice(0, SEARCH_TOP_MATCH_LIMIT);
	const topMatchIdentities = new Set(topMatches.map(({ identity }) => identity));
	const tailMatches = matches.filter(({ identity }) => !topMatchIdentities.has(identity));

	return [...topMatches, ...tailMatches].map(({ item }) => item);
};

/**
 * Resolves registered menu items for a non-empty query. This intentionally has
 * no empty-query path so browse behavior remains owned by buildQuickInsertMenuModel.
 */
export const getMatchingQuickInsertComponents = ({
	components,
	rootComponent,
	query,
	formatMessage,
	surfaceContext,
}: {
	components: RegisterComponent[];
	formatMessage: IntlShape['formatMessage'];
	query: string;
	rootComponent: SurfaceIdentifier;
	surfaceContext?: SurfaceContext;
}): QuickInsertMenuModel => {
	const { childrenMap, root, topLevelChildren } = resolveSurface(components, rootComponent);
	if (!root || !willComponentRender(root, childrenMap, surfaceContext) || !topLevelChildren) {
		return { footer: undefined, root: undefined, sections: [] };
	}

	const matches = new Map<string, MatchedItem>();
	const sourceIndexByComponent = new Map(components.map((component, index) => [component, index]));

	for (const section of topLevelChildren) {
		if (
			section.type !== 'menu-section' ||
			isMenuFooterSectionKey(section.key) ||
			!willComponentRender(section, childrenMap, surfaceContext)
		) {
			continue;
		}

		for (const item of childrenMap.get(getComponentIdentity(section)) ?? []) {
			if (
				item.type !== 'menu-item' ||
				isSectionOverflowItemKey(item.key) ||
				!willComponentRender(item, childrenMap, surfaceContext)
			) {
				continue;
			}

			const match = item.match?.({ formatMessage, query });
			if (item.match && match === null) {
				continue;
			}

			const candidate: MatchedItem = {
				identity: `${item.type}:${item.key}`,
				item,
				itemRank: getRank(item, section.key),
				score: Math.min(1, Math.max(0, match?.score ?? 0)),
				sourceIndex: sourceIndexByComponent.get(item) ?? Number.MAX_SAFE_INTEGER,
				section,
				sectionRank: getRank(section, root.key),
			};
			const existing = matches.get(candidate.identity);
			if (!existing || compareMatchedItems(candidate, existing) < 0) {
				matches.set(candidate.identity, candidate);
			}
		}
	}

	const uniqueMatches = Array.from(matches.values()).sort(compareMatchedItems);
	const searchResults = query !== '' ? getSearchResults(uniqueMatches) : undefined;
	const sectionsByKey = new Map<string, QuickInsertMenuSection>();
	for (const match of uniqueMatches) {
		const existing = sectionsByKey.get(match.section.key);
		if (existing) {
			existing.push(match.item);
		} else {
			sectionsByKey.set(match.section.key, [match.section, match.item]);
		}
	}

	const sections = Array.from(sectionsByKey.values());
	// An empty query is browse mode: `buildQuickInsertMenuModel` supplies the footer there,
	// so this search model must not add a second one.
	if (query === '') {
		return {
			footer: undefined,
			root,
			searchResults,
			sections,
		};
	}

	const footerSection = topLevelChildren.find(
		(section) =>
			section.type === 'menu-section' &&
			isMenuFooterSectionKey(section.key) &&
			willComponentRender(section, childrenMap, surfaceContext),
	);
	const footer = footerSection
		? (childrenMap.get(getComponentIdentity(footerSection)) ?? []).find(
				(child): child is RegisterMenuItem =>
					child.type === 'menu-item' && willComponentRender(child, childrenMap, surfaceContext),
			)
		: undefined;

	if (sections.length > 0) {
		return { footer, root, searchResults, sections };
	}

	const fallbackItem = topLevelChildren
		.filter(
			(section): section is RegisterMenuSection =>
				section.type === 'menu-section' &&
				!isMenuFooterSectionKey(section.key) &&
				willComponentRender(section, childrenMap, surfaceContext),
		)
		.flatMap((section) => childrenMap.get(getComponentIdentity(section)) ?? [])
		.find(
			(component): component is RegisterMenuItem =>
				component.type === ASK_ROVO_MENU_ITEM.type &&
				component.key === ASK_ROVO_MENU_ITEM.key &&
				willComponentRender(component, childrenMap, surfaceContext),
		);
	const fallbackItems = fallbackItem ? [fallbackItem] : [];

	return {
		fallbackItems,
		footer,
		root,
		searchResults,
		sections,
	};
};
