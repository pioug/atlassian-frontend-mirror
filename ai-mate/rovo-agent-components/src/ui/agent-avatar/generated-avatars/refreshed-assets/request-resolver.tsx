import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedRequestResolverAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="18 604 52 52"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="18" y="604" width="52" height="52" fill={primaryColor} />
			<path
				d="M45.5 622.25L47.7545 622.25V619.25H40.2456L40.2456 622.25L42.5 622.25V623.886C38.6598 624.591 35.75 627.956 35.75 632V632.75H52.25V632C52.25 627.956 49.3402 624.591 45.5 623.886V622.25Z"
				fill={iconColor}
			/>
			<path d="M53.75 635V638H34.25V635L53.75 635Z" fill={iconColor} />
		</svg>
	);
}
