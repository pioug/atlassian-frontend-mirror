import React from 'react';

import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import { getQuickInsertMenuItemParents } from '@atlaskit/editor-common/quick-insert/get-menu-item-parents';
import { getQuickInsertProviderMenuItemKey } from '@atlaskit/editor-common/quick-insert/get-provider-menu-item-key';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { useQuickInsertContext } from '@atlaskit/editor-common/quick-insert/use-quick-insert-context';
import type {
	CommonComponentProps,
	RegisterMenuItem,
} from '@atlaskit/editor-ui-control-model/types';
import AppsIcon from '@atlaskit/icon/core/apps';

type LegacyCompatibleComponentProps = CommonComponentProps & {
	onInsert?: () => void;
};

type LegacyCompatibleRegisterMenuItem = Omit<RegisterMenuItem, 'component'> & {
	component?: (props: LegacyCompatibleComponentProps) => React.ReactNode;
};

type Options = {
	directComponents: LegacyCompatibleRegisterMenuItem[];
	itemFilter?: (item: QuickInsertItem) => boolean;
	onInsert: (item: QuickInsertItem) => void;
	providedItems: QuickInsertItem[];
};

const LegacyQuickInsertProviderMenuItem = ({
	item,
	onInsert,
}: {
	item: QuickInsertItem;
	onInsert: (item: QuickInsertItem) => void;
}): React.JSX.Element => {
	const { editorView, isOffline } = useQuickInsertContext();
	const isDisabled = item.isDisabledOffline === true && isOffline;
	const onSelect = ({ insert, source }: OnSelectContext) => {
		const result = item.action(insert, editorView.state, source);
		if (result) {
			onInsert(item);
		}
		return result;
	};
	const Icon = item.icon;

	return (
		<QuickInsertMenuItem
			iconBefore={Icon ? <Icon /> : <AppsIcon label="" />}
			isDisabled={isDisabled}
			onSelect={onSelect}
			shortcut={item.keyshortcut}
			title={item.title}
		/>
	);
};

const getItemIdentity = (item: QuickInsertItem, index: number): string =>
	String(item.key ?? item.id ?? index);

const getComponentsFromLegacyItems = (
	items: QuickInsertItem[],
	onInsert: (item: QuickInsertItem) => void,
): RegisterMenuItem[] =>
	items.map((item, index) => {
		const identity = getItemIdentity(item, index);
		return {
			type: 'menu-item',
			key: getQuickInsertProviderMenuItemKey(identity, item.app),
			parents: getQuickInsertMenuItemParents({
				category: item.category,
				legacyCategories: item.categories,
				rank: item.priority ?? index,
			}),
			component: () => <LegacyQuickInsertProviderMenuItem item={item} onInsert={onInsert} />,
			match: createQuickInsertMatcher(() => ({
				description: item.description,
				keywords: item.keywords,
				shortcut: item.keyshortcut,
				title: item.title,
			})),
		};
	});

export const getLegacyCompatibleComponents = ({
	directComponents,
	itemFilter,
	onInsert,
	providedItems,
}: Options): RegisterMenuItem[] => {
	const filteredItems = itemFilter ? providedItems.filter(itemFilter) : providedItems;
	const allowedKeys = new Set(filteredItems.map((item, index) => getItemIdentity(item, index)));
	const directComponentsWithRenderer = directComponents.filter(
		(
			component,
		): component is LegacyCompatibleRegisterMenuItem & {
			component: NonNullable<LegacyCompatibleRegisterMenuItem['component']>;
		} => typeof component.component === 'function',
	);
	const namespacedDirectComponents = directComponentsWithRenderer
		.filter((component) => !itemFilter || allowedKeys.has(component.key))
		.map((component) => {
			const item = filteredItems.find(
				(candidate, index) => getItemIdentity(candidate, index) === component.key,
			);
			return {
				...component,
				key: getQuickInsertProviderMenuItemKey(component.key, item?.app),
				component: item
					? (props: CommonComponentProps) =>
							component.component({
								...props,
								onInsert: () => onInsert(item),
							})
					: component.component,
				match:
					component.match ??
					(item
						? createQuickInsertMatcher(() => ({
								description: item.description,
								keywords: item.keywords,
								shortcut: item.keyshortcut,
								title: item.title,
							}))
						: undefined),
			};
		});
	const directComponentKeys = new Set(
		directComponentsWithRenderer.map((component) => component.key),
	);
	const fallbackComponents = getComponentsFromLegacyItems(
		filteredItems.filter((item, index) => !directComponentKeys.has(getItemIdentity(item, index))),
		onInsert,
	);

	return [...fallbackComponents, ...namespacedDirectComponents];
};
