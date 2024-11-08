/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useContext, useEffect } from 'react';

import { jsx } from '@emotion/react';

import { MenuGroup } from '@atlaskit/menu';

import { type PopupAvatarGroupProps } from '../../types';

import { FocusManagerContext } from './focus-manager';

/**
 * It sets focus to the first avatar when popup is open.
 */
const PopupAvatarGroup = ({
	maxWidth = 800,
	minWidth = 320,
	setInitialFocusRef,
	...rest
}: PopupAvatarGroupProps) => {
	const { menuItemRefs } = useContext(FocusManagerContext);

	useEffect(() => {
		setInitialFocusRef?.(menuItemRefs[0]);
	}, [menuItemRefs, setInitialFocusRef]);

	return (
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		<MenuGroup maxWidth={maxWidth} minWidth={minWidth} {...rest} />
	);
};

export default PopupAvatarGroup;
