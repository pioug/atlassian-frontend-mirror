/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ComponentClass, HTMLAttributes, ReactElement } from 'react';
import { useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { ELEMENT_ITEM_HEIGHT, ElementBrowser } from '@atlaskit/editor-common/element-browser';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import {
	IconCode,
	IconDate,
	IconDecision,
	IconDivider,
	IconExpand,
	IconPanel,
	IconQuote,
	IconStatus,
} from '@atlaskit/editor-common/quick-insert';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import {
	OutsideClickTargetRefContext,
	withReactEditorViewOuterListeners as withOuterListeners,
} from '@atlaskit/editor-common/ui-react';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { fg } from '@atlaskit/platform-feature-flags';
import { borderRadius } from '@atlaskit/theme';
import { N0, N30A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { InsertMenuProps, SvgGetterParams } from './types';

export const DEFAULT_HEIGHT = 560;

const InsertMenu = ({
	editorView,
	dropdownItems,
	showElementBrowserLink,
	onInsert,
	toggleVisiblity,
	pluginInjectionApi,
	isFullPageAppearance,
}: InsertMenuProps) => {
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

	const viewMoreItem = showElementBrowserLink ? quickInsertDropdownItems.pop() : undefined;

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

	const { connectivityState } = useSharedPluginState(pluginInjectionApi, ['connectivity']);

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
							connectivityState?.mode === 'offline' && item.isDisabledOffline
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
							connectivityState?.mode === 'offline' && item.isDisabledOffline
								? { ...item, isDisabled: true }
								: item,
						) ?? [];

				result = quickInsertDropdownItems.concat(
					featuredQuickInsertSuggestions,
				) as QuickInsertItem[];
			}

			setItemCount(result.length);
			return result;
		},
		[pluginInjectionApi?.quickInsert?.actions, quickInsertDropdownItems, connectivityState],
	);

	const emptyStateHandler =
		pluginInjectionApi?.quickInsert?.sharedState.currentState()?.emptyStateHandler;

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
		<div css={insertMenuWrapper(height, isFullPageAppearance)}>
			<ElementBrowserWrapper
				handleClickOutside={toggleVisiblity}
				handleEscapeKeydown={toggleVisiblity}
				closeOnTab={!fg('editor_a11y_tab_does_not_close_menus')}
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
					viewMoreItem={viewMoreItem}
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

const insertMenuWrapper = (height: number, isFullPageAppearance?: boolean) => {
	return css({
		display: 'flex',
		flexDirection: 'column',
		width: '320px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		height: `${height}px`,
		backgroundColor: `${token('elevation.surface.overlay', N0)}`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		borderRadius: `${borderRadius()}px`,
		boxShadow: `${token(
			'elevation.shadow.overlay',
			`0 0 0 1px ${N30A},
    0 2px 1px ${N30A},
    0 0 20px -6px ${N60A}`,
		)}`,
	});
};

const flexWrapperStyles = css({
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
