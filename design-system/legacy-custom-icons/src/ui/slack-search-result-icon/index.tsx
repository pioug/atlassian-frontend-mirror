import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const SlackSearchResultIconGlyph = (props: CustomGlyphProps) => (
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
			fillRule="evenodd"
			clipRule="evenodd"
			d="M12.7993 4C11.4726 4.00098 10.3989 5.07545 10.3999 6.39945C10.3989 7.72346 11.4736 8.79793 12.8003 8.79891H15.2006V6.40043C15.2016 5.07643 14.1269 4.00196 12.7993 4C12.8003 4 12.8003 4 12.7993 4V4ZM12.7993 10.3998H6.40034C5.07368 10.4008 3.99902 11.4753 4 12.7993C3.99804 14.1233 5.0727 15.1978 6.39936 15.1997H12.7993C14.1259 15.1988 15.2006 14.1243 15.1996 12.8003C15.2006 11.4753 14.1259 10.4008 12.7993 10.3998Z"
			fill="#36C5F0"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M28.0004 12.7993C28.0014 11.4753 26.9267 10.4008 25.6001 10.3998C24.2734 10.4008 23.1988 11.4753 23.1997 12.7993V15.1997H25.6001C26.9267 15.1988 28.0014 14.1243 28.0004 12.7993ZM21.6005 12.7993V6.39945C21.6015 5.07643 20.5278 4.00196 19.2011 4C17.8745 4.00098 16.7998 5.07545 16.8008 6.39945V12.7993C16.7988 14.1233 17.8735 15.1978 19.2001 15.1997C20.5268 15.1988 21.6015 14.1243 21.6005 12.7993Z"
			fill="#2EB67D"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M19.1992 27.9993C20.5258 27.9984 21.6005 26.9239 21.5995 25.5999C21.6005 24.2759 20.5258 23.2014 19.1992 23.2004H16.7988V25.5999C16.7978 26.9229 17.8725 27.9974 19.1992 27.9993ZM19.1992 21.5985H25.5991C26.9258 21.5975 28.0004 20.523 27.9995 19.199C28.0014 17.875 26.9268 16.8005 25.6001 16.7986H19.2002C17.8735 16.7996 16.7988 17.874 16.7998 19.198C16.7988 20.523 17.8725 21.5975 19.1992 21.5985Z"
			fill="#ECB22E"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M4 19.1998C3.99902 20.5238 5.07368 21.5982 6.40034 21.5992C7.727 21.5982 8.80166 20.5238 8.80068 19.1998V16.8003H6.40034C5.07368 16.8013 3.99902 17.8757 4 19.1998ZM10.3999 19.1998V25.5996C10.398 26.9236 11.4726 27.9981 12.7993 28.0001C14.1259 27.9991 15.2006 26.9246 15.1996 25.6006V19.2017C15.2016 17.8777 14.1269 16.8032 12.8003 16.8013C11.4726 16.8013 10.3989 17.8757 10.3999 19.1998C10.3999 19.2007 10.3999 19.1998 10.3999 19.1998Z"
			fill="#E01E5A"
		/>
	</svg>
);

/**
 * __SlackSearchResultIcon__
 */
const SlackSearchResultIcon = ({
	label,
	primaryColor,
	secondaryColor,
	size,
	testId,
}: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={SlackSearchResultIconGlyph}
	/>
);

export default SlackSearchResultIcon;
