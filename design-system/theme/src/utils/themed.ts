/* eslint-disable prefer-rest-params */

import getTheme from './getTheme';
import { ThemedValue, ThemeProps, ThemeModes, DefaultValue } from '../types';
import { __values } from 'tslib';

type Modes<V> = { [key in ThemeModes]?: V };
type VariantModes<V> = { [index: string]: Modes<V> };

// Unpack custom variants, and get correct value for the current theme
function themedVariants<V>(variantProp: string, variants?: VariantModes<V>) {
  return (props?: ThemeProps) => {
    const theme = getTheme(props);
    if (props && props[variantProp] && variants) {
      const modes = variants[props[variantProp]];
      if (modes && modes[theme.mode]) {
        const value = modes[theme.mode];
        if (value) return value; // TS believes value can be undefined
      }
    }
    return '';
  };
}

export default function themed<V = DefaultValue>(
  modesOrVariant: Modes<V> | string,
  variantModes?: VariantModes<V>,
): ThemedValue<V> {
  if (typeof modesOrVariant === 'string') {
    return themedVariants<V>(modesOrVariant, variantModes);
  }
  const modes = modesOrVariant;
  return (props?: ThemeProps) => {
    // Get theme from the user's props
    const theme = getTheme(props);
    // User isn't required to provide both light and dark values
    if (theme.mode in modes) {
      const value = modes[theme.mode]; // TS believes value can be undefined
      if (value) return value;
    }
    return '';
  };
}
