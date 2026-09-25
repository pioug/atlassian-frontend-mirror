import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedFeatureFlagAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 1294 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="1294" width="56" height="56" fill={primaryColor} />
			<defs>
				<clipPath id="clip14_311_309477">
					<rect width="42" height="42" fill="white" transform="translate(7 1300.95)" />
				</clipPath>
			</defs>
			<g fill={iconColor}>
				<g clipPath="url(#clip14_311_309477)">
					<path d="M20.125 1310.57H16.625V1332.45H20.125V1310.57Z" />
					<path d="M22.75 1324.57V1310.57H40.25L35 1317.57L40.25 1324.57H22.75Z" />
				</g>
			</g>
		</svg>
	);
}
