import { useCallback, useState } from 'react';

export const useMenuState = (): readonly [boolean, () => void, () => void] => {
	const [isMenuOpen, setIsMenuOpened] = useState(false);
	const toggleMenu = useCallback(() => {
		setIsMenuOpened(!isMenuOpen);
	}, [isMenuOpen]);
	const closeMenu = useCallback(() => {
		setIsMenuOpened(false);
	}, []);

	return [isMenuOpen, toggleMenu, closeMenu] as const;
};
