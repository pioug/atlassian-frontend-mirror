import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedResearchScoutAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 838 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="838" width="56" height="56" fill={primaryColor} />
			<defs>
				<clipPath id="clip9_311_309477">
					<rect width="42" height="42" fill="white" transform="translate(7 844.948)" />
				</clipPath>
			</defs>
			<g fill={iconColor}>
				<g clipPath="url(#clip9_311_309477)">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M25.6852 852.823C31.6551 852.823 36.4945 857.663 36.4945 863.633C36.4945 865.572 35.9844 867.392 35.0906 868.965L41.4412 875.315L37.3251 879.432L30.9625 873.068C29.4017 873.943 27.6017 874.442 25.6852 874.442C19.7152 874.442 14.8752 869.603 14.875 863.633C14.875 857.663 19.7151 852.823 25.6852 852.823ZM25.7031 856.213C21.5955 856.213 18.2656 859.543 18.2656 863.651C18.2656 867.758 21.5955 871.088 25.7031 871.088C29.8108 871.088 33.1406 867.758 33.1406 863.651C33.1406 859.543 29.8108 856.213 25.7031 856.213Z"
					/>
				</g>
			</g>
		</svg>
	);
}
