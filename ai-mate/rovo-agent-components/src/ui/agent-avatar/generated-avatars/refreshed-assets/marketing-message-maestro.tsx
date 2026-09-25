import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedMarketingMessageMaestroAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 1218 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="1218" width="56" height="56" fill={primaryColor} />
			<defs>
				<clipPath id="clip13_311_309477">
					<rect width="42" height="42" fill="white" transform="translate(7 1224.95)" />
				</clipPath>
			</defs>
			<g fill={iconColor}>
				<g clipPath="url(#clip13_311_309477)">
					<path d="M42 1235.45H14V1238.79L28.0001 1246.57L42 1238.79V1235.45Z" />
					<path d="M42 1242.8L28.0001 1250.57L14 1242.8V1256.45H42V1242.8Z" />
				</g>
			</g>
		</svg>
	);
}
