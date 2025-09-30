/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::58eae623b31c41bc7d0d1f7a1e7510bf>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#dddee1)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="M10.594 18.563v-7.97h7.969v7.97zm3.808-6.488-.163.429c-.235.615-.352.922-.572 1.155s-.52.368-1.12.638l-.222.1v.357l.222.099c.6.27.9.405 1.12.638s.337.54.572 1.156l.163.428h.347l.163-.429c.235-.615.352-.922.572-1.155s.52-.368 1.12-.638l.221-.1v-.357l-.22-.1c-.601-.269-.901-.404-1.121-.637s-.337-.54-.572-1.155l-.164-.429z" clip-rule="evenodd"/>
    <path fill="var(--icon-color, #101214)" d="M14.813 7.195 10.125 4.5 5.438 7.195v5.39l3.75 2.157V9.187h5.625z"/>
</svg>
`;

/**
 * __StudioNewIcon__
 *
 * A temporary component to represent the icon for Studio.
 * @deprecated This component has been replaced by the component `StudioNewIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function StudioNewIcon({
	size,
	appearance = 'brand',
	label = 'Studio',
	testId,
}: AppIconProps) {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
