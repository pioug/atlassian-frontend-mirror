/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	forwardRef,
	type KeyboardEvent,
	memo,
	type MouseEvent,
	useCallback,
	useRef,
	useState,
} from 'react';

import { css, jsx } from '@compiled/react';

import { type UIAnalyticsEvent, usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import { getDocument } from '@atlaskit/browser-apis';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import __noop from '@atlaskit/ds-lib/noop';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { type BreadcrumbsItemProps, type BreadcrumbsProps } from '../types';

import BreadcrumbsCurrentItem from './breadcrumbs-current-item';
import EllipsisItem from './ellipsis-item';
import { BreadcrumbsSizeProvider } from './internal/breadcrumbs-size-provider';
import EllipsisPopup, { type CollapsedItem } from './internal/ellipsis-popup';
import { useOnRevealed } from './internal/use-on-revealed';
import useOverflowCollapse from './internal/use-overflow-collapse';

const defaultMaxItems = 8;
const defaultBreadcrumbsLabel = 'Breadcrumbs';
const defaultEllipsisLabel = 'Show more breadcrumbs';

const { toArray } = React.Children;

const analyticsAttributes = {
	componentName: 'breadcrumbs',
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
};

const noop = __noop;

const interactiveElementSelector = 'a, button, [tabindex]:not([tabindex="-1"])';

const breadcrumbStylesOld = css({
	display: 'flex',
	flexWrap: 'wrap',
	color: token('color.text.subtlest'),
	marginBlockEnd: token('space.0'),
	marginBlockStart: token('space.0'),
	marginInlineEnd: token('space.0'),
	marginInlineStart: token('space.0'),
	paddingBlockEnd: token('space.0'),
	paddingBlockStart: token('space.0'),
	paddingInlineEnd: token('space.0'),
	paddingInlineStart: token('space.0'),
});

const breadcrumbStylesNew = css({
	display: 'flex',
	minWidth: '0',
	alignItems: 'baseline',
	flexWrap: 'nowrap',
	listStyleType: 'none',
	marginBlockEnd: '0',
	marginBlockStart: '0',
	marginInlineEnd: '0',
	marginInlineStart: '0',
	overflow: 'hidden',
	paddingBlockEnd: '0',
	paddingBlockStart: '0',
	paddingInlineEnd: '0',
	paddingInlineStart: '0',
});

const navStylesNew = css({
	minWidth: '0',
	overflow: 'hidden',
});

const ellipsisItemWrapperStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	alignItems: 'center',
	flexDirection: 'row',
	flexShrink: 0,
	alignSelf: 'center',
	marginBlockStart: token('space.0', '0px'),
	'&::after': {
		width: '8px',
		flexShrink: 0,
		alignSelf: 'center',
		color: token('color.text.subtlest'),
		content: '"/"',
		paddingBlock: token('space.025'),
		paddingInline: token('space.100'),
		textAlign: 'center',
	},
});

// items will get collapsed into ellipsis dropdown
// therefore they are no longer rendered in the DOM
// they need to be passed in to the dropdown
function getItemProps(child: React.ReactElement): CollapsedItem {
	const { text, href, onClick, target } = child.props as Partial<BreadcrumbsItemProps>;
	const wrappedOnClick = onClick
		? (event: MouseEvent<Element> | KeyboardEvent<Element>) => {
				// Collapsed dropdown items can be activated via keyboard, but the
				// original BreadcrumbsItem onClick contract is mouse-based.
				if ('button' in event) {
					onClick(event);
				}
			}
		: undefined;

	if (process.env.NODE_ENV !== 'production' && typeof text !== 'string') {
		// eslint-disable-next-line no-console
		console.warn(
			'[Breadcrumbs] A collapsed child has no `text` prop - it will appear blank in the ellipsis dropdown.',
		);
	}

	return { text: text ?? '', href, onClick: wrappedOnClick, target };
}

function cloneBreadcrumbChild(
	child: React.ReactElement,
	index: number,
	itemCount: number,
	registerItem: (index: number) => (el: HTMLLIElement | null) => void,
): React.ReactElement {
	const isLast = index === itemCount - 1;
	const isCurrentItem = child.type === BreadcrumbsCurrentItem;

	return (
		// eslint-disable-next-line @repo/internal/react/no-clone-element
		React.cloneElement(child, {
			key: child.key ?? index,
			_overflowRef: registerItem(index),
			...(isLast && !isCurrentItem ? { 'aria-current': 'page' } : {}),
		})
	);
}

