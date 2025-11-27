import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const IncidentIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			fill="currentColor"
			fillRule="evenodd"
			d="M13.5536 3.6456C13.3256 2.96 12.7015 2.5 12.0005 2.5c-.7011 0-1.3252.46-1.5522 1.1456L8.9712 8.0904h6.0596l-1.4772-4.4448Zm2.2791 6.8596 2.0202 6.0815c.163.4911.5491.8674 1.0331 1.007.6591.1903 1.1151.8116 1.1151 1.5188 0 1.1032-.865 1.9976-1.9322 1.9976H5.9317c-1.0671 0-1.9322-.8944-1.9322-1.9976 0-.7072.456-1.3285 1.115-1.5188.4841-.1396.8702-.5159 1.0342-1.007l2.0192-6.0815h7.6648Zm-1.4287 2.0682H9.5976l-1.5572 4.6857c-.242.7278-.696 1.3482-1.2871 1.7835h10.495c-.591-.4353-1.0451-1.0557-1.2871-1.7835l-1.5572-4.6857Zm-7.5971-6.811-.7436-.5705a.892.892 0 0 0-.3123-.1549.8946.8946 0 0 0-.7764 1.5737l.7428.571a.8946.8946 0 1 0 1.0895-1.4192ZM5.3487 8.5577l-.9292.1223a.8954.8954 0 0 0-.569.352.8954.8954 0 0 0 .8025 1.4231l.9289-.1231a.8953.8953 0 0 0-.2332-1.7743Zm11.824-1.594a.9.9 0 0 0 1.2516.2269l.7752-.5385a.9007.9007 0 0 0 .1981-1.2331.9008.9008 0 0 0-1.2244-.2463l-.7757.5392a.8996.8996 0 0 0-.372.5797.8982.8982 0 0 0 .1472.6722Zm.5011 2.3113a.9028.9028 0 0 0 .7257 1.0465l.9285.1668a.9011.9011 0 0 0 .6733-.1465.901.901 0 0 0 .3662-.931.9004.9004 0 0 0-.7199-.6944l-.9273-.1671a.9003.9003 0 0 0-1.0465.7257Z"
			clipRule="evenodd"
		/>
	</svg>
);

/**
 * __IncidentIcon__
 */
const IncidentIcon = ({
	label,
	primaryColor,
	secondaryColor,
	size,
	testId,
}: IconProps): React.JSX.Element => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={IncidentIconGlyph}
	/>
);

export default IncidentIcon;
