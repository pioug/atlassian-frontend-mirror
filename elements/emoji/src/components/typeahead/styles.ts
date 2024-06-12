import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import {
	emojiPreviewSelectedColor,
	emojiTypeAheadMaxHeight,
	emojiTypeAheadWidth,
	noDialogContainerBorderColor,
	noDialogContainerBorderRadius,
	noDialogContainerBoxShadow,
} from '../../util/shared-styles';

export const emojiTypeAhead = 'emoji-typeahead-element';
export const typeAheadListContainer = 'emoji-typeahead-list-container';

// editor-core is using this static class name for testing
export const typeaheadSelected = 'emoji-typeahead-selected';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const typeAheadList = css({
	background: token('elevation.surface.overlay', 'white'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	border: `1px solid ${noDialogContainerBorderColor}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: noDialogContainerBorderRadius,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	boxShadow: noDialogContainerBoxShadow,
	color: token('color.text.subtle', '#333'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: emojiTypeAheadWidth,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const typeAheadEmpty = css({
	display: 'none',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const selected = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundColor: emojiPreviewSelectedColor,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const typeAheadItem = css({
	cursor: 'pointer',
	display: 'block',
	listStyleType: 'none',
	overflow: 'hidden',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: emojiTypeAheadWidth,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const typeAheadItemRow = css({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	verticalAlign: 'middle',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const emojiTypeAheadSpinnerContainer = css({
	position: 'relative',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: `${emojiTypeAheadMaxHeight}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	paddingTop: `${((emojiTypeAheadMaxHeight - 30) / 2).toFixed()}px`,
	boxSizing: 'border-box',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const emojiTypeAheadSpinner = css({
	textAlign: 'center',
});
