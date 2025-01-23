// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { separatorCss } from '../../../styled';

const elementGap = '0.5rem';

/**
 * @deprecated remove on FF clean up bandicoots-compiled-migration-smartcard
 */
// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const metadataBlockCss = css`
	gap: 0px;
	/* primary element group */
	[data-smart-element-group]:nth-of-type(1) {
		flex-grow: 7;

		// a separator between text-based element
		${separatorCss}

		/* horizontal spacing between elements in group */
    > span {
			margin-right: ${elementGap};
		}
	}
	/* secondary element group */
	[data-smart-element-group]:nth-of-type(2) {
		flex-grow: 3;
		/* horizontal spacing between elements in group */
		> span {
			margin-left: ${elementGap};
		}
	}

	[data-smart-element-group] {
		line-height: 1rem;
	}
`;

/**
 * @deprecated remove on FF clean up bandicoots-compiled-migration-smartcard
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const footerBlockCss = css({
	height: '1.5rem',
});

/**
 * @deprecated remove on FF clean up bandicoots-compiled-migration-smartcard
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const hiddenSnippetStyles = css({
	visibility: 'hidden',
	position: 'absolute',
});
