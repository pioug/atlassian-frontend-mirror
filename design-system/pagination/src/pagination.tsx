import React, { forwardRef, memo, type SyntheticEvent } from 'react';

import { type UIAnalyticsEvent, usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import { cssMap } from '@atlaskit/css';
import noop from '@atlaskit/ds-lib/noop';
import useControlled from '@atlaskit/ds-lib/use-controlled';
import ChevronLeftLargeIcon from '@atlaskit/icon/core/chevron-left';
import ChevronRightLargeIcon from '@atlaskit/icon/core/chevron-right';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import Navigator from './internal/components/navigator';
import PageComponent from './internal/components/page';
import renderDefaultEllipsis from './internal/components/render-ellipsis';
import { emptyObject } from './internal/constants';
import collapseRange from './internal/utils/collapse-range';
import { type PaginationPropTypes } from './types';

const styles = cssMap({
	paginationMenu: {
		paddingBlockStart: token('space.0'),
		paddingInlineEnd: token('space.0'),
		paddingBlockEnd: token('space.0'),
		paddingInlineStart: token('space.0'),
		marginBlockStart: token('space.0'),
		marginInlineEnd: token('space.0'),
		marginBlockEnd: token('space.0'),
		marginInlineStart: token('space.0'),
	},

	paginationMenuItem: {
		marginBlockStart: token('space.0'),
		fontFamily: token('font.family.body'),
	},

	navigatorIconWrapper: {
		paddingInline: token('space.075'),
	},
});

const analyticsAttributes = {
	componentName: 'pagination',
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
};

interface OnChangeData {
	event: SyntheticEvent;
	selectedPageIndex: number;
}

function NavigatorIcon({ chevronDirection }: { chevronDirection: 'left' | 'right' }) {
	const Chevron = chevronDirection === 'left' ? ChevronLeftLargeIcon : ChevronRightLargeIcon;

	return (
		<Box as="span" xcss={styles.navigatorIconWrapper}>
			<Chevron
				label=""
				LEGACY_margin={`0 ${token('space.negative.075')}`}
				color="currentColor"
				size="small"
			/>
		</Box>
	);
}

function InnerPagination<T extends React.ReactNode>(
	{
		components = emptyObject,
		defaultSelectedIndex = 0,
		selectedIndex,
		label = 'pagination',
		pageLabel = 'page',
		previousLabel = 'previous',
		nextLabel = 'next',
		style = emptyObject,
		max = 7,
		onChange = noop,
		pages,
		getPageLabel,
		renderEllipsis = renderDefaultEllipsis,
		analyticsContext,
		testId,
		isDisabled,
	}: PaginationPropTypes<T>,
	ref: React.Ref<HTMLDivElement>,
) {
	const [selectedIndexValue, setSelectedIndexValue] = useControlled(
		selectedIndex,
		() => defaultSelectedIndex || 0,
	);

	const onChangeWithAnalytics = usePlatformLeafEventHandler<OnChangeData>({
		fn: (value: OnChangeData, analyticsEvent: UIAnalyticsEvent) => {
			const { event, selectedPageIndex } = value;
			if (selectedIndex === undefined) {
				setSelectedIndexValue(selectedPageIndex);
			}
			if (onChange) {
				onChange(event, pages[selectedPageIndex], analyticsEvent);
			}
		},
		action: 'changed',
		actionSubject: 'pageNumber',
		analyticsData: analyticsContext,
		...analyticsAttributes,
	});

	const transform = (page: T, currPageIndex: number, testId?: string) => {
		const selectedPage = pages[selectedIndexValue];
		const pageIndexLabel = `${pageLabel} ${
			getPageLabel ? getPageLabel(page, currPageIndex) : page
		}`;
		const isCurrentPage = page === selectedPage;

		return (
			<Inline
				as="li"
				xcss={styles.paginationMenuItem}
				key={`page-${getPageLabel ? getPageLabel(page, currPageIndex) : currPageIndex}`}
			>
				<PageComponent
					component={components!.Page}
					onClick={(event) => onChangeWithAnalytics({ event, selectedPageIndex: currPageIndex })}
					aria-current={isCurrentPage ? 'page' : undefined}
					aria-label={pageIndexLabel}
					isSelected={isCurrentPage}
					isDisabled={isDisabled}
					page={page}
					testId={testId && `${testId}--${isCurrentPage ? 'current-' : ''}page-${currPageIndex}`}
				>
					{getPageLabel ? getPageLabel(page, currPageIndex) : page}
				</PageComponent>
			</Inline>
		);
	};

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<Box testId={testId} style={style} ref={ref} aria-label={label} as="nav">
			<Inline space="space.0" alignBlock="center">
				<Navigator
					key="left-navigator"
					component={components!.Previous}
					onClick={(event: SyntheticEvent) =>
						onChangeWithAnalytics({
							event,
							selectedPageIndex: selectedIndexValue - 1,
						})
					}
					isDisabled={isDisabled || selectedIndexValue === 0}
					iconBefore={<NavigatorIcon chevronDirection="left" />}
					aria-label={previousLabel}
					testId={testId && `${testId}--left-navigator`}
				/>
				<Inline space="space.0" alignBlock="baseline" as="ul" xcss={styles.paginationMenu}>
					{collapseRange(
						pages,
						selectedIndexValue,
						{
							max: max!,
							ellipsis: renderEllipsis!,
							transform,
						},
						testId,
					)}
				</Inline>
				<Navigator
					key="right-navigator"
					component={components!.Next}
					onClick={(event: SyntheticEvent) =>
						onChangeWithAnalytics({
							event,
							selectedPageIndex: selectedIndexValue + 1,
						})
					}
					isDisabled={isDisabled || selectedIndexValue === pages.length - 1}
					iconBefore={<NavigatorIcon chevronDirection="right" />}
					aria-label={nextLabel}
					testId={testId && `${testId}--right-navigator`}
				/>
			</Inline>
		</Box>
	);
}

/**
 * __Pagination__
 *
 * Pagination allows you to divide large amounts of content into smaller chunks across multiple pages.
 *
 * - [Examples](https://atlassian.design/components/pagination/examples)
 * - [Code](https://atlassian.design/components/pagination/code)
 * - [Usage](https://atlassian.design/components/pagination/usage)
 */
const Pagination = memo(forwardRef(InnerPagination)) as <T>(
	props: PaginationPropTypes<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;

export default Pagination;