const InnerBreadcrumbs: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<BreadcrumbsProps> & React.RefAttributes<any>
> = forwardRef((props: BreadcrumbsProps, ref: React.Ref<any>) => {
	if (fg('platform_dst_breadcrumbs-refresh')) {
		return <InnerBreadcrumbsNew {...props} ref={ref} />;
	}
	return <InnerBreadcrumbsOld {...props} ref={ref} />;
});

const InnerBreadcrumbsOld = forwardRef((props: BreadcrumbsProps, ref: React.Ref<any>) => {
	const {
		defaultExpanded = false,
		isExpanded,
		maxItems = defaultMaxItems,
		itemsBeforeCollapse = 1,
		itemsAfterCollapse = 1,
		children = [],
		testId,
		onExpand: providedExpanse = noop,
		analyticsContext,
		label = defaultBreadcrumbsLabel,
		ellipsisLabel = defaultEllipsisLabel,
		size = 'medium',
	} = props;

	const [expanded, setExpanse] = useState(defaultExpanded);
	const [isClickedBySpace, setExpansionTrigger] = useState(false);
	const wrapperRef = useRef<HTMLElement>(null);

	const isControlled = typeof isExpanded !== 'undefined';
	const isExpansionHandled = providedExpanse !== noop;
	const shouldExpand = isControlled ? isExpanded : expanded;

	const focusFirstRevealedMemoized = useCallback(() => {
		if (wrapperRef.current) {
			const listItems = Array.from(wrapperRef.current.querySelectorAll('li'));
			const interactiveElements = listItems.map((li) =>
				li.querySelector<HTMLElement>(interactiveElementSelector),
			);

			const elementToFocus = interactiveElements[itemsBeforeCollapse];
			const firstInteractiveElement = interactiveElements[0];

			if (elementToFocus) {
				elementToFocus.focus && elementToFocus.focus();
			} else if (firstInteractiveElement) {
				firstInteractiveElement.focus && firstInteractiveElement.focus();
			} else {
				wrapperRef.current.focus();
			}
		}
		setExpansionTrigger(false);
	}, [setExpansionTrigger, itemsBeforeCollapse, wrapperRef]);

	useOnRevealed(focusFirstRevealedMemoized, {
		isExpanded: shouldExpand!,
		isDisabled: !isClickedBySpace,
	});

	const handleExpansion = usePlatformLeafEventHandler({
		fn: (event: React.MouseEvent<Element>, analyticsEvent: UIAnalyticsEvent) => {
			if (!isControlled) {
				setExpanse((expanded) => !expanded);
			}

			if ((isExpansionHandled && isControlled) || !isControlled) {
				setExpansionTrigger(event.target === getDocument()?.activeElement);
			}

			return providedExpanse(event, analyticsEvent);
		},
		action: 'expanded',
		analyticsData: analyticsContext,
		...analyticsAttributes,
	});

	const childrenArray = toArray(children) as React.ReactElement<any>[];

	const breadcrumbsArray = React.Children.map(childrenArray, (child, index) => {
		if (typeof child === 'string') {
			return child;
		}
		return childrenArray.length - 1 === index
			? // eslint-disable-next-line @repo/internal/react/no-clone-element
				React.cloneElement(child, {
					'aria-current': 'page',
				})
			: child;
	});

	const renderItemsWithEllipsis = () => {
		const allItems = breadcrumbsArray;
		if (itemsBeforeCollapse + itemsAfterCollapse >= allItems.length) {
			return allItems;
		}

		const beforeItems = allItems.slice(0, itemsBeforeCollapse);
		const afterItems = allItems.slice(allItems.length - itemsAfterCollapse, allItems.length);

		return [
			...beforeItems,
			<EllipsisItem
				key="ellipsis"
				testId={testId && `${testId}--breadcrumb-ellipsis`}
				onClick={handleExpansion}
				label={ellipsisLabel}
			/>,
			...afterItems,
		];
	};

	const shouldDisplayItems = shouldExpand || (maxItems && breadcrumbsArray.length <= maxItems);

	const breadcrumbsItems = shouldDisplayItems ? breadcrumbsArray : renderItemsWithEllipsis();

	return (
		<BreadcrumbsSizeProvider value={size}>
			<nav aria-label={label} ref={mergeRefs([ref, wrapperRef])} tabIndex={-1}>
				<ol data-testid={testId} css={breadcrumbStylesOld}>
					{breadcrumbsItems}
				</ol>
			</nav>
		</BreadcrumbsSizeProvider>
	);
});

