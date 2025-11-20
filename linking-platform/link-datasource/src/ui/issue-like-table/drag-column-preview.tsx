/* eslint-disable @atlaskit/design-system/use-tokens-typography */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx, styled } from '@compiled/react';

import { N40 } from '@atlaskit/theme/colors';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const TableHeading = styled.th({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.pm-table-wrapper > table thead &, .ProseMirror .pm-table-wrapper > table thead &, &': {
		border: 0,
		position: 'relative',
		/* This makes resizing work with out jumping due to padding + changes overall width for same default values. */
		boxSizing: 'border-box',
		lineHeight: '24px',
		paddingTop: token('space.025', '2px'),
		paddingRight: token('space.050', '4px'),
		paddingBottom: token('space.025', '2px'),
		paddingLeft: token('space.050', '4px'),
		borderRight: `0.5px solid ${token('color.border', N40)}`,
		borderBottom: `${token('border.width.selected')} solid ${token('color.border', N40)}`,
		/*
      lineHeight * 2 -> Max height of two lined header
      verticalPadding * 2 -> padding for this component itself
      verticalPadding * 2 -> padding inside span (--container)
      2px -> Bottom border
      Last two terms are needed because of border-box box sizing.
    */
		height: `calc(24px * 2 + ${token('space.025', '2px')} * 4 + 2px)`,
		verticalAlign: 'bottom',
		backgroundColor: token('utility.elevation.surface.current', '#FFF'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.pm-table-wrapper > table thead.has-column-picker &:nth-last-of-type(2), .ProseMirror .pm-table-wrapper > table thead.has-column-picker &:nth-last-of-type(2), thead.has-column-picker &:nth-last-of-type(2)':
		{
			borderRight: 0,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.pm-table-wrapper > table thead &:first-of-type, .ProseMirror .pm-table-wrapper > table thead &:first-of-type, &:first-of-type':
		{
			paddingLeft: token('space.050', '4px'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.pm-table-wrapper > table thead &:last-of-type, .ProseMirror .pm-table-wrapper > table thead &:last-of-type, &:last-of-type':
		{
			borderRight: 0,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"& [data-testid='datasource-header-content--container']": {
		width: '100%',
		/* With Button now being a parent for this component it adds its lineHeight value and spoils
      `height` calculation above. */
		lineHeight: '24px',
		paddingTop: token('space.025', '2px'),
		paddingRight: token('space.050', '4px'),
		paddingBottom: token('space.025', '2px'),
		paddingLeft: token('space.050', '4px'),
		display: '-webkit-box',
		WebkitLineClamp: 2,
		WebkitBoxOrient: 'vertical',
		whiteSpace: 'normal',
		overflow: 'hidden',
		wordWrap: 'break-word',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const TablePreviewHeading = styled(TableHeading)({
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	backgroundColor: token('color.background.disabled', '#091E4224'),
	maxWidth: '200px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:first-of-type, &:last-of-type': {
		paddingLeft: token('space.100', '8px'),
		paddingRight: token('space.100', '8px'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const TablePreviewCell = styled.td({
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	maxWidth: '200px',
	paddingTop: token('space.050', '4px'),
	paddingRight: token('space.100', '8px'),
	paddingBottom: token('space.050', '4px'),
	paddingLeft: token('space.100', '8px'),
	boxSizing: 'border-box',
	borderBottom: `0.5px solid ${token('color.border', N40)}`,
	height: '30px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:first-of-type, &:last-of-type': {
		paddingLeft: token('space.100', '8px'),
		paddingRight: token('space.100', '8px'),
	},
});

const tableStyles = css({
	backgroundColor: token('elevation.surface', '#FFF'),
	borderCollapse: 'separate',
	borderSpacing: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	font: token('font.body', fontFallback.body.medium),
	maxWidth: '200px',
});

export const DragColumnPreview = ({
	title,
	rows,
}: {
	rows: React.ReactNode[];
	title: React.ReactNode;
}) => {
	return (
		<table css={tableStyles}>
			<thead>
				<tr>
					<TablePreviewHeading>{title}</TablePreviewHeading>
				</tr>
			</thead>
			<tbody>
				{rows.map((data, i) => (
					<tr key={i}>
						<TablePreviewCell>{data}</TablePreviewCell>
					</tr>
				))}
				<tr>
					{/* eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx */}
					<TablePreviewCell>...</TablePreviewCell>
				</tr>
			</tbody>
		</table>
	);
};
