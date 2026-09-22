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
import type { QuickInsertCategoryItemSelectionPolicy } from './selectQuickInsertCategoryItems';

export type QuickInsertMenuSection = [RegisterMenuSection, ...RegisterMenuItem[]];

export type QuickInsertMenuModel = {
	fallbackItems?: RegisterMenuItem[];
	footer: RegisterMenuItem | undefined;
	root: RegisterComponent | undefined;
	sections: QuickInsertMenuSection[];
};

export const buildQuickInsertMenuModel = (
	components: RegisterComponent[],
	rootComponent: SurfaceIdentifier,
	selectCategoryItems?: QuickInsertCategoryItemSelectionPolicy,
	surfaceContext?: SurfaceContext,
): QuickInsertMenuModel => {
	const { root, childrenMap, topLevelChildren } = resolveSurface(components, rootComponent);
	if (!root || !willComponentRender(root, childrenMap, surfaceContext)) {
		return { footer: undefined, root: undefined, sections: [] };
	}

	const sections: QuickInsertMenuSection[] = [];
	let footer: RegisterMenuItem | undefined;

	for (const section of topLevelChildren ?? []) {
		if (
			section.type !== 'menu-section' ||
			!willComponentRender(section, childrenMap, surfaceContext)
		) {
			continue;
		}

		const children = childrenMap.get(getComponentIdentity(section)) ?? [];
		if (isMenuFooterSectionKey(section.key)) {
			footer = children.find(
				(child): child is RegisterMenuItem =>
					child.type === 'menu-item' && willComponentRender(child, childrenMap, surfaceContext),
			);
			continue;
		}

		let viewMoreItem: RegisterMenuItem | undefined;
		for (let index = children.length - 1; index >= 0; index--) {
			const child = children[index];
			if (
				child?.type === 'menu-item' &&
				isSectionOverflowItemKey(child.key) &&
				willComponentRender(child, childrenMap, surfaceContext)
			) {
				viewMoreItem = child;
				break;
			}
		}
		const items = children.filter(
			(child): child is RegisterMenuItem =>
				child.type === 'menu-item' &&
				!isSectionOverflowItemKey(child.key) &&
				willComponentRender(child, childrenMap, surfaceContext),
		);

		if (items.length === 0) {
			continue;
		}

		const selectedItems =
			viewMoreItem !== undefined && selectCategoryItems !== undefined
				? selectCategoryItems(items)
				: items;
		if (selectedItems.length < items.length && viewMoreItem !== undefined) {
			sections.push([section, ...selectedItems, viewMoreItem]);
		} else {
			sections.push([section, ...selectedItems]);
		}
	}

	return { footer, root, sections };
};
