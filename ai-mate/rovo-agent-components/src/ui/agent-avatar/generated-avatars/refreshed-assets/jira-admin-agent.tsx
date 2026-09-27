import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedJiraAdminAgentAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="18 19 52 52"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="18" y="19" width="52" height="52" fill={primaryColor} />
			<path
				d="M45.5 38C45.5 40.4853 43.4853 42.5 41 42.5C38.5147 42.5 36.5 40.4853 36.5 38C36.5 35.5147 38.5147 33.5 41 33.5C43.4853 33.5 45.5 35.5147 45.5 38Z"
				fill={iconColor}
			/>
			<path
				d="M35 50.75C35 47.4363 37.6863 44.75 41 44.75C44.3137 44.75 47 47.4363 47 50.75V54.5H35V50.75Z"
				fill={iconColor}
			/>
			<path
				d="M49.2499 47.6213L56.3105 40.5606L54.1892 38.4393L49.2499 43.3786L47.3106 41.4393L45.1893 43.5606L49.2499 47.6213Z"
				fill={iconColor}
			/>
		</svg>
	);
}
