import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedPitchPerfectorAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 1446 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="1446" width="56" height="56" fill={primaryColor} />
			<defs>
				<clipPath id="clip16_311_309477">
					<rect width="42" height="42" fill="white" transform="translate(7 1452.95)" />
				</clipPath>
			</defs>
			<g fill={iconColor}>
				<g clipPath="url(#clip16_311_309477)">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M24.5004 1482.7L40.2504 1482.7V1461.7L15.7504 1461.7V1487.95L24.5004 1482.7ZM35 1470.45H21V1466.95H35V1470.45ZM28.875 1477.45H21V1473.95H28.875V1477.45Z"
					/>
				</g>
			</g>
		</svg>
	);
}
