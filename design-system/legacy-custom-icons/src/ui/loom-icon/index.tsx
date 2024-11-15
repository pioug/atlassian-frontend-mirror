import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const LoomIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="24"
		viewBox="2 2 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<g clipPath="url(#clip0_271_181644)">
			<path
				d="M24.0115 12.9534H17.9154L23.1946 9.90666L22.1477 8.09334L16.8678 11.14L19.9151 5.86334L18.1014 4.81666L15.0534 10.092V4H12.9581V10.0927L9.91009 4.81666L8.09565 5.86334L11.1431 11.1387L5.86445 8.09334L4.81687 9.90666L10.0961 12.9534H4V15.0473H10.0955L4.81687 18.094L5.86378 19.9073L11.1437 16.8607L8.09565 22.1373L9.90943 23.184L12.9581 17.908V24H15.0534V17.7773L18.1574 23.1507L19.8585 22.1693L16.7537 16.7947L22.1463 19.9066L23.194 18.0934L17.9154 15.0466H24.0108V12.9534H24.0115ZM14.0057 16.8466C13.6317 16.8467 13.2613 16.7731 12.9158 16.6301C12.5703 16.487 12.2563 16.2773 11.9918 16.0129C11.7273 15.7486 11.5175 15.4347 11.3743 15.0893C11.2311 14.7438 11.1575 14.3736 11.1574 13.9997C11.1573 13.6257 11.2309 13.2554 11.374 12.91C11.5172 12.5646 11.7269 12.2506 11.9913 11.9862C12.2557 11.7218 12.5696 11.512 12.9152 11.3689C13.2607 11.2257 13.631 11.1521 14.0051 11.152C14.7604 11.1519 15.4848 11.4518 16.019 11.9857C16.5532 12.5197 16.8534 13.2439 16.8534 13.999C16.8535 14.7541 16.5536 15.4784 16.0195 16.0125C15.4854 16.5466 14.761 16.8466 14.0057 16.8466Z"
				fill="currentColor"
			/>
		</g>
		<defs>
			<clipPath id="clip0_271_181644">
				<rect width="20" height="20" fill="white" transform="translate(4 4)" />
			</clipPath>
		</defs>
	</svg>
);

/**
 * __LoomIcon__
 */
const LoomIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={LoomIconGlyph}
	/>
);

export default LoomIcon;
