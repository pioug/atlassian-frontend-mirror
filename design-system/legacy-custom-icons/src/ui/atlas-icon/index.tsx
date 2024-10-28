import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const AtlasIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="32"
		height="32"
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			d="M16 30.9998C7.72688 30.9998 1 24.3061 1 16.0739C1 7.84173 7.72688 1.14808 16 1.14808V3.52472C9.04227 3.52472 3.38844 9.15062 3.38844 16.0739C3.38844 22.9972 9.04227 28.6231 16 28.6231V30.9998Z"
			fill="url(#paint0_linear_5_133)"
		/>
		<path
			d="M16.0001 30.9997V28.623C22.9577 28.623 28.6115 22.9971 28.6115 16.0738H31C31 24.306 24.273 30.9997 16.0001 30.9997Z"
			fill="url(#paint1_linear_5_133)"
		/>
		<path
			d="M31 16.0738H28.6115C28.6115 9.15051 22.9577 3.52459 16.0001 3.52459V1.14793C24.273 1.14793 31 7.8416 31 16.0738Z"
			fill="url(#paint2_linear_5_133)"
		/>
		<path
			d="M22.3922 20.6436C20.7999 20.3335 19.5422 19.7709 17.4538 18.8294C16.8769 18.5768 16.2422 18.2898 15.5152 17.9684C15.0769 17.7732 14.673 17.6009 14.2692 17.4287C11.1192 16.0394 9.38839 15.2817 7.26533 15.2817C5.77687 15.2817 4.65764 15.6836 4.03457 16.4413C3.60765 16.9465 3.43458 17.6009 3.5615 18.2324L1.2192 18.6801C0.965352 17.3483 1.3115 15.9821 2.18842 14.9257C2.94996 14.0073 4.44995 12.905 7.26533 12.905C9.89609 12.905 12.0192 13.8465 15.2384 15.2587C15.6307 15.4309 16.0345 15.6146 16.473 15.7984C17.2114 16.1198 17.8576 16.4068 18.4345 16.671C20.4307 17.5665 21.5268 18.0602 22.8537 18.3128L22.3922 20.6436Z"
			fill="url(#paint3_linear_5_133)"
		/>
		<path
			d="M24.723 20.8732C23.9268 20.8732 23.1652 20.8044 22.3922 20.6437L22.8537 18.3129C23.4768 18.4392 24.0883 18.4966 24.723 18.4966C26.1999 18.4966 27.319 18.1292 27.9652 17.4288C28.6113 16.7284 28.6344 15.8789 28.5999 15.431L30.9768 15.2243C31.1036 16.6711 30.6653 18.0258 29.7306 19.0362C28.9575 19.8743 27.4691 20.8732 24.723 20.8732Z"
			fill="url(#paint4_linear_5_133)"
		/>
		<path
			d="M15.9998 31V28.6233C19.4268 28.6233 21.469 25.1444 21.469 19.3234C21.469 13.5023 19.3921 8.62274 15.1345 4.11053L16.8767 2.48017C21.5729 7.45162 23.8575 12.9627 23.8575 19.3234C23.8575 26.5222 20.8459 31 15.9998 31Z"
			fill="url(#paint5_linear_5_133)"
		/>
		<path
			d="M16 31C10.8423 31 7.88844 26.8207 7.88844 19.5301C7.88844 11.0223 11.6269 6.269 15.1231 2.49161L16.8769 4.099C12.8038 8.50787 10.2768 12.6182 10.2768 19.5301C10.2768 27.0504 13.3923 28.6233 16 28.6233V31Z"
			fill="url(#paint6_linear_5_133)"
		/>
		<path
			d="M9.60754 17.3139C11.1497 17.3139 12.3998 16.0698 12.3998 14.5353C12.3998 13.0008 11.1497 11.7568 9.60754 11.7568C8.06542 11.7568 6.81526 13.0008 6.81526 14.5353C6.81526 16.0698 8.06542 17.3139 9.60754 17.3139Z"
			fill="#2684FF"
		/>
		<path
			d="M22.5191 22.1017C24.0613 22.1017 25.3114 20.8577 25.3114 19.3233C25.3114 17.7887 24.0613 16.5448 22.5191 16.5448C20.9769 16.5448 19.7268 17.7887 19.7268 19.3233C19.7268 20.8577 20.9769 22.1017 22.5191 22.1017Z"
			fill="#2684FF"
		/>
		<path
			d="M15.9998 5.557C17.542 5.557 18.7922 4.31302 18.7922 2.7785C18.7922 1.24398 17.542 0 15.9998 0C14.4577 0 13.2075 1.24398 13.2075 2.7785C13.2075 4.31302 14.4577 5.557 15.9998 5.557Z"
			fill="#2684FF"
		/>
		<defs>
			<linearGradient
				id="paint0_linear_5_133"
				x1="9.36539"
				y1="31.2523"
				x2="8.23428"
				y2="1.43467"
				gradientUnits="userSpaceOnUse"
			>
				<stop offset="0.5" stopColor="#2684FF" />
				<stop offset="1" stopColor="#0052CC" />
			</linearGradient>
			<linearGradient
				id="paint1_linear_5_133"
				x1="31.2538"
				y1="17.3827"
				x2="18.041"
				y2="31.111"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#0E65DF" />
				<stop offset="1" stopColor="#0255CF" />
			</linearGradient>
			<linearGradient
				id="paint2_linear_5_133"
				x1="23.5"
				y1="1.14793"
				x2="23.5"
				y2="16.0738"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#2684FF" />
				<stop offset="0.59" stopColor="#156EE8" />
				<stop offset="1" stopColor="#0E65DF" />
			</linearGradient>
			<linearGradient
				id="paint3_linear_5_133"
				x1="1.14997"
				y1="16.7743"
				x2="22.8537"
				y2="16.7743"
				gradientUnits="userSpaceOnUse"
			>
				<stop offset="0.26" stopColor="#2684FF" />
				<stop offset="1" stopColor="#0E65DF" />
			</linearGradient>
			<linearGradient
				id="paint4_linear_5_133"
				x1="24.7922"
				y1="20.2647"
				x2="29.5095"
				y2="15.224"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#0052CC" />
				<stop offset="1" stopColor="#0E65DF" />
			</linearGradient>
			<linearGradient
				id="paint5_linear_5_133"
				x1="19.496"
				y1="31"
				x2="19.496"
				y2="2.48017"
				gradientUnits="userSpaceOnUse"
			>
				<stop offset="0.36" stopColor="#2684FF" />
				<stop offset="1" stopColor="#0052CC" />
			</linearGradient>
			<linearGradient
				id="paint6_linear_5_133"
				x1="12.3768"
				y1="31"
				x2="12.3768"
				y2="2.49161"
				gradientUnits="userSpaceOnUse"
			>
				<stop offset="0.06" stopColor="#2684FF" />
				<stop offset="0.58" stopColor="#0052CC" />
				<stop offset="1" stopColor="#2684FF" />
			</linearGradient>
		</defs>
	</svg>
);

/**
 * __AtlasIcon__
 */
const AtlasIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={AtlasIconGlyph}
	/>
);

export default AtlasIcon;
