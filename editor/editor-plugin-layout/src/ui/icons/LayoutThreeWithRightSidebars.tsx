/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

import Icon, { type CustomGlyphProps, type IconProps } from '@atlaskit/icon';
import LayoutThreeColumnsSidebarsRightIcon from '@atlaskit/icon-lab/core/layout-three-columns-sidebars-right';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

const LayoutThreeWithRightSidebarsGlyph = (props: CustomGlyphProps) => {
	if (fg('platform-visual-refresh-icons')) {
		return (
			<svg
				width="16"
				height="14"
				viewBox="0 0 16 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...props}
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M7.5 1.375C7.5 0.615609 8.11561 0 8.875 0H9.625C10.3844 0 11 0.615608 11 1.375V12.625C11 13.3844 10.3844 14 9.625 14H8.875C8.11561 14 7.5 13.3844 7.5 12.625V1.375ZM9 1.5V12.5H9.5V1.5H9ZM0 1.37505C0 0.615655 0.615608 4.66853e-05 1.375 4.66853e-05H4.625C5.38439 4.66853e-05 6 0.615655 6 1.37505V12.625C6 13.3844 5.38439 14 4.625 14H1.375C0.615608 14 0 13.3844 0 12.625V1.37505ZM1.5 1.50005V12.5H4.5V1.50005H1.5ZM12.5 1.37505C12.5 0.615655 13.1156 4.66853e-05 13.875 4.66853e-05H14.625C15.3844 4.66853e-05 16 0.615655 16 1.37505V12.625C16 13.3844 15.3844 14 14.625 14H13.875C13.1156 14 12.5 13.3844 12.5 12.625V1.37505ZM14 1.50005V12.5H14.5V1.50005H14Z"
					fill="currentcolor"
				/>
			</svg>
		);
	}

	return (
		<svg
			width="16"
			height="14"
			viewBox="0 0 16 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M11 0C11.2652 0 11.5196 0.105357 11.7071 0.292893C11.8946 0.48043 12 0.734784 12 1V13C12 13.2652 11.8946 13.5196 11.7071 13.7071C11.5196 13.8946 11.2652 14 11 14C10.7348 14 10.4804 13.8946 10.2929 13.7071C10.1054 13.5196 10 13.2652 10 13V1C10 0.734784 10.1054 0.48043 10.2929 0.292893C10.4804 0.105357 10.7348 0 11 0ZM1 0H7C7.26522 0 7.51957 0.105357 7.70711 0.292893C7.89464 0.48043 8 0.734784 8 1V13C8 13.2652 7.89464 13.5196 7.70711 13.7071C7.51957 13.8946 7.26522 14 7 14H1C0.734784 14 0.48043 13.8946 0.292893 13.7071C0.105357 13.5196 0 13.2652 0 13V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0ZM15 0C15.2652 0 15.5196 0.105357 15.7071 0.292893C15.8946 0.48043 16 0.734784 16 1V13C16 13.2652 15.8946 13.5196 15.7071 13.7071C15.5196 13.8946 15.2652 14 15 14C14.7348 14 14.4804 13.8946 14.2929 13.7071C14.1054 13.5196 14 13.2652 14 13V1C14 0.734784 14.1054 0.48043 14.2929 0.292893C14.4804 0.105357 14.7348 0 15 0Z"
				fill="currentcolor"
			/>
		</svg>
	);
};

const floatingToolbarPadding = css({
	paddingRight: token('space.050', '4px'),
	paddingLeft: token('space.050', '4px'),
});

export const LayoutThreeWithRightSidebarsIcon = (props: Omit<IconProps, 'glyph' | 'size'>) => {
	if (fg('platform-custom-icon-migration')) {
		// eslint-disable-next-line react/jsx-props-no-spreading
		return <LayoutThreeColumnsSidebarsRightIcon {...props} />;
	}

	return (
		<span css={floatingToolbarPadding}>
			<Icon
				glyph={LayoutThreeWithRightSidebarsGlyph}
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...props}
			/>
		</span>
	);
};
