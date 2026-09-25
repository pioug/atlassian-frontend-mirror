import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedOpsAgentAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 762 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="762" width="56" height="56" fill={primaryColor} />
			<defs>
				<clipPath id="clip8_311_309477">
					<rect width="42" height="42" fill="white" transform="translate(7 768.948)" />
				</clipPath>
			</defs>
			<g fill={iconColor}>
				<g clipPath="url(#clip8_311_309477)">
					<path d="M19.25 777.698H15.75V802.198H40.25V798.698H19.25V795.923L25.3749 789.798L28.8749 793.298L39.7374 782.435L37.2625 779.96L28.8749 788.348L25.3749 784.848L19.25 790.973V777.698Z" />
				</g>
			</g>
		</svg>
	);
}
