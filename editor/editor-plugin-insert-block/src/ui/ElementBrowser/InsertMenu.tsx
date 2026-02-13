/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ComponentClass, HTMLAttributes, ReactElement } from 'react';
import { useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';
import { type MessageDescriptor, useIntl } from 'react-intl-next';
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
import { isOfflineMode } from '@atlaskit/editor-plugin-connectivity';
import { N0, N30A, N60A } from '@atlaskit/theme/colors';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';
import { token } from '@atlaskit/tokens';

import type { insertBlockPlugin } from '../../insertBlockPlugin';

import type { InsertMenuProps, SvgGetterParams } from './types';

export const DEFAULT_HEIGHT = 560;

/**
 * Exported helper to allow testing of InsertMenu pinning logic. NOTE: this is
   *not* the ideal way to approach this, quickinsert plugin provides a `getSuggestions`
   method that can be used to get suggestions -> once all experiments are cleaned up,
   they should be unified through `pluginInjectionApi?.quickInsert?.actions.getSuggestions`

   `cc_fd_db_top_editor_toolbar` experiment adds new logic to sort elements by `priority`
   this newer implementation matches how the "quick insert menu" sorts elements
 */
export const sortPrioritizedElements = (
	featuredItems: QuickInsertItem[],
	formatMessage: (msg: MessageDescriptor) => string,
): QuickInsertItem[] => {
	// temporary for A/A test
	['new-description', 'orig-description'].includes(
		expVal('cc_fd_db_top_editor_toolbar_aa', 'cohort', 'control'),
	)

	if (
		['new-description', 'orig-description'].includes(
			expVal('cc_fd_db_top_editor_toolbar', 'cohort', 'control'),
		)
	) {
		// Sort by priority (lower first) on the concatenated list so items
		// with "priority" are at the top (e.g. Whiteboard before Database)
		return featuredItems
			.slice(0)
			.sort(
				(a, b) =>
					(a.priority || Number.POSITIVE_INFINITY) - (b.priority || Number.POSITIVE_INFINITY),
			);
	}

	// old logic sort whiteboards to top
	const DIAGRAM_KEY = 'whiteboard-extension:create-diagram';
	const isDiagram = (item: QuickInsertItem) => item.key === DIAGRAM_KEY;

	const featuredWhiteboardsPresent = featuredItems.some(isDiagram);
	if (featuredWhiteboardsPresent) {
		const pin = (key: string) => {
			const idx = featuredItems.findIndex((item) => item.key === key);
			const filtered = featuredItems.filter((item) => !isDiagram(item));
			if (idx === -1) {
				return filtered;
			}
			const picked = {
				...featuredItems[idx],
				description: formatMessage(messages.featuredWhiteboardDescription),
			};
			return [picked, ...filtered];
		};

		return pin(DIAGRAM_KEY);
	}

	return featuredItems;
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
				result = sortPrioritizedElements(unfilteredResult, formatMessage);
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
