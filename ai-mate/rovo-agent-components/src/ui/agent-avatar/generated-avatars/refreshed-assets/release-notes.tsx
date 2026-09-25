import React from 'react';

type RefreshedAvatarProps = {
	size: number;
	primaryColor: string;
	iconColor: string;
};

export default function RefreshedReleaseNotesAvatar({
	size,
	primaryColor,
	iconColor,
}: RefreshedAvatarProps): React.JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 914 56 56"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			data-testid="refreshed-agent-avatar"
		>
			<rect x="0" y="914" width="56" height="56" fill={primaryColor} />
			<defs>
				<clipPath id="clip10_311_309477">
					<rect width="42" height="42" fill="white" transform="translate(7 920.948)" />
				</clipPath>
			</defs>
			<g fill={iconColor}>
				<g clipPath="url(#clip10_311_309477)">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M40.25 929.698H15.75V954.198H40.25V929.698ZM21.8782 934.51C20.9117 934.51 20.1282 935.294 20.1282 936.26C20.1282 937.227 20.9117 938.01 21.8782 938.01C22.8447 938.01 23.6282 937.227 23.6282 936.26C23.6282 935.294 22.8447 934.51 21.8782 934.51ZM21.8782 945.885C20.9117 945.885 20.1282 946.669 20.1282 947.635C20.1282 948.602 20.9117 949.385 21.8782 949.385C22.8447 949.385 23.6282 948.602 23.6282 947.635C23.6282 946.669 22.8447 945.885 21.8782 945.885ZM20.1282 941.948C20.1282 940.981 20.9117 940.198 21.8782 940.198C22.8447 940.198 23.6282 940.981 23.6282 941.948C23.6282 942.914 22.8447 943.698 21.8782 943.698C20.9117 943.698 20.1282 942.914 20.1282 941.948ZM35 937.585L26.25 937.585V934.96L35 934.96V937.585ZM35 943.26L26.25 943.26V940.635L35 940.635V943.26ZM26.25 948.948H35V946.323H26.25V948.948Z"
					/>
				</g>
			</g>
		</svg>
	);
}
