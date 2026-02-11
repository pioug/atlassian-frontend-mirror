/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@atlaskit/css';
import { components, type IndicatorsContainerProps } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	calendarButtonInclusionStyles: { marginInlineStart: token('space.400') },
	calendarButtonOnlyInclusionStyles: { marginInlineStart: token('space.300') },
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const IndicatorsContainer: ({ showClearIndicator, ...rest }: IndicatorsContainerProps<any> & {
    showClearIndicator?: boolean;
}) => JSX.Element = ({
	showClearIndicator,
	...rest
}: IndicatorsContainerProps<any> & {
	showClearIndicator?: boolean;
}) => (
	<div
		css={[
			showClearIndicator
				? styles.calendarButtonInclusionStyles
				: styles.calendarButtonOnlyInclusionStyles,
		]}
	>
		{/* We're allowing this because this is just a passthrough component. */}
		{/* eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props */}
		<components.IndicatorsContainer {...rest} />
	</div>
);
