import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedBacklogBuddyAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 78 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="78" width="56" height="56" fill={primaryColor} />
			<defs>
				<clipPath id="clip1_311_309477">
					<rect width="42" height="42" fill="white" transform="translate(7 84.9477)" />
				</clipPath>
			</defs>
			<g fill={iconColor}>
				<g clipPath="url(#clip1_311_309477)">
					<path d="M39.375 98.0727C39.375 96.1397 37.808 94.5727 35.875 94.5727L20.125 94.5727C18.192 94.5727 16.625 96.1397 16.625 98.0727L16.625 99.8227L39.375 99.8227V98.0727Z" />
					<path d="M39.375 103.323L16.625 103.323L16.625 108.573H39.375V103.323Z" />
					<path d="M39.375 112.073H16.625L16.625 113.823C16.625 115.756 18.192 117.323 20.125 117.323H35.875C37.808 117.323 39.375 115.756 39.375 113.823V112.073Z" />
				</g>
			</g>
		</svg>
	);
}
