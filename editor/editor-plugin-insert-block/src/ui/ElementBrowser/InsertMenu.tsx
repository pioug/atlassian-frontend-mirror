/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ComponentClass, HTMLAttributes, ReactElement } from 'react';
import { useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';
import { CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { ELEMENT_ITEM_HEIGHT, ElementBrowser } from '@atlaskit/editor-common/element-browser';
import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import {
	messages,
	IconCode,
	IconDate,
	IconDecision,
	IconDivider,
	IconExpand,
	IconPanel,
	IconQuote,
	IconStatus,
} from '@atlaskit/editor-common/quick-insert';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import {
	OutsideClickTargetRefContext,
	withReactEditorViewOuterListeners as withOuterListeners,
} from '@atlaskit/editor-common/ui-react';
import { fg } from '@atlaskit/platform-feature-flags';
import { N0, N30A, N60A } from '@atlaskit/theme/colors';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import type { insertBlockPlugin } from '../../insertBlockPlugin';

import type { InsertMenuProps, SvgGetterParams } from './types';

export const DEFAULT_HEIGHT = 560;

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
	isFullPageAppearance,
}: InsertMenuProps) => {
	const [itemCount, setItemCount] = useState(0);
	const [height, setHeight] = useState(DEFAULT_HEIGHT);
	const { formatMessage } = useIntl();

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

	// Please clean up viewMoreItem when cleaning up platform_editor_refactor_view_more
	const viewMoreItem =
		!fg('platform_editor_refactor_view_more') && showElementBrowserLink
			? quickInsertDropdownItems.pop()
			: undefined;

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
			const filterForPinWhiteboardsExperiment = (
				featuredItems: QuickInsertItem[],
			): QuickInsertItem[] => {
				// Part of ATLAS-95399 to pin whiteboards to the top of the InsertMenu
				// Need to check if whiteboard options are available, and filter for the cohort
				// Takes the original featuredItems list and returns one with the right whiteboard option at the top
				if (fg('confluence-whiteboards-quick-insert-eligible')) {
					const [DIAGRAM_TITLE, BLANK_TITLE] = ['Create diagram', 'Create whiteboard'];
					const featuredWhiteboardsPresent =
						featuredItems.filter((item) => [DIAGRAM_TITLE, BLANK_TITLE].includes(item.title))
							.length === 2;
					if (featuredWhiteboardsPresent) {
						const pinWhiteboardActionToTop = (
							featuredItems: QuickInsertItem[],
							title: string,
						): QuickInsertItem[] => {
							// find the requested item by title, give it the appropriate description, and bring it to the top of the list
							const index = featuredItems.findIndex((item) => item.title === title);
							const filteredList = featuredItems.filter(
								(item) => ![DIAGRAM_TITLE, BLANK_TITLE].includes(item.title),
							);
							if (index === -1) {
								return filteredList;
							}
							const featuredItem = { ...featuredItems[index] };
							featuredItem.description = formatMessage(messages.featuredWhiteboardDescription);
							return [featuredItem, ...filteredList];
						};
						if (expValEquals('confluence_whiteboards_quick_insert', 'cohort', 'test_blank')) {
							return pinWhiteboardActionToTop(featuredItems, BLANK_TITLE);
						} else if (
							expValEquals('confluence_whiteboards_quick_insert', 'cohort', 'test_diagram')
						) {
							return pinWhiteboardActionToTop(featuredItems, DIAGRAM_TITLE);
						} else {
							return featuredItems.filter(
								(item) => ![DIAGRAM_TITLE, BLANK_TITLE].includes(item.title),
							);
						}
					}
				}
				return featuredItems;
			};

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
							connectivityMode === 'offline' && item.isDisabledOffline
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
							connectivityMode === 'offline' && item.isDisabledOffline
								? { ...item, isDisabled: true }
								: item,
						) ?? [];
				const unfilteredResult = quickInsertDropdownItems.concat(
					featuredQuickInsertSuggestions,
				) as QuickInsertItem[];
				// need to filter on the concatenated list so whiteboards are at the top
				result = filterForPinWhiteboardsExperiment(unfilteredResult);
			}
			setItemCount(result.length);
			return result;
		},
		[
			pluginInjectionApi?.quickInsert?.actions,
			quickInsertDropdownItems,
			connectivityMode,
			formatMessage,
		],
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
		<div css={insertMenuWrapper(height, isFullPageAppearance)}>
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
					viewMoreItem={viewMoreItem}
					onViewMore={
						showElementBrowserLink || !fg('platform_editor_refactor_view_more_fix')
							? onViewMore
							: undefined
					}
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
		borderRadius: token('radius.small', '3px'),
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
