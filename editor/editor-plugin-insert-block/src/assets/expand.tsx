/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const iconContainer = css({
	display: 'inline-flex',
	justifyContent: 'center',
	alignItems: 'center',
	width: '24px',
	height: '24px',
});

export default function ExpandIcon({ disabled }: { disabled?: boolean }) {
	return (
		<span css={iconContainer}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="16"
				viewBox="0 0 18 16"
				fill="none"
			>
				<path
					d="M2 2V14H16V2H2ZM2 0H16C16.5304 0 17.0391 0.210714 17.4142 0.585786C17.7893 0.960859 18 1.46957 18 2V14C18 14.5304 17.7893 15.0391 17.4142 15.4142C17.0391 15.7893 16.5304 16 16 16H2C1.46957 16 0.960859 15.7893 0.585786 15.4142C0.210714 15.0391 0 14.5304 0 14V2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0Z"
					fill={disabled ? token('color.icon.disabled', '#B3B9C4') : token('color.icon', '#44546F')}
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M5.29158 6.29294C5.10477 6.48183 5 6.73678 5 7.00244C5 7.2681 5.10477 7.52305 5.29158 7.71194L8.23058 10.6769C8.44858 10.8919 8.73058 10.9989 9.00958 10.9989C9.28858 10.9989 9.56558 10.8919 9.77858 10.6769L12.7086 7.72194C12.8951 7.53292 12.9998 7.27803 12.9998 7.01244C12.9998 6.74686 12.8951 6.49196 12.7086 6.30294C12.6167 6.20976 12.5073 6.13576 12.3866 6.08525C12.2659 6.03474 12.1364 6.00873 12.0056 6.00873C11.8748 6.00873 11.7452 6.03474 11.6245 6.08525C11.5039 6.13576 11.3944 6.20976 11.3026 6.30294L9.00458 8.61994L6.69758 6.29294C6.60554 6.20012 6.49604 6.12644 6.37538 6.07617C6.25472 6.02589 6.1253 6 5.99458 6C5.86386 6 5.73444 6.02589 5.61378 6.07617C5.49312 6.12644 5.38362 6.20012 5.29158 6.29294Z"
					fill={disabled ? token('color.icon.disabled', '#B3B9C4') : token('color.icon', '#44546F')}
				/>
			</svg>
		</span>
	);
}
