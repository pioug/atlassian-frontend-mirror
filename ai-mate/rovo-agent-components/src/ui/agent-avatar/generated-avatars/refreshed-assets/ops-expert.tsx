import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedOpsExpertAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="18 539 52 52"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="18" y="539" width="52" height="52" fill={primaryColor} />
			<path
				d="M43.5869 553.312L46.2888 566.733L47.8599 561.89H56V565.64H50.5867L47.6584 574.668H44.0381L41.4028 561.535L40.1716 565.64H32V561.89H37.3811L39.9541 553.312H43.5869Z"
				fill={iconColor}
			/>
		</svg>
	);
}
