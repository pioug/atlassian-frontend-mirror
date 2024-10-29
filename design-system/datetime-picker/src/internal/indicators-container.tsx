/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { components, type IndicatorsContainerProps } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

const calendarButtonInclusionStyles = css({ marginInlineStart: token('space.400') });
const calendarButtonOnlyInclusionStyles = css({ marginInlineStart: token('space.300') });

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const IndicatorsContainer = ({
	showClearIndicator,
	...rest
}: IndicatorsContainerProps<any> & {
	showClearIndicator?: boolean;
}) => (
	<div css={showClearIndicator ? calendarButtonInclusionStyles : calendarButtonOnlyInclusionStyles}>
		{/* We're allowing this because this is just a passthrough component. */}
		{/* eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props */}
		<components.IndicatorsContainer {...rest} />
	</div>
);
