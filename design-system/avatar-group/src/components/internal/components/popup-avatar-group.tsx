import React, { useContext, useEffect } from 'react';

import { MenuGroup } from '@atlaskit/menu';

import { type PopupAvatarGroupProps } from '../../types';

import { FocusManagerContext } from './focus-manager';

/**
 * It sets focus to the first avatar when popup is open.
 */
const PopupAvatarGroup = ({
	children,
	isLoading,
	maxHeight,
	maxWidth = 800,
	minHeight,
	minWidth = 320,
	onClick,
	role,
	setInitialFocusRef,
	spacing,
	testId,
	...rest
}: PopupAvatarGroupProps): React.JSX.Element => {
	const { menuItemRefs } = useContext(FocusManagerContext);

	useEffect(() => {
		setInitialFocusRef?.(menuItemRefs[0]);
	}, [menuItemRefs, setInitialFocusRef]);

	return (
		<MenuGroup
			isLoading={isLoading}
			maxHeight={maxHeight}
			maxWidth={maxWidth}
			minHeight={minHeight}
			minWidth={minWidth}
			onClick={onClick}
			role={role}
			spacing={spacing}
			testId={testId}
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...rest}
		>
			{children}
		</MenuGroup>
	);
};

export default PopupAvatarGroup;
