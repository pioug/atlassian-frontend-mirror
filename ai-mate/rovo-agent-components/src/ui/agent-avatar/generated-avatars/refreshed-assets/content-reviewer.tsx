import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedContentReviewerAvatar({
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
				d="M44 35.75L46.25 34.25H56.75V53H46.25L44 54.5L41.75 53H31.25V34.25H41.75L44 35.75ZM34.25 50H41.75V37.25H34.25V50ZM46.25 50H51.5V47.75H46.25V50ZM46.25 44.75H53.75V42.5H46.25V44.75ZM46.25 39.5H53.75V37.25H46.25V39.5Z"
				fill={iconColor}
			/>
		</svg>
	);
}
