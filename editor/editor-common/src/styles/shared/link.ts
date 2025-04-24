// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const linkSharedStyle = () => {
	return fg('platform_editor_hyperlink_underline')
		? css({
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'a.blockLink': {
					display: 'block',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'a[data-prosemirror-mark-name="link"]': {
					textDecoration: 'underline',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'a[data-prosemirror-mark-name="link"]:hover': {
					textDecoration: 'none',
				},
			})
		: css({
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'a.blockLink': {
					display: 'block',
				},
			});
};
