import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import makeDir from 'mkdirp';

import format from '@af/formatting/sync';
import { platformRootResolve } from '@af/root-path';

// Import raw token values to replicate the Babel plugin's auto-fallback behavior.
// When @atlaskit/css-reset was bundled through Parcel, the tokens Babel plugin
// (shouldUseAutoFallback) automatically added fallback values to token() calls
// without explicit fallbacks. Since this build script runs via ts-node (no Babel),
// we need to post-process the CSS to add those fallbacks ourselves.
//
// We use relative paths to the tokens package source because the subpath exports
// don't expose internal artifacts.
const tokensDir = path.resolve(__dirname, '..', '..', 'tokens', 'src', 'artifacts');
// eslint-disable-next-line import/no-dynamic-require
const light = require(path.join(tokensDir, 'tokens-raw', 'atlassian-light')).default;
// eslint-disable-next-line import/no-dynamic-require
const spacing = require(path.join(tokensDir, 'tokens-raw', 'atlassian-spacing')).default;
// eslint-disable-next-line import/no-dynamic-require
const typography = require(path.join(tokensDir, 'tokens-raw', 'atlassian-typography')).default;
// eslint-disable-next-line import/no-dynamic-require
const tokenNames = require(path.join(tokensDir, 'token-names')).default;

import styleSheet from '../src';

const writeFile = promisify(fs.writeFile);
const SRC = path.join(__dirname, '..', 'src');
// generate platform/build/test-tooling/gemini-visual-regression/template/reset-styles.ts
const GEMINI_TEMPLATE = platformRootResolve()(
  'build/test-tooling/gemini-visual-regression/template',
);

// Build a map from CSS custom property name to its default fallback value,
// matching the Babel plugin's getDefaultFallback() logic.
function buildFallbackMap(): Record<string, string> {
  const map: Record<string, string> = {};

  const addThemeValues = (theme: Array<{ cleanName?: string; value: unknown }>) => {
    for (const token of theme) {
      if (token.cleanName && typeof token.value === 'string') {
        const cssVar = (tokenNames as Record<string, string>)[token.cleanName];
        if (cssVar && !map[cssVar]) {
          map[cssVar] = token.value;
        }
      }
    }
  };

  // Order matches the Babel plugin: spacing > typography > light
  addThemeValues(spacing);
  addThemeValues(typography);
  addThemeValues(light);

  return map;
}

// Add auto-fallbacks to bare var(--ds-*) calls that don't have a fallback value.
// This replicates the tokens Babel plugin's shouldUseAutoFallback behavior.
function addAutoFallbacks(css: string): string {
  const fallbacks = buildFallbackMap();
  // Match var(--ds-...) without a fallback (no comma after the property name)
  return css.replace(/var\((--ds-[a-zA-Z0-9-]+)\)/g, (match, cssVar) => {
    const fallback = fallbacks[cssVar];
    if (fallback) {
      return `var(${cssVar}, ${fallback})`;
    }
    return match;
  });
}

/**
 * Generate the production bundle.css from the css-reset source.
 * This is the standard CSS output used by consumers of @atlaskit/css-reset.
 */
async function buildBundleCss() {
  makeDir.sync(SRC);
  const output = format(styleSheet, 'css');
  await writeFile(path.join(SRC, 'bundle.css'), output);
}

/**
 * Generate the Gemini VR test template's reset-styles.ts.
 *
 * This decouples @af/visual-regression from a runtime @atlaskit/css-reset import.
 * The CSS is post-processed to add auto-fallback values for bare var(--ds-*) calls,
 * replicating the tokens Babel plugin's shouldUseAutoFallback behaviour that would
 * normally run at Parcel bundle time.
 */
async function buildGeminiResetStyles() {
  makeDir.sync(GEMINI_TEMPLATE);
  const cssWithFallbacks = addAutoFallbacks(styleSheet);
  const escapedCss = cssWithFallbacks.replace(/\\/g, '\\\\');
  const resetStylesTs = `const resetStyles = \`${escapedCss}\`;\n\nexport default resetStyles;\n`;
  await writeFile(path.join(GEMINI_TEMPLATE, 'reset-styles.ts'), resetStylesTs);
}

Promise.all([buildBundleCss(), buildGeminiResetStyles()])
  .then(() => {
    console.log('successfully build css-reset');
  })
  .catch((err) => {
    console.error(`Failed to build css-reset due to ${err}`);
  });
