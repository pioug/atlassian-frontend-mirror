/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import SVG from '@atlaskit/icon/svg';
import { fg } from '@atlaskit/platform-feature-flags';

const svgStyles = css({
	fill: token('elevation.surface'),
	overflow: 'hidden',
	pointerEvents: 'none',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	color: '#0061FF',
	width: '24px',
	height: '24px',
});

export default () => {
	return (
		<span data-vc={'icon-editor-dropbox'} aria-hidden={true}>
			{/* This colour is not ADG - it is the dropbox brand color */}
			{fg('platform-custom-icon-migration') ? (
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
				<svg viewBox="0 0 24 24" css={svgStyles} aria-label="dropbox-icon" role="img">
					<path
						fill="currentcolor"
						fill-rule="evenodd"
						d="M7 3 2 6.202l5 3.202-5 3.202 5 3.202 5-3.202 5 3.202 5-3.202-5-3.202 5-3.202L17 3l-5 3.202zm5 3.202 5 3.202-5 3.202-5-3.202zm0 13.875-5-3.202 5-3.202 5 3.202z"
						clip-rule="evenodd"
					/>
				</svg>
			) : (
				// eslint-disable-next-line @atlaskit/design-system/no-custom-icons, @atlaskit/design-system/ensure-design-token-usage
				<SVG primaryColor="#0061FF" label="dropbox-icon">
					<path
						fill="currentcolor"
						fill-rule="evenodd"
						d="M7 3 2 6.202l5 3.202-5 3.202 5 3.202 5-3.202 5 3.202 5-3.202-5-3.202 5-3.202L17 3l-5 3.202zm5 3.202 5 3.202-5 3.202-5-3.202zm0 13.875-5-3.202 5-3.202 5 3.202z"
						clip-rule="evenodd"
					/>
				</SVG>
			)}
		</span>
	);
};
