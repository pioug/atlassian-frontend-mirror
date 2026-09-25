import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedHireWriterAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 686 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="686" width="56" height="56" fill={primaryColor} />
			<g fill={iconColor}>
				<path d="M28 703.448C22.201 703.448 17.5 708.149 17.5 713.948C17.5 717.437 19.2036 720.527 21.8229 722.436C22.7057 719.873 25.137 718.031 28 718.031C30.8629 718.031 33.2934 719.873 34.1763 722.436C36.7958 720.527 38.5 717.437 38.5 713.948H42C42 721.68 35.732 727.948 28 727.948C20.268 727.948 14 721.68 14 713.948C14 706.216 20.268 699.948 28 699.948V703.448Z" />
				<path d="M28 708.231C30.2552 708.231 32.0836 710.06 32.0836 712.315C32.0834 714.57 30.255 716.398 28 716.398C25.745 716.398 23.9166 714.57 23.9164 712.315C23.9164 710.06 25.7448 708.231 28 708.231Z" />
				<path d="M33.7943 701.2C36.8699 702.599 39.3483 705.078 40.7482 708.153L37.5626 709.603C36.5128 707.297 34.6509 705.435 32.3442 704.385L33.7943 701.2Z" />
			</g>
		</svg>
	);
}
