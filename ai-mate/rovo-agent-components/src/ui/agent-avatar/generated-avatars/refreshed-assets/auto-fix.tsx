import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedAutoFixAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 1066 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="1066" width="56" height="56" fill={primaryColor} />
			<g fill={iconColor}>
				<path d="M41.125 1089.57C41.125 1094.41 37.2075 1098.32 32.375 1098.32C31.5735 1098.32 30.7971 1098.21 30.0596 1098.01L20.125 1107.95L14 1101.82L23.9346 1091.89C23.7328 1091.15 23.625 1090.37 23.625 1089.57C23.625 1084.74 27.5425 1080.82 32.375 1080.82C33.6589 1080.82 34.8783 1081.1 35.9767 1081.6L30.625 1086.95V1091.32H35L40.3517 1085.97C40.8485 1087.07 41.125 1088.29 41.125 1089.57Z" />
			</g>
		</svg>
	);
}
