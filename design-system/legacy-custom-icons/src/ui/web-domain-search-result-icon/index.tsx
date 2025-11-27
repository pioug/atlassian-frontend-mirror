import React from 'react';

import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

import Icon from '../../icon';

const WebDomainSearchResultIconGlyph = (props: CustomGlyphProps) => (
	<svg
		width="24"
		height="25"
		viewBox="0 0 24 25"
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
			d="M5.5428 12.0273H8.26521C8.33797 10.243 8.6684 8.61411 9.18567 7.36406C9.26662 7.16841 9.35328 6.97932 9.44572 6.79843C7.34499 7.69706 5.81358 9.67046 5.5428 12.0273ZM12 4.77734C7.58172 4.77734 4 8.35907 4 12.7773C4 17.1956 7.58172 20.7773 12 20.7773C16.4183 20.7773 20 17.1956 20 12.7773C20 8.35907 16.4183 4.77734 12 4.77734ZM12 6.27734C11.849 6.27734 11.6359 6.34815 11.3684 6.62157C11.0985 6.89748 10.8208 7.3355 10.5717 7.93758C10.1403 8.98016 9.83856 10.4072 9.76656 12.0273H14.2334C14.1614 10.4072 13.8597 8.98016 13.4283 7.93758C13.1792 7.3355 12.9015 6.89748 12.6316 6.62157C12.3641 6.34815 12.151 6.27734 12 6.27734ZM15.7348 12.0273C15.662 10.243 15.3316 8.61411 14.8143 7.36406C14.7334 7.16841 14.6467 6.97931 14.5543 6.79843C16.655 7.69706 18.1864 9.67046 18.4572 12.0273H15.7348ZM14.2334 13.5273H9.76656C9.83856 15.1475 10.1403 16.5745 10.5717 17.6171C10.8208 18.2192 11.0985 18.6572 11.3684 18.9331C11.6359 19.2065 11.849 19.2773 12 19.2773C12.151 19.2773 12.3641 19.2065 12.6316 18.9331C12.9015 18.6572 13.1792 18.2192 13.4283 17.6171C13.8597 16.5745 14.1614 15.1475 14.2334 13.5273ZM14.5543 18.7563C14.6467 18.5754 14.7334 18.3863 14.8143 18.1906C15.3316 16.9406 15.662 15.3117 15.7348 13.5273H18.4572C18.1864 15.8842 16.655 17.8576 14.5543 18.7563ZM9.44572 18.7563C9.35328 18.5754 9.26662 18.3863 9.18567 18.1906C8.6684 16.9406 8.33797 15.3117 8.26521 13.5273H5.5428C5.81358 15.8842 7.34499 17.8576 9.44572 18.7563Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * __WebDomainSearchResultIcon__
 */
const WebDomainSearchResultIcon = ({
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
		glyph={WebDomainSearchResultIconGlyph}
	/>
);

export default WebDomainSearchResultIcon;
