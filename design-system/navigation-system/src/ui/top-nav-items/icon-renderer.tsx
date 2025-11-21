import React, { type ComponentClass, type FunctionComponent } from 'react';

import { type IconProp } from '@atlaskit/button/new';
import { type IconProps, type NewIconProps } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags';

function isIconRenderProp(
	func:
		| FunctionComponent<IconProps | NewIconProps>
		| ComponentClass<IconProps | NewIconProps>
		| ((iconProp: IconProps | NewIconProps) => IconProp),
): func is (iconProp: IconProps | NewIconProps) => IconProp {
	return (
		!(func as any).displayName && // most function components and class components have a displayName, negate them
		!(func as any).render && // forwardRef doesn't require a display name, however it does include a render function, negate them
		typeof func === 'function' // at the very least we need to be a function
	);
}

/**
 * __Icon renderer__
 *
 * Used to support render props with icons.
 *
 * This is copied from @atlaskit/button to render IconButtons. Some IconButton's DOM element
 * will be re-created during SSR -> SPA hydration without using this, which delays TTVC. As
 * IconRenderer is already used in @atlaskit/button to mitigate this issue, add it here to
 * mitigate the same issue for IconButtons in navigation-system, especially for ThemedIconButton.
 *
 */
const IconRenderer = ({ icon: Icon }: { icon: IconProp }): React.JSX.Element => {
	const isRenderProp = isIconRenderProp(Icon);
	let iconProps: IconProps | NewIconProps = {
		label: '',
		color: 'currentColor',
		size: fg('platform_dst_button_chevron_sizing')
			? (iconName) => (iconName.startsWith('Chevron') ? 'small' : 'medium')
			: undefined,
	};

	// @ts-ignore - TS2322 TypeScript 5.9.2 upgrade
	return <>{isRenderProp ? Icon(iconProps) : <Icon {...iconProps} />}</>;
};

export default IconRenderer;
