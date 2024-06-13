import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import { hiddenMixin } from '../../../common/styled';

type HelpContainerProps = {
	isVisible: boolean;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const HelpContainer = styled.div<HelpContainerProps>(
	{
		display: 'flex',
		marginLeft: 'auto',
		marginRight: 0,
		flexShrink: 0,
		padding: `0 ${token('space.100', '8px')}`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> * + *': {
			marginLeft: token('space.200', '16px'),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	(props) =>
		props.isVisible
			? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css({
					visibility: 'visible',
					opacity: 1,
					transition: 'opacity 250ms cubic-bezier(0.15, 1, 0.3, 1)',
				})
			: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				css(hiddenMixin, {
					opacity: 0,
				}),
);
