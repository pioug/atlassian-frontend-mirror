import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedCustomerInsightAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 2 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="2" width="56" height="56" fill={primaryColor} />
			<defs>
				<clipPath id="clip0_311_309477">
					<rect width="42" height="42" fill="white" transform="translate(7 8.94769)" />
				</clipPath>
			</defs>
			<g fill={iconColor}>
				<g clipPath="url(#clip0_311_309477)">
					<path d="M18.375 25.5727C18.375 29.3374 20.5364 32.5972 23.686 34.1791L23.9167 36.9477H32.0833L32.3141 34.1791C35.4636 32.5972 37.625 29.3374 37.625 25.5727C37.625 20.257 33.3158 15.9477 28 15.9477C22.6843 15.9477 18.375 20.257 18.375 25.5727Z" />
					<path d="M31.8646 39.5727H24.1354L24.5 43.9477H31.5L31.8646 39.5727Z" />
				</g>
			</g>
		</svg>
	);
}
