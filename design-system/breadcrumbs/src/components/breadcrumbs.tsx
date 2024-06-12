/** @jsx jsx */
import React, { forwardRef, memo, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { type UIAnalyticsEvent, usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import __noop from '@atlaskit/ds-lib/noop';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type BreadcrumbsProps } from '../types';

import EllipsisItem from './ellipsis-item';
import { useOnRevealed } from './internal/use-on-revealed';

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

const breadcrumbStyles = css({
	display: 'flex',
	margin: token('space.0', '0px'),
	padding: token('space.0', '0px'),
	flexWrap: 'wrap',
});

const InnerBreadcrumbs = forwardRef((props: BreadcrumbsProps, ref: React.Ref<any>) => {
	const {
		defaultExpanded = false,
		isExpanded,
		isNavigation = true,
		maxItems = defaultMaxItems,
		itemsBeforeCollapse = 1,
		itemsAfterCollapse = 1,
		children = [],
		testId,
		onExpand: providedExpanse = noop,
		analyticsContext,
		label = defaultBreadcrumbsLabel,
		ellipsisLabel = defaultEllipsisLabel,
	} = props;

	const [expanded, setExpanse] = useState(defaultExpanded);
	const [isClickedBySpace, setExpansionTrigger] = useState(false);
	const wrapperRef = useRef<HTMLElement>(null);

	const isControlled = typeof isExpanded !== 'undefined';
	const isExpansionHandled = providedExpanse !== noop;
	const shouldExpand = isControlled ? isExpanded : expanded;

	const focusFirstRevealed = () => {
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
	};

	useOnRevealed(focusFirstRevealed, {
		isExpanded: shouldExpand!,
		isDisabled: !isClickedBySpace,
	});

	const handleExpansion = usePlatformLeafEventHandler({
		fn: (event: React.MouseEvent<Element>, analyticsEvent: UIAnalyticsEvent) => {
			if (!isControlled) {
				setExpanse((expanded) => !expanded);
			}

			if ((isExpansionHandled && isControlled) || !isControlled) {
				setExpansionTrigger(event.target === document.activeElement);
			}

			return providedExpanse(event, analyticsEvent);
		},
		action: 'expanded',
		analyticsData: analyticsContext,
		...analyticsAttributes,
	});

	const childrenArray = toArray(children) as React.ReactElement<any>[];

	const breadcrumbsArray = React.Children.map(childrenArray, (child, index) => {
		//To avoid error if child is a string
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
		// This defends against someone passing weird data, to ensure that if all
		// items would be shown anyway, we just show all items without the EllipsisItem
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

	const Component = isNavigation ? 'nav' : 'div';

	return (
		<Component aria-label={label} ref={mergeRefs([ref, wrapperRef])} tabIndex={-1}>
			<ol
				data-testid={testId}
				css={breadcrumbStyles}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={{ color: token('color.text.subtlest', N200) }}
			>
				{breadcrumbsItems}
			</ol>
		</Component>
	);
});

const Breadcrumbs = memo(
	forwardRef((props: BreadcrumbsProps, ref: React.Ref<any>) => {
		return <InnerBreadcrumbs {...props} ref={ref} />;
	}),
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Breadcrumbs;
