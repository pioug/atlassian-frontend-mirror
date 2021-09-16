// ----------------------------------------------------
// ----------------------------------------------------
// !!!WARNING!!!
// This file is made to copy and paste into Figma.
// If you make changes make sure to check the built output here:
// `packages/design-system/tokens/dist/cjs/figma/tokens-to-figma.js`
// If any Babel imports are added you will need to modify your code so they aren't
// as they won't work in a browser!
// ----------------------------------------------------
// ----------------------------------------------------
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import type { PaintToken, ShadowToken } from '../types';

import type {
  FigmaEffect,
  FigmaEffectStyle,
  FigmaPaint,
  FigmaPaintStyle,
} from './types';

function hexToPercent(hex: string): number {
  const percent = parseInt(hex, 16) * 100;
  // Ensure the value is capped between 0 and 100
  return Math.max(0, Math.min(Math.round(percent / 255), 100));
}

function createPaint(hex: string): FigmaPaint {
  let hexValue = hex;
  if (!hexValue.startsWith('#')) {
    throw new Error('hex should start with hash');
  }

  if (hexValue.length === 4) {
    // We have a half hex, double it!
    hexValue = `${hexValue}${hexValue.slice(1)}`;
  }

  if (hexValue.length !== 9 && hexValue.length !== 7) {
    throw new Error('hex invalid length');
  }

  const r = parseInt(hexValue.slice(1, 3), 16) / 255;
  const g = parseInt(hexValue.slice(3, 5), 16) / 255;
  const b = parseInt(hexValue.slice(5, 7), 16) / 255;
  const alphaHex = hexValue.slice(7, 9);
  const opacity = alphaHex ? hexToPercent(alphaHex) : 100;

  return {
    type: 'SOLID',
    visible: true,
    opacity: opacity / 100,
    blendMode: 'NORMAL',
    color: { r, g, b },
  };
}

export type CreateEffects = typeof createEffects;
export type CreatePaint = typeof createPaint;

function createEffects(value: ShadowToken<string>['value']): FigmaEffect[] {
  return value.map((shadow) => {
    // Reuse this to get the rgb value of the hex.
    const { color } = createPaint(shadow.color);

    return {
      blendMode: 'NORMAL',
      color: {
        r: color.r,
        g: color.g,
        b: color.b,
        a: shadow.opacity,
      },
      offset: shadow.offset,
      radius: shadow.radius,
      spread: shadow.spread,
      type: shadow.inset ? 'INNER_SHADOW' : 'DROP_SHADOW',
      visible: true,
    };
  });
}

/**
 * Adds tokens under a specified theme as paint styles to Figma.
 *
 * @param {*} themeName name of the theme, e.g. "dark". Tokens will be added under this folder name.
 * @param {*} tokens
 * @param {*} renameMap mapping object for tokens that should be renamed. example { 'old/token': 'new/token'}
 */
function synchronizeFigmaTokens(
  themeName: string,
  tokens: Record<string, PaintToken<string> | ShadowToken<string>>,
  renameMap: Record<string, string> = {},
) {
  const figma = (window as any).figma;
  const localPaintStyles: FigmaPaintStyle[] = figma.getLocalPaintStyles();
  const localEffectStyles: FigmaEffectStyle[] = figma.getLocalEffectStyles();

  localEffectStyles.forEach((style) => {
    // If there's a rename mapping for this style name
    // Rename it first, then follow up with value updates
    if (renameMap[style.name]) {
      console.log(`=> ${style.name} renamed to ${renameMap[style.name]}!`);
      style.name = renameMap[style.name];
    }

    const token = tokens[style.name];

    if (token) {
      if (token.attributes.group !== 'shadow') {
        // Effect exists in our token set.
        // The token is no longer an effect style, time to remove it!
        console.log(`=> ${style.name} is no longer a shadow, removing!`);
        style.remove();
      } else {
        // It's still an effect! Update it.
        console.log(`=> ${style.name} shadow style has been updated!`);
        style.effects = createEffects(token.value as ShadowToken['value']);
        style.description = (token.attributes.description || '').trim();
        // Remove from themeValues so it isn't picked up as a new token.
        delete tokens[style.name];
      }
    } else if (style.name.startsWith(themeName)) {
      // The local style was in our theme, but no more!
      // It's time to delete it.
      console.log(`=> ${style.name} shadow style no longer exists, removing.`);
      style.remove();
    }
  });

  // Iterate through all local figma styles first
  // If it still exists in themeValues, update it (and then remove from themeValues)
  // If it doesn't exist, delete the local figma style
  // For all themeValues remaining we will add them as new
  localPaintStyles.forEach((style) => {
    // If there's a rename mapping for this style name
    // Rename it first, then follow up with value updates
    if (renameMap[style.name]) {
      console.log(`=> ${style.name} renamed to ${renameMap[style.name]}!`);
      style.name = renameMap[style.name];
    }

    const token = tokens[style.name];

    if (token) {
      if (token.attributes.group !== 'paint') {
        // The token is no longer a paint style, time to remove it!
        console.log(`=> ${style.name} is no longer a paint, removing!`);
        style.remove();
      } else {
        // Local style exists that also exists in our tokens!
        // Update it and then remove from themeValues.
        console.log(`=> ${style.name} paint style has been updated!`);
        // Mutating is how Figma updates.
        style.paints = [createPaint(token.value as PaintToken['value'])];
        style.description = (token.attributes.description || '').trim();
        // Remove from themeValues so it isn't picked up as a new token.
        delete tokens[style.name];
      }
    } else if (style.name.startsWith(themeName)) {
      // The local style was in our theme, but no more!
      // It's time to delete it.
      console.log(`=> ${style.name} paint style no longer exists, removing.`);
      style.remove();
    }
  });

  // eslint-disable-next-line guard-for-in
  for (const key in tokens) {
    const token = tokens[key];
    if (token.attributes.group === 'paint') {
      const newStyle: FigmaPaintStyle = figma.createPaintStyle();
      newStyle.name = key;
      newStyle.description = (token.attributes.description || '').trim();
      newStyle.paints = [createPaint(token.value as PaintToken['value'])];
      console.log(`=> ${key} paint style has been added!`);
    }

    if (token.attributes.group === 'shadow') {
      const newStyle: FigmaEffectStyle = figma.createEffectStyle();
      newStyle.name = key;
      newStyle.description = (token.attributes.description || '').trim();
      newStyle.effects = createEffects(token.value as ShadowToken['value']);
      console.log(`=> ${key} shadow style has been added!`);
    }
  }
}

export type SynchronizeFigmaTokens = typeof synchronizeFigmaTokens;

if (typeof module !== 'undefined') {
  module.exports = {
    synchronizeFigmaTokens,
    createPaint,
    createEffects,
  };
}
