import Icon, { type CustomGlyphProps, type IconProps } from '@atlaskit/icon';
import { token } from '@atlaskit/tokens';
import React from 'react';

const GoalGlyph = (props: CustomGlyphProps) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M12.6667 8C12.6667 10.5773 10.5773 12.6667 8 12.6667C5.42267 12.6667 3.33333 10.5773 3.33333 8C3.33333 5.42267 5.42267 3.33333 8 3.33333C10.5773 3.33333 12.6667 5.42267 12.6667 8ZM14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8ZM9.33333 8C9.33333 8.73638 8.73638 9.33333 8 9.33333C7.26362 9.33333 6.66667 8.73638 6.66667 8C6.66667 7.26362 7.26362 6.66667 8 6.66667C8.73638 6.66667 9.33333 7.26362 9.33333 8ZM10.6667 8C10.6667 9.47276 9.47276 10.6667 8 10.6667C6.52724 10.6667 5.33333 9.47276 5.33333 8C5.33333 6.52724 6.52724 5.33333 8 5.33333C9.47276 5.33333 10.6667 6.52724 10.6667 8Z"
			fill={token('color.icon', '#44546F')}
		/>
	</svg>
);

export const GoalIcon = (props: IconProps) => <Icon glyph={GoalGlyph} {...props} />;
