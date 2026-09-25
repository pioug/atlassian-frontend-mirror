import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedProductRequirementAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 1370 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="1370" width="56" height="56" fill={primaryColor} />
			<defs>
				<clipPath id="clip15_311_309477">
					<rect width="42" height="42" fill="white" transform="translate(7 1376.95)" />
				</clipPath>
			</defs>
			<g fill={iconColor}>
				<g clipPath="url(#clip15_311_309477)">
					<path d="M17.5 1397.95C17.5 1392.15 22.201 1387.45 28 1387.45C33.799 1387.45 38.5 1392.15 38.5 1397.95H42C42 1390.22 35.732 1383.95 28 1383.95C20.268 1383.95 14 1390.22 14 1397.95C14 1405.68 20.268 1411.95 28 1411.95V1408.45C22.201 1408.45 17.5 1403.75 17.5 1397.95Z" />
					<path d="M37.5626 1402.29C36.5127 1404.6 34.6508 1406.46 32.3441 1407.51L33.7939 1410.7C36.8698 1409.3 39.3482 1406.82 40.7481 1403.74L37.5626 1402.29Z" />
					<path d="M27.1249 1403.05L35.3624 1394.81L32.8875 1392.34L27.1249 1398.1L24.8624 1395.84L22.3875 1398.31L27.1249 1403.05Z" />
				</g>
			</g>
		</svg>
	);
}
