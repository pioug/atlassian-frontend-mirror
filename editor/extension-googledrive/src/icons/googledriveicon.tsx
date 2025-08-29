/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { token } from '@atlaskit/tokens';
import { css, jsx } from '@compiled/react';

const svgStyles = css({
	fill: token('elevation.surface', '#FFFFFF'),
	overflow: 'hidden',
	pointerEvents: 'none',
});

export default () => {
	return (
		<span data-vc={'icon-editor-googledrive'} aria-hidden={true}>
			<svg viewBox="0 0 24 24" css={[svgStyles]} aria-label="googledrive-icon" role="img">
				<path
					fill="currentcolor"
					fill-rule="evenodd"
					d="m15.81 3-6.776.068 5.846 10.126 6.777-.07zM2 14.315l3.447 5.835 5.846-10.126L7.846 4.19zm8.307.175-3.33 5.902H18.67L22 14.49z"
				/>
			</svg>
		</span>
	);
};