const InnerBreadcrumbsNew = forwardRef((props: BreadcrumbsProps, ref: React.Ref<any>) => {
	const {
		children = [],
		testId,
		analyticsContext,
		label = defaultBreadcrumbsLabel,
		ellipsisLabel = defaultEllipsisLabel,
		size = 'medium',
		createAnalyticsEvent: _createAnalyticsEvent,
	} = props;

	const childrenArray: React.ReactElement[] = React.Children.toArray(children).filter(
		(child): child is React.ReactElement => React.isValidElement(child),
	);

	const itemCount = childrenArray.length;

	if (process.env.NODE_ENV !== 'production') {
		childrenArray.forEach((child, index) => {
			if (child.type === BreadcrumbsCurrentItem && index !== itemCount - 1) {
				// eslint-disable-next-line no-console
				console.warn(
					'[Breadcrumbs] BreadcrumbsCurrentItem must be the last item in Breadcrumbs. ' +
						'It was found at position ' +
						(index + 1) +
						' of ' +
						itemCount +
						'. ' +
						'Either move it to the end of the Breadcrumbs children, or use BreadcrumbsItem instead.',
				);
			}
		});
	}

	const { collapsedIndices, naturalWidthsReady, registerItem, registerContainer } =
		useOverflowCollapse(itemCount);
	const handleOverflowExpansion = usePlatformLeafEventHandler({
		fn: noop,
		action: 'expanded',
		analyticsData: analyticsContext,
		...analyticsAttributes,
	});

	const collapsedItems = Array.from(collapsedIndices)
		.sort((a, b) => a - b)
		.map((i) => getItemProps(childrenArray[i]));

	const renderedItems: React.ReactNode[] = [];
	let ellipsisInserted = false;

	childrenArray.forEach((child, index) => {
		const isCollapsed = collapsedIndices.has(index);

		if (isCollapsed) {
			if (!ellipsisInserted) {
				ellipsisInserted = true;
				renderedItems.push(
					<li key="ellipsis" css={ellipsisItemWrapperStyles}>
						<EllipsisPopup
							collapsedItems={collapsedItems}
							label={ellipsisLabel}
							onClick={handleOverflowExpansion}
							testId={testId && `${testId}--breadcrumb-ellipsis`}
						/>
					</li>,
				);
			}
			return;
		}

		renderedItems.push(cloneBreadcrumbChild(child, index, itemCount, registerItem));
	});

	const measureItems = !naturalWidthsReady
		? childrenArray.map((child, index) =>
				cloneBreadcrumbChild(child, index, itemCount, registerItem),
			)
		: null;

	return (
		<BreadcrumbsSizeProvider value={size}>
			<nav aria-label={label} ref={ref} css={navStylesNew} tabIndex={-1}>
				<ol data-testid={testId} css={breadcrumbStylesNew} ref={registerContainer}>
					{naturalWidthsReady ? renderedItems : measureItems}
				</ol>
			</nav>
		</BreadcrumbsSizeProvider>
	);
});

const Breadcrumbs: React.MemoExoticComponent<
	React.ForwardRefExoticComponent<
		React.PropsWithoutRef<BreadcrumbsProps> & React.RefAttributes<any>
	>
> = memo(
	forwardRef(
		(
			{
				analyticsContext,
				children,
				createAnalyticsEvent,
				defaultExpanded,
				ellipsisLabel,
				isExpanded,
				itemsAfterCollapse,
				itemsBeforeCollapse,
				label,
				maxItems,
				onExpand,
				size,
				testId,
				...props
			}: BreadcrumbsProps,
			ref: React.Ref<any>,
		) => (
			<InnerBreadcrumbs
				{...props}
				analyticsContext={analyticsContext}
				children={children}
				createAnalyticsEvent={createAnalyticsEvent}
				defaultExpanded={defaultExpanded}
				ellipsisLabel={ellipsisLabel}
				isExpanded={isExpanded}
				itemsAfterCollapse={itemsAfterCollapse}
				itemsBeforeCollapse={itemsBeforeCollapse}
				label={label}
				maxItems={maxItems}
				onExpand={onExpand}
				size={size}
				ref={ref}
				testId={testId}
			/>
		),
	),
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Breadcrumbs;
