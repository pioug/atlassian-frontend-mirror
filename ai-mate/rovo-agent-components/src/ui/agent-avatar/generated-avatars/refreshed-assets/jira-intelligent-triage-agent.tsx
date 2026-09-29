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
			<g transform="translate(20 -46)" fill={iconColor}>
				<path d="M30.2915 293.982L24.9983 299.276L22.8765 297.154L24.5215 295.51H19.6978L17.2207 290.556L19.9043 289.214L21.5522 292.51H24.5771L22.8735 290.806L24.9946 288.685L30.2915 293.982Z" />
				<path d="M36.2922 285.732L30.9983 291.026L28.8765 288.904L30.5215 287.26H21.75V284.26H30.5772L28.8735 282.556L30.9946 280.435L36.2922 285.732Z" />
				<path d="M30.2922 277.52L24.9983 282.813L22.8765 280.692L24.5588 279.01H21.5522L17.4272 287.26H12.75V284.26H15.5728L19.6978 276.01H24.5398L22.8735 274.344L24.9946 272.223L30.2922 277.52Z" />
			</g>
		</svg>
	);
}
