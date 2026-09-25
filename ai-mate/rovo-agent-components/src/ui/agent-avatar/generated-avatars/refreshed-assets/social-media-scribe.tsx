import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedSocialMediaScribeAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 534 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="534" width="56" height="56" fill={primaryColor} />
			<defs>
				<clipPath id="clip7_311_309477">
					<rect width="42" height="42" fill="white" transform="translate(7 540.948)" />
				</clipPath>
			</defs>
			<g fill={iconColor}>
				<g clipPath="url(#clip7_311_309477)">
					<path d="M23.802 561.595L31.5708 553.826L36.5195 558.777L28.7516 566.545L22.5998 567.747L23.802 561.595Z" />
					<path d="M41.1611 554.135L38.3756 556.921L33.427 551.97L36.2114 549.186C36.8948 548.502 38.0029 548.502 38.6863 549.186L41.1611 551.66C41.8445 552.344 41.8445 553.452 41.1611 554.135Z" />
					<path d="M28 549.698H15.75V574.198H40.25V561.948H36.75V570.698H19.25V553.198H28V549.698Z" />
				</g>
			</g>
		</svg>
	);
}
