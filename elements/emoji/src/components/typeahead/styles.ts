// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { emojiPreviewSelectedColor, emojiTypeAheadWidth } from '../../util/shared-styles';

export const emojiTypeAhead = 'emoji-typeahead-element';
export const typeAheadListContainer = 'emoji-typeahead-list-container';

// editor-core is using this static class name for testing
export const typeaheadSelected = 'emoji-typeahead-selected';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const selected = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundColor: emojiPreviewSelectedColor,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const typeAheadItem = css({
	cursor: 'pointer',
	display: 'block',
	listStyleType: 'none',
	overflow: 'hidden',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: emojiTypeAheadWidth,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const typeAheadItemRow = css({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	verticalAlign: 'middle',
});
