import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedJiraDeliveryAgentAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 52 52"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect width="52" height="52" fill={primaryColor} />
			<path
				d="M38 14.0198L14 22.2321L23.0852 26.775L28.2501 21.6118L30.371 23.7335L25.2068 28.8961L29.7499 37.9821L38 14.0198Z"
				fill={iconColor}
			/>
		</svg>
	);
}
