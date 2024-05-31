import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, GlyphProps } from '@atlaskit/icon/types';

export const DisplayModeGlyth = (props: CustomGlyphProps) => {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<rect x="4" y="5" width="4" height="14" rx="1" fill="currentColor" />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M11 5C10.4477 5 10 5.44772 10 6V9.10102C11.0503 8.02921 12.4424 7.29368 14 7.07089V6C14 5.44772 13.5523 5 13 5H11Z"
				fill="currentColor"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M17 5C16.4477 5 16 5.44772 16 6V7.07089C17.5576 7.29368 18.9497 8.02921 20 9.10102V6C20 5.44772 19.5523 5 19 5H17Z"
				fill="currentColor"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M21 14C21 17.3137 18.3137 20 15 20C11.6863 20 9 17.3137 9 14C9 10.6863 11.6863 8 15 8C18.3137 8 21 10.6863 21 14ZM12 15C12 14.4477 12.4477 14 13 14V12C13 10.8954 13.8954 10 15 10C16.1046 10 17 10.8954 17 12V14C17.5523 14 18 14.4477 18 15V17C18 17.5523 17.5523 18 17 18H13C12.4477 18 12 17.5523 12 17V15ZM16 14V12C16 11.4477 15.5523 11 15 11C14.4477 11 14 11.4477 14 12V14H16Z"
				fill="currentColor"
			/>
		</svg>
	);
};

export const DisplayModeIcon = (props: GlyphProps) => {
	return <Icon glyph={DisplayModeGlyth} {...props} />;
};
