import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedJiraCodingAgentAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="18 344 52 52"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="18" y="344" width="52" height="52" fill={primaryColor} />
			<path
				d="M41.9187 362.876L35.778 369.017L41.9187 375.157L38.5692 378.507L29.0791 369.017L38.5692 359.526L41.9187 362.876Z"
				fill={iconColor}
			/>
			<path
				d="M46.0531 362.876L52.1938 369.016L46.0532 375.157L49.4026 378.507L58.8927 369.016L49.4026 359.526L46.0531 362.876Z"
				fill={iconColor}
			/>
		</svg>
	);
}
