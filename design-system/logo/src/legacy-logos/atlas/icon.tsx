import React from 'react';

import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../../constants';
import type { LogoProps, LogoPropsAppearanceRequired } from '../../types';
import Wrapper from '../../wrapper';
import { getColorsFromAppearance } from '../utils';

const svg = ({ appearance }: LogoProps, colorMode: string | undefined) => {
	let colors = getColorsFromAppearance(appearance ? appearance : 'brand', colorMode);
	return `<svg viewBox="0 0 32 32" focusable="false" aria-hidden="true" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="${colors.iconColor}">
      <path d="M16 28.532c-6.656 0-12.068-5.412-12.068-12.068S9.344 4.396 16 4.396v1.921c-5.597 0-10.146 4.549-10.146 10.146S10.403 26.609 16 26.609zm0 0v-1.921c5.597 0 10.146-4.549 10.146-10.146h1.921c0 6.656-5.412 12.068-12.068 12.068zm12.068-12.068h-1.921c0-5.597-4.549-10.146-10.146-10.146V4.397c6.656 0 12.068 5.412 12.068 12.068zm-6.928 3.695c-1.28-.251-2.292-.706-3.973-1.467-.464-.204-.974-.436-1.559-.696a59 59 0 0 0-1.003-.436c-2.534-1.123-3.926-1.736-5.634-1.736-1.198 0-2.098.325-2.6.937a1.72 1.72 0 0 0-.38 1.448l-1.885.362a3.67 3.67 0 0 1 .78-3.035c.613-.743 1.82-1.634 4.085-1.634 2.116 0 3.824.761 6.414 1.903.316.14.641.288.994.436.594.26 1.114.492 1.578.706 1.606.724 2.488 1.123 3.555 1.327l-.371 1.885Zm1.877.185c-.64 0-1.253-.056-1.875-.185l.371-1.885c.502.102.994.149 1.504.149 1.188 0 2.089-.298 2.609-.864s.539-1.253.51-1.615l1.913-.167c.102 1.169-.251 2.265-1.003 3.082-.622.677-1.82 1.485-4.029 1.485M16 28.532v-1.921c2.757 0 4.4-2.813 4.4-7.52s-1.67-8.652-5.096-12.3l1.402-1.318c3.778 4.02 5.616 8.476 5.616 13.618 0 5.821-2.423 9.441-6.322 9.441m-.001 0c-4.15 0-6.526-3.379-6.526-9.273 0-6.879 3.008-10.722 5.82-13.776l1.412 1.299c-3.277 3.565-5.31 6.888-5.31 12.476 0 6.08 2.506 7.352 4.604 7.352z"/>
      <path d="M10.857 17.467a2.247 2.247 0 1 0 0-4.494 2.247 2.247 0 0 0 0 4.494m10.385 3.871a2.247 2.247 0 1 0 0-4.494 2.247 2.247 0 0 0 0 4.494M15.998 7.96a2.247 2.247 0 1 0 0-4.493 2.247 2.247 0 0 0 0 4.494Z"/>
    </g>
  </svg>`;
};

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
/**
 * __Atlas logo__
 *
 * The Atlas icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 *
 * @deprecated AtlasIcon is deprecated and will be removed from atlaskit/logo in the next major release.
 */
export const AtlasIcon = ({
	appearance,
	label = 'Atlas',
	size = defaultLogoParams.size,
	testId,
}: LogoPropsAppearanceRequired): React.JSX.Element => {
	const { colorMode } = useThemeObserver();
	return (
		<Wrapper
			appearance={appearance}
			label={label}
			svg={svg(
				{
					appearance,
				},
				colorMode,
			)}
			size={size}
			testId={testId}
		/>
	);
};
