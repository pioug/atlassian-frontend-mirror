/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ComponentClass, HTMLAttributes, ReactElement } from 'react';
import { useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';

/* eslint-disable @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports, jsdoc/require-description -- Ignored via go/DSP-18766; jsdoc debt surfaced by this mechanical PR */
import { css, jsx } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';
import { CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import {
	IconCode,
	IconDate,
	IconDecision,
	IconDivider,
	IconExpand,
	IconPanel,
	IconQuote,
	IconStatus,
} from '@atlaskit/editor-common/assets';
import { isOfflineMode } from '@atlaskit/editor-common/connectivity/isOfflineMode';
import { ELEMENT_ITEM_HEIGHT } from '@atlaskit/editor-common/element-browser/constants';
import ElementBrowser from '@atlaskit/editor-common/element-browser/ElementBrowserLoader';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory/quick-insert-provider';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu/DropdownMenu/types';
import { OutsideClickTargetRefContext } from '@atlaskit/editor-common/ui-react';
import withOuterListeners from '@atlaskit/editor-common/ui-react/with-react-editor-view-outer-listeners';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import type { NamedPluginStatesFromInjectionAPI } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import { token } from '@atlaskit/tokens';

import type { insertBlockPlugin } from '../../insertBlockPlugin';
import type { InsertMenuProps, SvgGetterParams } from './types';

export const DEFAULT_HEIGHT = 560;

/**
 * Sort featured elements by priority, matching the quick insert menu.
 */
export const sortFeaturedItems = (featuredItems: QuickInsertItem[]): QuickInsertItem[] => {
	return featuredItems
		.slice(0)
		.sort(
			(a, b) => (a.priority ?? Number.POSITIVE_INFINITY) - (b.priority ?? Number.POSITIVE_INFINITY),
		);
};

const selector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<typeof insertBlockPlugin>,
		'connectivity'
	>,
) => {
	return {
		connectivityMode: states.connectivityState?.mode,
	};
};

const InsertMenu = ({
	editorView,
	dropdownItems,
	showElementBrowserLink,
	onInsert,
	toggleVisiblity,
	pluginInjectionApi,
}: InsertMenuProps): jsx.JSX.Element => {
	const [itemCount, setItemCount] = useState(0);
	const [height, setHeight] = useState(DEFAULT_HEIGHT);

	const cache = useMemo(() => {
		return new CellMeasurerCache({
			fixedWidth: true,
			defaultHeight: ELEMENT_ITEM_HEIGHT,
			minHeight: ELEMENT_ITEM_HEIGHT,
		});
	}, []);

	useLayoutEffect(() => {
		// Figure based on visuals to exclude the searchbar, padding/margin, and the ViewMore item.
		const EXTRA_SPACE_EXCLUDING_ELEMENTLIST = 128;
		const totalItemHeight =
			// eslint-disable-next-line @atlassian/perf-linting/no-expensive-computations-in-render -- Ignored via go/ees017 (to be fixed)
			[...Array(itemCount)].reduce((sum, _, index) => sum + cache.rowHeight({ index }), 0) +
			EXTRA_SPACE_EXCLUDING_ELEMENTLIST;

		if (itemCount > 0 && totalItemHeight < DEFAULT_HEIGHT) {
			setHeight(totalItemHeight);
		} else {
			setHeight(DEFAULT_HEIGHT);
		}
	}, [cache, itemCount]);

	const transform = useCallback(
		(item: MenuItem): QuickInsertItem => ({
			title: item.content as string,
			description: item.tooltipDescription,
			keyshortcut: item.shortcut,
			icon: () =>
				getSvgIconForItem({
					name: item.value.name,
				}) || (item.elemBefore as ReactElement),
			/**
			 * @note This transformed items action is only used when a quick insert item has been
			 * called from the quick insert menu and a search has not been performed.
			 */
			action: () => onInsert({ item }),
			// "insertInsertMenuItem" expects these 2 properties.
			onClick: item.onClick,
			value: item.value,
		}),
		[onInsert],
	);

	const quickInsertDropdownItems = dropdownItems.map(transform);

	const onInsertItem = useCallback(
		(item: QuickInsertItem) => {
			toggleVisiblity();
			if (!editorView.hasFocus()) {
				editorView.focus();
			}
			pluginInjectionApi?.quickInsert?.actions.insertItem(item, INPUT_METHOD.TOOLBAR)(
				editorView.state,
				editorView.dispatch,
			);
		},
		[editorView, toggleVisiblity, pluginInjectionApi],
	);

	const { connectivityMode } = useSharedPluginStateWithSelector(
		pluginInjectionApi,
		['connectivity'],
		selector,
	);

	const getItems = useCallback(
		(query?: string, category?: string) => {
			let result;
			/**
			 * @warning The results if there is a query are not the same as the results if there is no query.
			 * For example: If you have a typed panel and then select the panel item then it will call a different action
			 * than is specified on the editor plugins quick insert
			 * @see above transform function for more details.
			 */
			if (query) {
				result =
					pluginInjectionApi?.quickInsert?.actions
						.getSuggestions({
							query,
							category,
						})
						?.map((item) =>
							isOfflineMode(connectivityMode) && item.isDisabledOffline
								? { ...item, isDisabled: true }
								: item,
						) ?? [];
			} else {
				const featuredQuickInsertSuggestions =
					pluginInjectionApi?.quickInsert?.actions
						.getSuggestions({
							category,
							featuredItems: true,
						})
						?.map((item) =>
							isOfflineMode(connectivityMode) && item.isDisabledOffline
								? { ...item, isDisabled: true }
								: item,
						) ?? [];
				const unfilteredResult = quickInsertDropdownItems.concat(
					featuredQuickInsertSuggestions,
				) as QuickInsertItem[];
				// need to sort on the concatenated list so desired elements are at the top
				result = sortFeaturedItems(unfilteredResult);
			}
			setItemCount(result.length);
			return result;
		},
		[pluginInjectionApi?.quickInsert?.actions, quickInsertDropdownItems, connectivityMode],
	);

	const emptyStateHandler =
		pluginInjectionApi?.quickInsert?.sharedState.currentState()?.emptyStateHandler;

	const onViewMore = useCallback(() => {
		toggleVisiblity();
		pluginInjectionApi?.core?.actions.execute(
			pluginInjectionApi?.quickInsert?.commands.openElementBrowserModal,
		);
	}, [pluginInjectionApi, toggleVisiblity]);

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
		<div css={insertMenuWrapper(height)}>
			<ElementBrowserWrapper
				handleClickOutside={toggleVisiblity}
				handleEscapeKeydown={toggleVisiblity}
				closeOnTab={false}
			>
				<ElementBrowser
					mode="inline"
					getItems={getItems}
					emptyStateHandler={emptyStateHandler}
					onInsertItem={onInsertItem}
					showSearch
					showCategories={false}
					// On page resize we want the InlineElementBrowser to show updated tools/overflow items
					key={quickInsertDropdownItems.length}
					onViewMore={showElementBrowserLink ? onViewMore : undefined}
					cache={cache}
				/>
			</ElementBrowserWrapper>
		</div>
	);
};

