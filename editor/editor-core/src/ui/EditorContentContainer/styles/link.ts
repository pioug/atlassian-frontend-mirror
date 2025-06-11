// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css } from '@emotion/react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const linkStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ProseMirror a.blockLink': {
		display: 'block',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ProseMirror a[data-prosemirror-mark-name="link"]': {
		textDecoration: 'underline',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ProseMirror a[data-prosemirror-mark-name="link"]:hover': {
		textDecoration: 'none',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const linkStylesOld = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ProseMirror a.blockLink': {
		display: 'block',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const hyperLinkFloatingToolbarStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.hyperlink-floating-toolbar': {
		padding: 0,
	},
});

/*
 * Legacy Link icon in the Atlaskit package is bigger than the others,
 * new ADS icon does not have this issue
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const linkLegacyIconStylesFix = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.hyperlink-open-link': {
		minWidth: 24,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		svg: {
			maxWidth: 18,
		},
	},
});
