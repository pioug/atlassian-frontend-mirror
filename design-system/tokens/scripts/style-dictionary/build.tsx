import styleDictionary from 'style-dictionary';

import buildPalettes from './build-palettes';
import buildSchema from './build-schema';
import buildThemes from './build-themes';

/**
 * This file is responsible for building artifacts for the package.
 * Artifacts are output to the src/artifacts/ dir.
 * It should be able to be completely deleted and regenerated via yarn build tokens.
 */

/**
 * The palette step builds artifacts related to base-tokens which are used to create themes.
 * It mostly looks at the schema/palettes dir to create artifacts
 * For example, palettes-raw
 */
buildPalettes(styleDictionary);

/**
 * The themes step builds artifacts on a per-theme basis.
 * This is where a majority of the work is done wherever an artifact is generated
 * for each theme
 * For example, atlassian-light.tsx
 */
buildThemes(styleDictionary);

/**
 * The schema step builds artifacts related to the structure of themes.
 * It mostly looks at the schema (aka schema/tokens dir) to create artifacts
 * For example, replacement tokens and token descriptions are both artifacts that
 * apply to all themes
 */
buildSchema(styleDictionary);
