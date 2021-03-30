import { useCallback, useState } from 'react';

export const useMenuState = () => {
  const [isMenuOpen, setIsMenuOpened] = useState(false);
  const toggleMenu = useCallback(() => {
    setIsMenuOpened(!isMenuOpen);
  }, [isMenuOpen]);
  const closeMenu = useCallback(() => {
    setIsMenuOpened(false);
  }, []);

  return [isMenuOpen, toggleMenu, closeMenu] as const;
};
