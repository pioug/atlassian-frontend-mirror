import React from 'react';

import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../constants';
import type { LogoProps } from '../types';
import { getColorsFromAppearance } from '../utils';
import Wrapper from '../wrapper';

const svg = ({ appearance, iconColor, textColor }: LogoProps, colorMode: string | undefined) => {
	let colors = {
		iconColor,
		textColor,
	};

	if (appearance) {
		colors = getColorsFromAppearance(appearance, colorMode);
	}
	return `<svg
      fill="none"
      height="32"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 299 32"
      focusable="false"
      aria-hidden="true"
    >
      <path
        d="M298.505 21.163c0 2.545-1.656 4.477-5.765 4.477-2.3 0-4.171-.521-5.336-1.135v-2.79c1.319.766 3.527 1.502 5.459 1.502 2.024 0 3.066-.828 3.066-2.024 0-1.165-.889-1.84-3.802-2.545-3.404-.828-4.846-2.147-4.846-4.661 0-2.668 2.055-4.294 5.551-4.294 1.993 0 3.803.491 4.937 1.104v2.73c-1.84-.92-3.342-1.411-4.968-1.411-1.932 0-2.974.675-2.974 1.87 0 1.074.736 1.749 3.557 2.423 3.404.828 5.121 2.086 5.121 4.754m-13.626 0c0 2.545-1.656 4.477-5.765 4.477-2.3 0-4.171-.521-5.336-1.135v-2.79c1.318.766 3.526 1.502 5.458 1.502 2.024 0 3.067-.828 3.067-2.024 0-1.165-.889-1.84-3.803-2.545-3.404-.828-4.845-2.147-4.845-4.661 0-2.668 2.055-4.294 5.551-4.294 1.993 0 3.802.491 4.937 1.104v2.73c-1.84-.92-3.343-1.411-4.968-1.411-1.932 0-2.975.675-2.975 1.87 0 1.074.736 1.749 3.558 2.423 3.404.828 5.121 2.086 5.121 4.754m-20.467-9.078c-2.791 0-4.202 1.81-4.478 4.478h8.556c-.153-2.852-1.441-4.478-4.078-4.478M270.3 24.72c-1.258.675-3.19.92-4.754.92-5.734 0-8.249-3.312-8.249-8.004 0-4.63 2.576-7.943 7.237-7.943 4.723 0 6.624 3.282 6.624 7.943v1.196h-11.193c.368 2.607 2.055 4.293 5.673 4.293 1.779 0 3.282-.337 4.662-.828zm-15.094-2.147v2.362c-.92.49-2.33.705-3.741.705-5.459 0-8.004-3.312-8.004-8.004 0-4.63 2.545-7.943 8.004-7.943 1.38 0 2.453.184 3.649.736v2.454c-.981-.46-2.024-.736-3.465-.736-3.987 0-5.612 2.514-5.612 5.489s1.656 5.49 5.673 5.49c1.564 0 2.546-.215 3.496-.553m-13.836 0v2.362c-.92.49-2.33.705-3.741.705-5.459 0-8.004-3.312-8.004-8.004 0-4.63 2.545-7.943 8.004-7.943 1.38 0 2.453.184 3.649.736v2.454c-.981-.46-2.024-.736-3.465-.736-3.987 0-5.612 2.514-5.612 5.489s1.656 5.49 5.673 5.49c1.564 0 2.546-.215 3.496-.553m-22.45-1.257c-1.533 0-3.097-.184-4.814-.521l-1.687 4.538h-3.097l7.942-20.148h3.496l7.943 20.148h-3.097l-1.687-4.569c-1.809.368-3.373.552-4.999.552m0-2.453c1.288 0 2.607-.154 4.171-.399l-4.079-11.04-4.078 11.07c1.502.246 2.76.369 3.986.369"
        fill="${colors.textColor}"
      />
      <path
        d="M107.447 10.828c0 2.972 1.345 5.308 6.795 6.37 3.185.707 3.893 1.203 3.893 2.264 0 1.062-.708 1.699-2.973 1.699-2.619 0-5.733-.92-7.785-2.123v4.812c1.627.779 3.751 1.699 7.785 1.699 5.662 0 7.856-2.548 7.856-6.228m0 .07c0-3.538-1.84-5.166-7.148-6.299-2.902-.637-3.61-1.274-3.61-2.194 0-1.132 1.062-1.628 2.973-1.628 2.335 0 4.6.708 6.794 1.7V6.368c-1.557-.779-3.892-1.345-6.653-1.345-5.237 0-7.927 2.265-7.927 5.945m72.475-5.803v20.172h4.318V9.978l1.769 4.034 6.087 11.324h5.379V5.166h-4.247v13.022l-1.628-3.822-4.883-9.2zm-27.319 0h-4.671v20.172h4.671zm-10.05 14.155c0-3.538-1.841-5.166-7.149-6.298-2.902-.637-3.609-1.274-3.609-2.194 0-1.133 1.061-1.628 2.972-1.628 2.336 0 4.601.707 6.795 1.698v-4.6c-1.557-.779-3.893-1.345-6.653-1.345-5.238 0-7.927 2.265-7.927 5.945 0 2.973 1.345 5.309 6.794 6.37 3.185.708 3.893 1.203 3.893 2.265s-.708 1.699-2.973 1.699c-2.618 0-5.733-.92-7.785-2.124v4.813c1.628.779 3.751 1.699 7.785 1.699 5.592 0 7.857-2.548 7.857-6.3M71.069 5.165v20.172h9.625l1.486-4.389h-6.44V5.165zm-19.039 0v4.318h5.167v15.854h4.741V9.483h5.592V5.165zm-6.866 0h-6.157L32 25.337h5.379l.99-3.398c1.204.354 2.478.566 3.752.566s2.548-.212 3.751-.566l.991 3.397h5.379c-.07 0-7.078-20.17-7.078-20.17zM42.05 18.26c-.92 0-1.77-.142-2.548-.354L42.05 9.13l2.548 8.776a9.6 9.6 0 0 1-2.548.354M97.326 5.165H91.17l-7.08 20.172h5.38l.99-3.398c1.203.354 2.477.566 3.751.566s2.548-.212 3.751-.566l.991 3.397h5.379zM94.212 18.26c-.92 0-1.77-.142-2.548-.354l2.548-8.776 2.548 8.776a9.6 9.6 0 0 1-2.548.354m75.306-13.095h-6.157l-7.007 20.172h5.379l.991-3.398c1.203.354 2.477.566 3.751.566s2.548-.212 3.751-.566l.991 3.397h5.379zm-3.043 13.094c-.92 0-1.77-.142-2.548-.354l2.548-8.776 2.548 8.776a10 10 0 0 1-2.548.354M22.878 24.378 12.293 3.208c-.208-.458-.416-.541-.666-.541-.209 0-.459.083-.709.5-1.5 2.375-2.167 5.126-2.167 8.001 0 4 2.042 7.751 5.043 13.794.333.666.583.791 1.166.791h7.335c.542 0 .833-.208.833-.625 0-.208-.041-.333-.25-.75M7.501 14.377c-.833-1.25-1.083-1.334-1.292-1.334s-.333.084-.708.834L.208 24.462c-.166.333-.208.458-.208.625 0 .333.292.666.917.666h7.46c.5 0 .874-.416 1.083-1.208.25-1 .333-1.875.333-2.917 0-2.917-1.292-5.751-2.292-7.251"
        fill="${colors.iconColor}"
      />
    </svg>`;
};

/**
 * __Atlassian Access logo__
 *
 * The Atlassian Access logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const AtlassianAccessLogo = ({
	appearance,
	label = 'Atlassian Access',
	size = defaultLogoParams.size,
	testId,
	textColor = defaultLogoParams.textColor,
	iconColor = defaultLogoParams.iconColor,
}: LogoProps) => {
	const { colorMode } = useThemeObserver();
	return (
		<Wrapper
			appearance={appearance}
			iconColor={iconColor}
			label={label}
			size={size}
			svg={svg(
				{
					appearance,
					iconColor,
					textColor,
				},
				colorMode,
			)}
			testId={testId}
			textColor={textColor}
		/>
	);
};
