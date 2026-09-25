import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedCultureAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 458 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="458" width="56" height="56" fill={primaryColor} />
			<defs>
				<clipPath id="clip6_311_309477">
					<rect width="42" height="42" fill="white" transform="translate(7 464.948)" />
				</clipPath>
			</defs>
			<g fill={iconColor}>
				<g clipPath="url(#clip6_311_309477)">
					<path d="M28.0002 496.532C28.0002 496.532 21 490.323 19.25 487.698C17.5 485.073 17.5 484.131 17.5 482.629C17.5 481.692 17.648 480.835 17.9441 480.06C18.2472 479.277 18.6667 478.6 19.2025 478.029C19.7382 477.458 20.3621 477.018 21.0741 476.708C21.7861 476.397 22.558 476.242 23.3899 476.242C24.4261 476.242 25.3355 476.507 26.118 477.035C26.9005 477.564 27.5279 478.262 28.0002 479.129C28.4796 478.255 29.1105 477.557 29.893 477.035C30.6755 476.507 31.5814 476.242 32.6106 476.242C33.4424 476.242 34.2143 476.397 34.9263 476.708C35.6454 477.018 36.2693 477.458 36.798 478.029C37.3337 478.6 37.7497 479.277 38.0457 480.06C38.3489 480.835 38.5004 481.692 38.5004 482.629C38.5004 484.131 38.452 485.073 36.75 487.698C34.952 490.323 28.0002 496.532 28.0002 496.532Z" />
				</g>
			</g>
		</svg>
	);
}
