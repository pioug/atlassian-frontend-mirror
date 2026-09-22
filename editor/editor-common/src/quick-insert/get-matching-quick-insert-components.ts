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

type MatchedItem = {
	identity: string;
	item: RegisterMenuItem;
	itemRank: number;
	score: number;
	section: RegisterMenuSection;
	sectionRank: number;
};

const getRank = (component: RegisterComponent, parentKey: string): number =>
	component.parents?.find((parent) => parent.key === parentKey)?.rank ?? Number.MAX_SAFE_INTEGER;

const compareMatchedItems = (a: MatchedItem, b: MatchedItem): number =>
	a.score - b.score ||
	a.sectionRank - b.sectionRank ||
	a.itemRank - b.itemRank ||
	a.identity.localeCompare(b.identity);

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
				section,
				sectionRank: getRank(section, root.key),
			};
			const existing = matches.get(candidate.identity);
			if (!existing || compareMatchedItems(candidate, existing) < 0) {
				matches.set(candidate.identity, candidate);
			}
		}
	}

	const sectionsByKey = new Map<string, QuickInsertMenuSection>();
	for (const match of Array.from(matches.values()).sort(compareMatchedItems)) {
		const existing = sectionsByKey.get(match.section.key);
		if (existing) {
			existing.push(match.item);
		} else {
			sectionsByKey.set(match.section.key, [match.section, match.item]);
		}
	}

	const sections = Array.from(sectionsByKey.values());
	if (sections.length > 0 || query === '') {
		return { footer: undefined, root, sections };
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

	return { fallbackItems, footer, root, sections };
};
