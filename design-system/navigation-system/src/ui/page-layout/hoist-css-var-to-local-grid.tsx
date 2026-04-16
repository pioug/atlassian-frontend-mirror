import React from 'react';

import { gridRootId } from './root';

/**
 * This is not ideal and shouldn't be used by anything outside of `<Banner>` and `<TopNav>`.
 *
 * This makes the other page layout elements aware that the banner and top bar have been mounted, provides them
 * with their heights. This is needed to power the stick points of page layout elements like SideNav and Panel.
 *
 * We should clean this up once we have a better solution, such as moving the size props for banner and top bar into `Root`.
 */
export const HoistCssVarToLocalGrid = ({
	variableName,
	value,
}: {
	variableName: string;
	value: number;
	// Using a global style is required for SSR, as we can't use React hooks
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles
}): React.JSX.Element => <style>{`#${gridRootId} { ${variableName}: ${value}px }`}</style>;
