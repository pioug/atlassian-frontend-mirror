/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { token } from '@atlaskit/tokens';

const iconWrapperStyles = css({
	alignItems: 'center',
	display: 'inline-flex',
	height: '24px',
	justifyContent: 'center',
	width: '24px',
});

const svgStyles = css({
	fill: token('elevation.surface'),
	overflow: 'hidden',
	pointerEvents: 'none',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	color: '#0061FF',
	width: '24px',
	height: '24px',
});

export default (): JSX.Element => {
	return (
		<span
			data-vc={'icon-editor-dropbox'}
			aria-hidden={true}
			css={[isExperimentEnabled('platform_editor_slash_command') && iconWrapperStyles]}
		>
			{/* This colour is not ADG - it is the dropbox brand color */}
			{/* eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage */}
			<svg viewBox="0 0 24 24" css={svgStyles} aria-label="dropbox-icon" role="img">
				<path
					fill="currentcolor"
					fill-rule="evenodd"
					d="M7 3 2 6.202l5 3.202-5 3.202 5 3.202 5-3.202 5 3.202 5-3.202-5-3.202 5-3.202L17 3l-5 3.202zm5 3.202 5 3.202-5 3.202-5-3.202zm0 13.875-5-3.202 5-3.202 5 3.202z"
					clip-rule="evenodd"
				/>
			</svg>
		</span>
	);
};
