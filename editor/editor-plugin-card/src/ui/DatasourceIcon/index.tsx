import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, GlyphProps } from '@atlaskit/icon/types';
import { Flex, xcss } from '@atlaskit/primitives';

const IconDatasourceGlyph = (props: CustomGlyphProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="15"
			height="15"
			viewBox="0 0 15 15"
			fill="none"
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0 2C0 0.89543 0.895431 0 2 0H13C14.1046 0 15 0.895431 15 2V13C15 14.1046 14.1046 15 13 15H2C0.89543 15 0 14.1046 0 13V2ZM5 6C5 5.44772 5.44772 5 6 5L12 5C12.5523 5 13 5.44772 13 6C13 6.55229 12.5523 7 12 7L6 7C5.44772 7 5 6.55228 5 6ZM6 8C5.44772 8 5 8.44771 5 9C5 9.55228 5.44772 10 6 10L12 10C12.5523 10 13 9.55229 13 9C13 8.44772 12.5523 8 12 8L6 8ZM5 12C5 11.4477 5.44772 11 6 11L12 11C12.5523 11 13 11.4477 13 12C13 12.5523 12.5523 13 12 13L6 13C5.44772 13 5 12.5523 5 12ZM3 7C3.55228 7 4 6.55228 4 6C4 5.44772 3.55228 5 3 5C2.44772 5 2 5.44772 2 6C2 6.55228 2.44772 7 3 7ZM5 3C5 2.44772 5.44772 2 6 2L12 2C12.5523 2 13 2.44772 13 3C13 3.55229 12.5523 4 12 4L6 4C5.44772 4 5 3.55228 5 3ZM3 4C3.55228 4 4 3.55228 4 3C4 2.44772 3.55228 2 3 2C2.44772 2 2 2.44772 2 3C2 3.55228 2.44772 4 3 4ZM4 9C4 9.55229 3.55228 10 3 10C2.44772 10 2 9.55229 2 9C2 8.44771 2.44772 8 3 8C3.55228 8 4 8.44771 4 9ZM3 13C3.55228 13 4 12.5523 4 12C4 11.4477 3.55228 11 3 11C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13Z"
				fill={'currentColor'}
			/>
		</svg>
	);
};

const wrapperStyles = xcss({
	padding: 'space.050',
	justifyContent: 'center',
	alignItems: 'center',
	width: 'space.300',
	height: 'space.300',
});

export const DatasourceIcon = (props: GlyphProps) => {
	return (
		<Flex xcss={wrapperStyles}>
			<Icon glyph={IconDatasourceGlyph} {...props} />
		</Flex>
	);
};
