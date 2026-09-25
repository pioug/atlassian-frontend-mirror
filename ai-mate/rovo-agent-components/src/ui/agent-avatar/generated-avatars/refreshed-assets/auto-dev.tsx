import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedAutoDevAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 306 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="306" width="56" height="56" fill={primaryColor} />
			<defs>
				<clipPath id="clip4_311_309477">
					<rect width="42" height="42" fill="white" transform="translate(7 312.948)" />
				</clipPath>
			</defs>
			<g fill={iconColor}>
				<g clipPath="url(#clip4_311_309477)">
					<path d="M14 325.635L33.25 325.635V321.26L14 321.26V325.635Z" />
					<path d="M15.75 339.635L35 339.635V335.26L15.75 335.26L15.75 339.635Z" />
					<path d="M42 346.635H22.75V342.26H42V346.635Z" />
					<path d="M21 332.635L40.25 332.635V328.26L21 328.26V332.635Z" />
				</g>
			</g>
		</svg>
	);
}
