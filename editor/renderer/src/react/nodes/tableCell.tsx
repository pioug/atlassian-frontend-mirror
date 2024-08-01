import type { CSSProperties } from 'react';
import React from 'react';
import type { CellAttributes } from '@atlaskit/adf-schema';
import { tableBackgroundColorPalette, getDarkModeLCHColor } from '@atlaskit/adf-schema';
import { useThemeObserver } from '@atlaskit/tokens';
import { SortOrder } from '@atlaskit/editor-common/types';
import { hexToEditorBackgroundPaletteRawValue } from '@atlaskit/editor-palette';

import { SortingIcon } from '@atlaskit/editor-common/table';
import type { AnalyticsEventPayload } from '../../analytics/events';
import { MODE, PLATFORM } from '../../analytics/events';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import { RendererCssClassName } from '../../consts';
import { useIntl } from 'react-intl-next';
import type { IntlShape } from 'react-intl-next';
import { tableCellMessages } from '../../messages';

type CellProps = CellAttributes & {
	children?: React.ReactNode;
	onClick?: () => void;
	className?: string;
	colGroupWidth?: string;
	offsetTop?: number;
	ariaSort?: string;
};
const IgnoreSorting = ['LABEL', 'INPUT'];

export type CellWithSortingProps = CellProps & {
	isHeaderRow?: boolean;
	allowColumnSorting?: boolean;
	onSorting?: (columnIndex?: number, currentSortOrdered?: SortOrder) => void;
	columnIndex?: number;
	sortOrdered?: SortOrder;
	fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
};

const nextStatusOrder = (currentSortOrder?: SortOrder): SortOrder => {
	switch (currentSortOrder) {
		case SortOrder.NO_ORDER:
			return SortOrder.ASC;
		case SortOrder.ASC:
			return SortOrder.DESC;
		case SortOrder.DESC:
			return SortOrder.NO_ORDER;
	}

	return SortOrder.NO_ORDER;
};

const getSortOrderLabel = (intl: IntlShape, currentSortOrder?: SortOrder): string => {
	const { noneSortingLabel, ascSortingLabel, descSortingLabel } = tableCellMessages;
	switch (currentSortOrder) {
		case SortOrder.NO_ORDER:
			return intl.formatMessage(noneSortingLabel);
		case SortOrder.ASC:
			return intl.formatMessage(ascSortingLabel);
		case SortOrder.DESC:
			return intl.formatMessage(descSortingLabel);
		default:
			return intl.formatMessage(noneSortingLabel);
	}
};

const getDataAttributes = (colwidth?: number[], background?: string): any => {
	const attrs: any = {};
	if (colwidth) {
		attrs['data-colwidth'] = colwidth.join(',');
	}
	/**
	 * Storing hex code in data-cell-background because
	 *  we want to have DST token (css variable) or
	 *  DST token value (value (hex code) of css variable) in
	 *  inline style to correct render table cell background
	 *  based on selected theme.
	 * Currently we rely on background color hex code stored in
	 *  inline style.
	 * Because of that when we copy and paste table, we end up
	 *  having DST token or DST token value in ADF instead of
	 *  original hex code which we map to DST token.
	 * So, introducing data-cell-background.
	 * More details at https://product-fabric.atlassian.net/wiki/spaces/EUXQ/pages/3472556903/Tokenising+tableCell+background+colors#Update-toDom-and-parseDom-to-store-and-read-background-color-from-data-cell-background-attribute.4
	 */
	if (background) {
		attrs['data-cell-background'] = background;
	}

	return attrs;
};

const cssVariablePattern = /^var\(--.*\)$/;

const getStyle = ({
	background,
	colGroupWidth,
	offsetTop,
	colorMode,
}: {
	background?: string;
	colGroupWidth?: string;
	offsetTop?: number;
	colorMode: ReturnType<typeof useThemeObserver>['colorMode'];
}): CSSProperties => {
	const style: CSSProperties = {};
	if (
		background &&
		// ignore setting inline styles if ds neutral token is detected
		!background.includes('--ds-background-neutral')
	) {
		/**
		 * The Editor supports users pasting content from external sources with custom table cell backgrounds and having those
		 * backgrounds persisted.
		 *
		 * This feature predates the introduction of dark mode.
		 *
		 * Without the inversion logic below, tokenised content (ie. text), can be hard to read when the user loads the page in dark mode.
		 *
		 * This introduces inversion of the presentation of the custom background color when the user is in dark mode.
		 *
		 * This can be done without additional changes to account for users copying and pasting content inside the Editor, because of
		 * how we detect table cell background colors copied from external editor sources. Where we load the background color from a
		 * seperate attribute (data-cell-background), instead of the inline style.
		 *
		 * See the following document for more details on this behaviour
		 * https://hello.atlassian.net/wiki/spaces/CCECO/pages/2892247168/Unsupported+custom+table+cell+background+colors+in+dark+theme+Editor+Job+Story
		 */
		const tokenColor = hexToEditorBackgroundPaletteRawValue(background);

		if (tokenColor) {
			style.backgroundColor = tokenColor;
		} else if (
			/**
			 * There was previously a bug in dark mode where we would attempt to invert
			 * a design token in `getDarkModeLCHColor` causing issues.
			 * If it's a design token we should return it as is.
			 */
			cssVariablePattern.test(background)
		) {
			style.backgroundColor = background;
		} else {
			// if we have a custom color, we need to check if we are in dark mode
			if (colorMode === 'dark') {
				// if we are in dark mode, we need to invert the color
				style.backgroundColor = getDarkModeLCHColor(background);
			} else {
				// if we are in light mode, we can just set the color
				style.backgroundColor = background;
			}
		}
	}

	if (colGroupWidth) {
		style.width = colGroupWidth;
		style.minWidth = colGroupWidth;
	}

	if (offsetTop !== undefined) {
		style.top = offsetTop;
	}

	return style;
};

