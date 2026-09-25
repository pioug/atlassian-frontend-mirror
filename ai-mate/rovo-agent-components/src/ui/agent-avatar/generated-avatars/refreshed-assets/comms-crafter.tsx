import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedCommsCrafterAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 230 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="230" width="56" height="56" fill={primaryColor} />
			<defs>
				<clipPath id="clip3_311_309477">
					<rect width="42" height="42" fill="white" transform="translate(7 236.948)" />
				</clipPath>
			</defs>
			<g fill={iconColor}>
				<g clipPath="url(#clip3_311_309477)">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M16.6252 243.948H25.3752L33.2502 251.823V265.823H16.6252V243.948ZM23.6252 253.573V246.573L30.6252 253.573H23.6252Z"
					/>
					<path d="M35.8751 252.698V268.448H21.8751V271.948H39.3751V252.698H35.8751Z" />
				</g>
			</g>
		</svg>
	);
}
