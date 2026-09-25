import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedAutoReviewAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 1142 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="1142" width="56" height="56" fill={primaryColor} />
			<defs>
				<clipPath id="clip12_311_309477">
					<rect width="42" height="42" fill="white" transform="translate(7 1148.95)" />
				</clipPath>
			</defs>
			<g fill={iconColor}>
				<g clipPath="url(#clip12_311_309477)">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M24.8888 1155.95H31.111L33.0686 1161.17L38.569 1160.25L41.6801 1165.64L38.1373 1169.95L41.6794 1174.25L38.5683 1179.64L33.0686 1178.73L31.111 1183.95H24.8888L22.931 1178.73L17.4314 1179.64L14.3203 1174.25L17.862 1169.95L14.3196 1165.64L17.4307 1160.25L22.9309 1161.17L24.8888 1155.95ZM28.0003 1175.2C30.8998 1175.2 33.2503 1172.85 33.2503 1169.95C33.2503 1167.05 30.8998 1164.7 28.0003 1164.7C25.1008 1164.7 22.7503 1167.05 22.7503 1169.95C22.7503 1172.85 25.1008 1175.2 28.0003 1175.2Z"
					/>
				</g>
			</g>
		</svg>
	);
}
