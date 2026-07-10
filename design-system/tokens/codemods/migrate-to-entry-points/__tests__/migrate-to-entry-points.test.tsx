import type { Transform } from 'jscodeshift';
import { defineInlineTest } from 'jscodeshift/src/testUtils';

import * as transformModule from '../transform';

// Cast needed: namespace import with named `parser` export + default transformer
// is the jscodeshift convention; applyTransform handles module.default internally.
const transform = transformModule as unknown as Transform;

defineInlineTest(
	transform,
	{},
	// -------------------------------------------------------------------------
	// No-op: only `token` imported — nothing should change
	// -------------------------------------------------------------------------
	`import { token } from '@atlaskit/tokens';`,
	`import { token } from '@atlaskit/tokens';`,
	'leaves token-only imports unchanged',
);

defineInlineTest(
	transform,
	{},
	// -------------------------------------------------------------------------
	// Single non-root symbol migrated
	// -------------------------------------------------------------------------
	`import { getTokenValue } from '@atlaskit/tokens';`,
	`import { getTokenValue } from '@atlaskit/tokens/get-token-value';`,
	'migrates getTokenValue to its own entry-point',
);

defineInlineTest(
	transform,
	{},
	// -------------------------------------------------------------------------
	// Root symbol kept + non-root symbol split out
	// -------------------------------------------------------------------------
	`import { token, getTokenValue } from '@atlaskit/tokens';`,
	`import { token } from '@atlaskit/tokens';
import { getTokenValue } from '@atlaskit/tokens/get-token-value';`,
	'splits token (root) and getTokenValue into separate imports',
);

defineInlineTest(
	transform,
	{},
	// -------------------------------------------------------------------------
	// Multiple symbols going to the same entry-point are grouped
	// -------------------------------------------------------------------------
	`import { COLOR_MODE_ATTRIBUTE, THEME_DATA_ATTRIBUTE, SUBTREE_THEME_ATTRIBUTE, CURRENT_SURFACE_CSS_VAR } from '@atlaskit/tokens';`,
	`import {
  COLOR_MODE_ATTRIBUTE,
  THEME_DATA_ATTRIBUTE,
  SUBTREE_THEME_ATTRIBUTE,
  CURRENT_SURFACE_CSS_VAR,
} from '@atlaskit/tokens/constants';`,
	'groups constants into a single entry-point import',
);

defineInlineTest(
	transform,
	{},
	// -------------------------------------------------------------------------
	// Multiple symbols going to different entry-points
	// -------------------------------------------------------------------------
	`import { getTokenValue, COLOR_MODE_ATTRIBUTE, useThemeObserver } from '@atlaskit/tokens';`,
	`import { getTokenValue } from '@atlaskit/tokens/get-token-value';
import { COLOR_MODE_ATTRIBUTE } from '@atlaskit/tokens/constants';
import { useThemeObserver } from '@atlaskit/tokens/use-theme-observer';`,
	'splits imports across multiple entry-points',
);

defineInlineTest(
	transform,
	{ parser: 'tsx' },
	// -------------------------------------------------------------------------
	// `import type` declaration — preserved as type import
	// -------------------------------------------------------------------------
	`import type { ThemeState, ThemeColorModes } from '@atlaskit/tokens';`,
	`import type { ThemeState, ThemeColorModes } from '@atlaskit/tokens/theme-config';`,
	'migrates import type declarations preserving type keyword',
);

defineInlineTest(
	transform,
	{ parser: 'tsx' },
	// -------------------------------------------------------------------------
	// Per-specifier `type` keyword
	// -------------------------------------------------------------------------
	`import { token, type ThemeState } from '@atlaskit/tokens';`,
	`import { token } from '@atlaskit/tokens';
import type { ThemeState } from '@atlaskit/tokens/theme-config';`,
	'handles per-specifier type imports correctly',
);

defineInlineTest(
	transform,
	{},
	// -------------------------------------------------------------------------
	// Aliased import
	// -------------------------------------------------------------------------
	`import { getTokenValue as getValue } from '@atlaskit/tokens';`,
	`import { getTokenValue as getValue } from '@atlaskit/tokens/get-token-value';`,
	'preserves import aliases when migrating',
);

defineInlineTest(
	transform,
	{},
	// -------------------------------------------------------------------------
	// themeStringToObject and themeObjectToString both go to theme-state-transformer
	// -------------------------------------------------------------------------
	`import { themeStringToObject, themeObjectToString } from '@atlaskit/tokens';`,
	`import { themeStringToObject, themeObjectToString } from '@atlaskit/tokens/theme-state-transformer';`,
	'migrates theme state transformer helpers together',
);

defineInlineTest(
	transform,
	{},
	// -------------------------------------------------------------------------
	// File without @atlaskit/tokens import is untouched
	// -------------------------------------------------------------------------
	`import { something } from 'some-other-package';`,
	`import { something } from 'some-other-package';`,
	'ignores files without @atlaskit/tokens imports',
);
