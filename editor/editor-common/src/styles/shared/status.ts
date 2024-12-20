// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

export const StatusSharedCssClassName = {
	STATUS_CONTAINER: 'statusView-content-wrap',
	STATUS_LOZENGE: 'status-lozenge-span',
};

export const getStatusSharedStyles = () =>
	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
	fg('platform-component-visual-refresh')
		? // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
			css({
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
				[`.${StatusSharedCssClassName.STATUS_LOZENGE} > span `]: {
					border: `1px solid ${token('color.border.inverse', '#FFF')}`,
				},
			})
		: css({});
