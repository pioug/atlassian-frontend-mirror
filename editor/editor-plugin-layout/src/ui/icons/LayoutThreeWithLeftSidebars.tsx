/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

import Icon, { type CustomGlyphProps, type IconProps } from '@atlaskit/icon';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

const LayoutThreeWithLeftSidebarsGlyph = (props: CustomGlyphProps) => {
	if (fg('platform-visual-refresh-icons')) {
		return (
			<svg
				width="16"
				height="14"
				viewBox="0 0 16 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				{...props}
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M8.5 1.375C8.5 0.615609 7.88439 0 7.125 0H6.375C5.61561 0 5 0.615608 5 1.375V12.625C5 13.3844 5.61561 14 6.375 14H7.125C7.88439 14 8.5 13.3844 8.5 12.625V1.375ZM7 1.5V12.5H6.5V1.5H7ZM16 1.37505C16 0.615655 15.3844 4.66853e-05 14.625 4.66853e-05H11.375C10.6156 4.66853e-05 10 0.615655 10 1.37505V12.625C10 13.3844 10.6156 14 11.375 14H14.625C15.3844 14 16 13.3844 16 12.625V1.37505ZM14.5 1.50005V12.5H11.5V1.50005H14.5ZM3.5 1.37505C3.5 0.615655 2.88439 4.66853e-05 2.125 4.66853e-05H1.375C0.615608 4.66853e-05 0 0.615655 0 1.37505V12.625C0 13.3844 0.615608 14 1.375 14H2.125C2.88439 14 3.5 13.3844 3.5 12.625V1.37505ZM2 1.50005V12.5H1.5V1.50005H2Z"
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
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M1 0C1.26522 0 1.51957 0.105357 1.70711 0.292893C1.89464 0.48043 2 0.734784 2 1V13C2 13.2652 1.89464 13.5196 1.70711 13.7071C1.51957 13.8946 1.26522 14 1 14C0.734784 14 0.48043 13.8946 0.292893 13.7071C0.105357 13.5196 0 13.2652 0 13V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0ZM9 0H15C15.2652 0 15.5196 0.105357 15.7071 0.292893C15.8946 0.48043 16 0.734784 16 1V13C16 13.2652 15.8946 13.5196 15.7071 13.7071C15.5196 13.8946 15.2652 14 15 14H9C8.73478 14 8.48043 13.8946 8.29289 13.7071C8.10536 13.5196 8 13.2652 8 13V1C8 0.734784 8.10536 0.48043 8.29289 0.292893C8.48043 0.105357 8.73478 0 9 0ZM5 0C5.26522 0 5.51957 0.105356 5.70711 0.292892C5.89464 0.480429 6 0.734784 6 1V13C6 13.2652 5.89464 13.5196 5.70711 13.7071C5.51957 13.8946 5.26522 14 5 14C4.73478 14 4.48043 13.8946 4.29289 13.7071C4.10536 13.5196 4 13.2652 4 13V1C4 0.734784 4.10536 0.480429 4.29289 0.292892C4.48043 0.105356 4.73478 0 5 0Z"
				fill="currentcolor"
			/>
		</svg>
	);
};

const floatingToolbarPadding = css({
	paddingRight: token('space.050', '4px'),
	paddingLeft: token('space.050', '4px'),
});

export const LayoutThreeWithLeftSidebarsIcon = (props: Omit<IconProps, 'glyph'>) => (
	<span css={floatingToolbarPadding}>
		<Icon glyph={LayoutThreeWithLeftSidebarsGlyph} {...props} />
	</span>
);
