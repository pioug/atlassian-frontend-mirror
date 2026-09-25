import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedMyUserManualAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 990 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="990" width="56" height="56" fill={primaryColor} />
			<defs>
				<clipPath id="clip11_311_309477">
					<rect width="42" height="42" fill="white" transform="translate(7 996.948)" />
				</clipPath>
			</defs>
			<g fill={iconColor}>
				<g clipPath="url(#clip11_311_309477)">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M34.125 1028.45L40.25 1030.2V1007.45L34.125 1005.7L28 1007.45L21.875 1005.7L15.75 1007.45V1030.2L21.875 1028.45L28 1030.2L34.125 1028.45ZM34.125 1025.72V1008.43L37.625 1009.43V1026.72L34.125 1025.72ZM27.125 1009.93V1027.22L23.625 1026.22V1008.93L27.125 1009.93Z"
					/>
				</g>
			</g>
		</svg>
	);
}
