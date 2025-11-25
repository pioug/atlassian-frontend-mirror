// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import memoizeOne from 'memoize-one';

export const ANCHOR_VARIABLE_NAME = '--ed-pm-node-anchor';

const hasCssSupport = memoizeOne(() => {
	if (typeof window !== 'undefined' && window.CSS && typeof window.CSS.supports === 'function') {
		return true;
	}
	return false;
});

export const isCSSAttrAnchorSupported = memoizeOne(() => {
	if (hasCssSupport()) {
		return CSS.supports('anchor-name', 'attr(data-anchor-name type(<custom-ident>))');
	}
	return false;
});

export const isCSSAnchorSupported = memoizeOne(() => {
	if (hasCssSupport()) {
		return CSS.supports('anchor-name', '--anchor');
	}
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const nativeAnchorStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-node-anchor]': {
			anchorName: `var(${ANCHOR_VARIABLE_NAME}, attr(data-node-anchor type(<custom-ident>)))`,
		},
	},
});