const getSvgIconForItem = ({ name }: SvgGetterParams): ReactElement | undefined => {
	type IconType = { [key: string]: ComponentClass<{ label: string }> };

	const Icon = (
		{
			codeblock: IconCode,
			panel: IconPanel,
			blockquote: IconQuote,
			decision: IconDecision,
			horizontalrule: IconDivider,
			expand: IconExpand,
			date: IconDate,
			status: IconStatus,
		} as IconType
	)[name];

	return Icon ? <Icon label="" /> : undefined;
};

const insertMenuWrapper = (height: number) => {
	return css({
		display: 'flex',
		flexDirection: 'column',
		width: '320px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		height: `${height}px`,
		backgroundColor: `${token('elevation.surface.overlay')}`,
		borderRadius: token('radius.small', '3px'),
		boxShadow: `${token('elevation.shadow.overlay')}`,
	});
};

const flexWrapperStyles: SerializedStyles = css({
	display: 'flex',
	flex: 1,
	boxSizing: 'border-box',
	overflow: 'hidden',
});

const FlexWrapper = (props: HTMLAttributes<HTMLDivElement>) => {
	const setOutsideClickTargetRef = useContext(OutsideClickTargetRefContext);
	const { children, ...divProps } = props;
	return (
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading
		<div ref={setOutsideClickTargetRef} css={flexWrapperStyles} {...divProps}>
			{children}
		</div>
	);
};

const ElementBrowserWrapper = withOuterListeners(FlexWrapper);

export default InsertMenu;
