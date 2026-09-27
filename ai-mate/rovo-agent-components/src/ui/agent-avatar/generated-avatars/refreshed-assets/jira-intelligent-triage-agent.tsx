import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedJiraIntelligentTriageAgentAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="18 214 52 52"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="18" y="214" width="52" height="52" fill={primaryColor} />
			<path
				d="M32.75 229.25H50V243.5H32.75V229.25ZM47.3106 234.061L40.2499 241.121L36.1893 237.061L38.3106 234.939L40.2499 236.879L45.1893 231.939L47.3106 234.061Z"
				fill={iconColor}
			/>
			<path d="M52.25 233.75V245.75H40.25V248.75H55.25V233.75H52.25Z" fill={iconColor} />
		</svg>
	);
}
