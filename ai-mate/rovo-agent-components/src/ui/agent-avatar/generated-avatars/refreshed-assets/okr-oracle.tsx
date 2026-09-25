import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedOkrOracleAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 382 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="382" width="56" height="56" fill={primaryColor} />
			<defs>
				<clipPath id="clip5_311_309477">
					<rect width="42" height="42" fill="white" transform="translate(7 388.948)" />
				</clipPath>
			</defs>
			<g fill={iconColor}>
				<g clipPath="url(#clip5_311_309477)">
					<path d="M15.75 399.448H40.25V416.073H29.75L29.75 418.698H35V422.198H21V418.698H26.25V416.073H15.75V399.448Z" />
				</g>
			</g>
		</svg>
	);
}
