import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedTeamConnectionAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 610 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="610" width="56" height="56" fill={primaryColor} />
			<g fill={iconColor}>
				<path d="M20.1252 636.197C23.0247 636.197 25.3752 633.847 25.3752 630.947C25.3752 628.048 23.0247 625.697 20.1252 625.697C17.2257 625.697 14.8752 628.048 14.8752 630.947C14.8752 633.847 17.2257 636.197 20.1252 636.197Z" />
				<path d="M35.8752 636.197C38.7747 636.197 41.1252 633.847 41.1252 630.947C41.1252 628.048 38.7747 625.697 35.8752 625.697C32.9757 625.697 30.6252 628.048 30.6252 630.947C30.6252 633.847 32.9757 636.197 35.8752 636.197Z" />
				<path d="M36.2115 638.822C39.4085 638.822 42.0002 641.414 42.0002 644.611V650.197H27.5627L30.8804 642.355C31.7865 640.214 33.8861 638.822 36.2115 638.822Z" />
				<path d="M14.0002 644.947V650.197H23.6252L26.2502 644.072C26.2502 641.173 23.8997 638.822 21.0002 638.822H20.1252C16.7424 638.822 14.0002 641.564 14.0002 644.947Z" />
			</g>
		</svg>
	);
}
