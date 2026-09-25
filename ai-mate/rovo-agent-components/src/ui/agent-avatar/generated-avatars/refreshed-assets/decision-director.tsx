import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedDecisionDirectorAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 154 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="154" width="56" height="56" fill={primaryColor} />
			<defs>
				<clipPath id="clip2_311_309477">
					<rect width="42" height="42" fill="white" transform="translate(7 160.948)" />
				</clipPath>
			</defs>
			<g fill={iconColor}>
				<g clipPath="url(#clip2_311_309477)">
					<path d="M30.2625 177.21L38.1375 169.335L40.6124 171.81L32.7374 179.685L30.2625 177.21Z" />
					<path d="M21.7247 173.198L29.7499 181.223V194.198H26.2499V182.673L19.2498 175.673L19.2498 181.347H15.7498V169.698L27.3993 169.698L27.3993 173.198L21.7247 173.198Z" />
				</g>
			</g>
		</svg>
	);
}