const getWithCellProps = (WrapperComponent: React.ElementType) => {
	return function WithCellProps(props: CellProps) {
		const { colorMode } = useThemeObserver();
		const {
			children,
			className,
			onClick,
			colwidth,
			colGroupWidth,
			rowspan,
			colspan,
			background,
			offsetTop,
			ariaSort,
		} = props;

		// This is used to set the background color of the cell
		// to a dark mode color in mobile dark mode
		const colorName = background ? tableBackgroundColorPalette.get(background) : '';

		return (
			<WrapperComponent
				rowSpan={rowspan}
				colSpan={colspan}
				// Note: When content from a renderer is pasted into an editor
				// the background color is not taken from the inline style.
				// Instead it is taken from the data-cell-background attribute
				// (added via getDataAttributes below).
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={getStyle({ background, colGroupWidth, offsetTop, colorMode })}
				colorname={colorName}
				onClick={onClick}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={className}
				{...getDataAttributes(colwidth, background)}
				aria-sort={ariaSort}
			>
				{children}
			</WrapperComponent>
		);
	};
};
const TH = getWithCellProps('th');

export const withSortableColumn = (WrapperComponent: React.ElementType) => {
	return function THWithSortableColumn(props: CellWithSortingProps) {
		const intl = useIntl();
		const { allowColumnSorting, onSorting, children, sortOrdered, isHeaderRow } = props;
		const sortOrderedClassName =
			sortOrdered === SortOrder.NO_ORDER ? RendererCssClassName.SORTABLE_COLUMN_NO_ORDER : '';

		if (!allowColumnSorting || !isHeaderRow) {
			return <WrapperComponent {...props} />;
		}

		return (
			<WrapperComponent
				{...props}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={RendererCssClassName.SORTABLE_COLUMN_WRAPPER}
				ariaSort={getSortOrderLabel(intl, sortOrdered)}
			>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766  */}
				<div className={RendererCssClassName.SORTABLE_COLUMN}>
					{children}
					<figure
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={`${RendererCssClassName.SORTABLE_COLUMN_ICON_WRAPPER} ${sortOrderedClassName}`}
					>
						<SortingIcon
							isSortingAllowed={!!onSorting}
							sortOrdered={sortOrdered}
							onClick={sort}
							onKeyDown={onKeyPress}
						/>
					</figure>
				</div>
			</WrapperComponent>
		);

		function onKeyPress(event: React.KeyboardEvent<HTMLElement>) {
			const keys = [' ', 'Enter', 'Spacebar'];
			const { tagName } = event.target as HTMLElement;
			// trigger sorting if space or enter are clicked but not when in an input field (template variables)
			if (keys.includes(event.key) && !IgnoreSorting.includes(tagName)) {
				event.preventDefault();
				sort();
			}
		}

		function sort() {
			const { fireAnalyticsEvent, onSorting, columnIndex, sortOrdered } = props;

			if (onSorting && columnIndex != null) {
				const sortOrder = nextStatusOrder(sortOrdered);
				onSorting(columnIndex, sortOrder);
				fireAnalyticsEvent &&
					fireAnalyticsEvent({
						action: ACTION.SORT_COLUMN,
						actionSubject: ACTION_SUBJECT.TABLE,
						attributes: {
							platform: PLATFORM.WEB,
							mode: MODE.RENDERER,
							columnIndex,
							sortOrder,
						},
						eventType: EVENT_TYPE.TRACK,
					});
			} else {
				fireAnalyticsEvent &&
					fireAnalyticsEvent({
						action: ACTION.SORT_COLUMN_NOT_ALLOWED,
						actionSubject: ACTION_SUBJECT.TABLE,
						attributes: {
							platform: PLATFORM.WEB,
							mode: MODE.RENDERER,
						},
						eventType: EVENT_TYPE.TRACK,
					});
			}
		}
	};
};

export const TableHeader = withSortableColumn(TH);

const TD = getWithCellProps('td');
export const TableCell = TD;
