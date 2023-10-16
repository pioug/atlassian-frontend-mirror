import { createContext, useContext } from 'react';

import type { Appearance, Spacing } from '../types';

type BorderVariant = 'split' | 'default';

type ButtonContextProps = {
  appearance?: Appearance;
  spacing?: Spacing;
  borderVariant?: BorderVariant;
  isDisabled?: boolean;
  isActiveOverSelected?: boolean;
};

/**
 * TODO: Add jsdoc
 */
export const ButtonContext = createContext<ButtonContextProps | undefined>(
  undefined,
);

export const useButtonContext = () => {
  const context = useContext(ButtonContext);

  return context;
};
