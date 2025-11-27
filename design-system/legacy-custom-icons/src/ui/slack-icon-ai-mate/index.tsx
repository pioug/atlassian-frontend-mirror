import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const SlackIconAiMateGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<g clipPath="url(#clip0_271_181639)">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M9.33321 2C8.22767 2.00082 7.33294 2.89621 7.33375 3.99954C7.33294 5.10288 8.22849 5.99827 9.33403 5.99909H11.3343V4.00036C11.3351 2.89702 10.4396 2.00163 9.33321 2C9.33403 2 9.33403 2 9.33321 2V2ZM9.33321 7.33321H4.00077C2.89522 7.33402 1.99967 8.22941 2.00049 9.33275C1.99886 10.4361 2.89441 11.3315 3.99995 11.3331H9.33321C10.4388 11.3323 11.3343 10.4369 11.3335 9.33357C11.3343 8.22941 10.4388 7.33402 9.33321 7.33321V7.33321Z"
				fill="#36C5F0"
			></path>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M21.9998 9.33275C22.0006 8.22941 21.1051 7.33402 19.9995 7.33321C18.894 7.33402 17.9984 8.22941 17.9992 9.33275V11.3331H19.9995C21.1051 11.3323 22.0006 10.4369 21.9998 9.33275ZM16.6665 9.33275V3.99954C16.6673 2.89702 15.7726 2.00163 14.667 2C13.5615 2.00082 12.6659 2.89621 12.6668 3.99954V9.33275C12.6651 10.4361 13.5607 11.3315 14.6662 11.3331C15.7718 11.3323 16.6673 10.4369 16.6665 9.33275Z"
				fill="#2EB67D"
			></path>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M14.6665 21.9995C15.7721 21.9987 16.6677 21.1033 16.6668 19.9999C16.6677 18.8966 15.7721 18.0012 14.6665 18.0004H12.6663V19.9999C12.6654 21.1025 13.561 21.9979 14.6665 21.9995ZM14.6665 16.6654H19.9998C21.1054 16.6646 22.0009 15.7692 22.0001 14.6659C22.0018 13.5626 21.1062 12.6672 20.0006 12.6655H14.6674C13.5618 12.6663 12.6663 13.5617 12.6671 14.6651C12.6663 15.7692 13.561 16.6646 14.6665 16.6654V16.6654Z"
				fill="#ECB22E"
			></path>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M2.00073 14.6663C1.99992 15.7696 2.89547 16.665 4.00102 16.6659C5.10657 16.665 6.00212 15.7696 6.0013 14.6663V12.6667H4.00102C2.89547 12.6676 1.99992 13.563 2.00073 14.6663ZM7.33401 14.6663V19.9995C7.33237 21.1029 8.22792 21.9983 9.33347 21.9999C10.439 21.9991 11.3346 21.1037 11.3338 20.0003V14.6679C11.3354 13.5646 10.4398 12.6692 9.33429 12.6676C8.22792 12.6676 7.33319 13.563 7.33401 14.6663C7.33401 14.6671 7.33401 14.6663 7.33401 14.6663Z"
				fill="#E01E5A"
			></path>
		</g>
		<defs>
			<clipPath id="clip0_271_181639">
				<rect width="20" height="20" fill="white" transform="translate(2 2)"></rect>
			</clipPath>
		</defs>
	</svg>
);

/**
 * __SlackIconAiMate__
 */
const SlackIconAiMate = ({
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
		glyph={SlackIconAiMateGlyph}
	/>
);

export default SlackIconAiMate;
