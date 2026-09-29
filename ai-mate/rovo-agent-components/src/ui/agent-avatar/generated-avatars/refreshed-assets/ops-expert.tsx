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
			<g transform="translate(20 19)" fill={iconColor}>
				<path d="M28.3117 552.646C28.7405 554.246 27.7908 555.891 26.1904 556.32C24.59 556.749 22.945 555.799 22.5161 554.199L28.3117 552.646Z" />
				<path d="M20.3669 534.587C21.5672 534.265 22.801 534.978 23.1226 536.178C23.1574 536.308 23.1794 536.438 23.1906 536.568C25.6452 536.792 27.8416 538.427 28.6799 540.887L30.381 545.88L33.1367 547.471L33.719 549.644L16.3323 554.303L15.75 552.13L17.341 549.374L16.3177 544.199C15.8135 541.65 16.8978 539.136 18.9112 537.714C18.8562 537.597 18.8107 537.473 18.7759 537.343C18.4543 536.142 19.1666 534.909 20.3669 534.587Z" />
			</g>
		</svg>
	);
}
