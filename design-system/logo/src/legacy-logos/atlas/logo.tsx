import React from 'react';

import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../../constants';
import type { LogoProps, LogoPropsAppearanceRequired } from '../../types';
import Wrapper from '../../wrapper';
import { getColorsFromAppearance } from '../utils';

const svg = ({ appearance }: LogoProps, colorMode: string | undefined) => {
	let colors = getColorsFromAppearance(appearance ? appearance : 'brand', colorMode);
	return `<svg viewBox="0 0 102 32" focusable="false" aria-hidden="true" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.068 27.865C5.412 27.865 0 22.453 0 15.797S5.412 3.73 12.068 3.73v1.922c-5.597 0-10.146 4.548-10.146 10.146 0 5.597 4.549 10.145 10.146 10.145z M12.068 27.865v-1.92c5.597 0 10.146-4.55 10.146-10.147h1.921c0 6.656-5.412 12.068-12.068 12.068h.001Zm12.068-12.068h-1.921c0-5.597-4.549-10.146-10.146-10.146V3.73c6.656 0 12.068 5.412 12.068 12.068zm-6.927 3.695c-1.282-.25-2.293-.705-3.974-1.466-.464-.204-.974-.436-1.559-.696a58 58 0 0 0-1.003-.436C8.14 15.77 6.747 15.158 5.04 15.158c-1.198 0-2.098.324-2.6.937a1.72 1.72 0 0 0-.38 1.448l-1.885.362a3.67 3.67 0 0 1 .78-3.035c.613-.743 1.82-1.634 4.085-1.634 2.116 0 3.824.761 6.414 1.903.316.14.641.288.994.436.594.26 1.114.492 1.578.705 1.606.724 2.488 1.124 3.555 1.328l-.371 1.884Z M19.085 19.677c-.64 0-1.253-.056-1.875-.185l.371-1.885c.502.102.994.15 1.504.15 1.188 0 2.089-.298 2.609-.864s.539-1.254.51-1.616l1.913-.167c.102 1.17-.251 2.265-1.003 3.082-.622.677-1.82 1.485-4.029 1.485 M12.068 27.865v-1.92c2.757 0 4.4-2.814 4.4-7.52 0-4.707-1.67-8.652-5.096-12.3l1.402-1.318c3.778 4.02 5.616 8.475 5.616 13.618 0 5.82-2.423 9.44-6.322 9.44 M12.067 27.866c-4.15 0-6.526-3.379-6.526-9.274 0-6.878 3.008-10.722 5.82-13.776l1.412 1.3c-3.277 3.564-5.31 6.888-5.31 12.476 0 6.08 2.506 7.352 4.604 7.352v1.921Z" fill="${colors.iconColor}"/>
    <path d="M6.925 16.8a2.247 2.247 0 1 0 0-4.494 2.247 2.247 0 0 0 0 4.494m10.385 3.872a2.247 2.247 0 1 0 0-4.494 2.247 2.247 0 0 0 0 4.494M12.066 7.294a2.247 2.247 0 1 0 0-4.494 2.247 2.247 0 0 0 0 4.494" fill="${colors.iconColor}"/>
    <path d="M101.019 21.163c0 2.545-1.656 4.477-5.766 4.477-2.3 0-4.17-.521-5.336-1.135v-2.79c1.319.766 3.527 1.502 5.459 1.502 2.024 0 3.067-.828 3.067-2.024 0-1.165-.89-1.84-3.803-2.545-3.404-.828-4.845-2.147-4.845-4.661 0-2.668 2.054-4.294 5.55-4.294 1.994 0 3.803.491 4.938 1.104v2.73c-1.84-.92-3.343-1.411-4.968-1.411-1.932 0-2.975.675-2.975 1.87 0 1.074.736 1.749 3.557 2.423 3.404.828 5.122 2.086 5.122 4.754m-25.873-3.496c0 3.68 1.472 5.52 4.2 5.52 2.362 0 4.478-1.503 4.478-4.907v-1.227c0-3.404-1.932-4.906-4.17-4.906-2.975 0-4.508 1.962-4.508 5.52m8.678 7.666v-2.76c-.981 2.024-2.821 3.067-5.182 3.067-4.08 0-6.134-3.465-6.134-7.973 0-4.324 2.147-7.974 6.44-7.974 2.239 0 3.956 1.012 4.876 3.006V10h2.638v15.333zm-12.784-.03c-.214.061-.674.122-1.349.122-2.514 0-4.11-1.196-4.11-4.017V3.591h2.638V21.1c0 1.38.92 1.871 2.055 1.871.276 0 .46 0 .767-.03v2.36ZM58.12 20.58c0 1.35.798 2.27 2.423 2.27.614 0 1.196-.123 1.656-.215v2.545a6.3 6.3 0 0 1-1.779.245c-3.28 0-4.876-1.932-4.876-4.784v-8.188h-2.483V10h2.483V6.75h2.577V10h4.078v2.453h-4.078v8.127Zm-14.675.736c-1.533 0-3.097-.184-4.814-.521l-1.687 4.538h-3.097l7.942-20.148h3.496l7.943 20.148h-3.097l-1.687-4.569c-1.81.368-3.373.552-4.999.552m0-2.453c1.288 0 2.607-.154 4.171-.399l-4.079-11.04-4.078 11.07c1.502.246 2.76.369 3.986.369" fill="${colors.textColor}"/>
  </svg>`;
};

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
/**
 * __Atlas logo__
 *
 * The Atlas logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 *
 * @deprecated AtlasLogo is deprecated and will be removed from atlaskit/logo in the next major release.
 */
export const AtlasLogo = ({
	appearance,
	label = 'Atlas',
	size = defaultLogoParams.size,
	testId,
}: LogoPropsAppearanceRequired) => {
	const { colorMode } = useThemeObserver();
	return (
		<Wrapper
			appearance={appearance}
			label={label}
			size={size}
			svg={svg({ appearance }, colorMode)}
			testId={testId}
		/>
	);
};
