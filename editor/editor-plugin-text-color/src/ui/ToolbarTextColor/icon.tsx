import React from 'react';

// eslint-disable-next-line @atlassian/tangerine/import/entry-points
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import Icon from '@atlaskit/icon/base';
import TextStyleIcon from '@atlaskit/icon/core/text-style';
import type { CustomGlyphProps } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags';

const textColorGlyph = (props: CustomGlyphProps) => (
	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	<svg {...props} width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M14 12.5h-4l-.874 2.186A.5.5 0 0 1 8.66 15H7.273a.5.5 0 0 1-.456-.705l4.05-9A.5.5 0 0 1 11.323 5h1.354a.5.5 0 0 1 .456.295l4.05 9a.5.5 0 0 1-.456.705h-1.388a.5.5 0 0 1-.465-.314L14 12.5zm-.6-1.5L12 7.5 10.6 11h2.8z"
			fill="currentColor"
			fillRule="evenodd"
		/>
	</svg>
);

export const EditorTextColorIcon = () => {
	return fg('platform-custom-icon-migration') ? (
		<TextStyleIcon label="" spacing="spacious" />
	) : (
		<Icon glyph={textColorGlyph} label="" />
	);
};
