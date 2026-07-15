import transform, { parser } from '../index';

// Use the `require` form (matching other design-system codemod tests, e.g.
// checkbox) so that `defineInlineTest` is untyped here. Its typed ESM signature
// expects a bare `Transform` function, but at runtime it also reads `.parser`
// off the module, so we pass `{ default, parser }`.
const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

const transformModule = { default: transform, parser };

defineInlineTest(
	transformModule,
	{},
	// -------------------------------------------------------------------------
	// Single symbol migrated to its own entry-point
	// -------------------------------------------------------------------------
	`import { SpotlightCard } from '@atlaskit/spotlight';`,
	`import { SpotlightCard } from '@atlaskit/spotlight/card';`,
	'migrates SpotlightCard to its own entry-point',
);

defineInlineTest(
	transformModule,
	{},
	// -------------------------------------------------------------------------
	// A component and its Props type resolve to the same entry-point → grouped
	// -------------------------------------------------------------------------
	`import { SpotlightCard, type SpotlightCardProps } from '@atlaskit/spotlight';`,
	`import { SpotlightCard, type SpotlightCardProps } from '@atlaskit/spotlight/card';`,
	'groups a component and its Props type into a single entry-point import',
);

defineInlineTest(
	transformModule,
	{},
	// -------------------------------------------------------------------------
	// Multiple symbols going to different entry-points
	// -------------------------------------------------------------------------
	`import { SpotlightCard, SpotlightHeader, PopoverContent } from '@atlaskit/spotlight';`,
	`import { SpotlightCard } from '@atlaskit/spotlight/card';
import { SpotlightHeader } from '@atlaskit/spotlight/header';
import { PopoverContent } from '@atlaskit/spotlight/popover-content';`,
	'splits imports across multiple entry-points',
);

defineInlineTest(
	transformModule,
	{},
	// -------------------------------------------------------------------------
	// Type-only declaration — preserved as type import, routed to `./types`
	// -------------------------------------------------------------------------
	`import type { Placement, DismissEvent } from '@atlaskit/spotlight';`,
	`import type { Placement, DismissEvent } from '@atlaskit/spotlight/types';`,
	'migrates import type declarations preserving type keyword',
);

defineInlineTest(
	transformModule,
	{},
	// -------------------------------------------------------------------------
	// Per-specifier `type` keyword split from a value import
	// -------------------------------------------------------------------------
	`import { SpotlightCard, type Placement } from '@atlaskit/spotlight';`,
	`import { SpotlightCard } from '@atlaskit/spotlight/card';
import type { Placement } from '@atlaskit/spotlight/types';`,
	'handles per-specifier type imports correctly',
);

defineInlineTest(
	transformModule,
	{},
	// -------------------------------------------------------------------------
	// Aliased import
	// -------------------------------------------------------------------------
	`import { SpotlightCard as Card } from '@atlaskit/spotlight';`,
	`import { SpotlightCard as Card } from '@atlaskit/spotlight/card';`,
	'preserves import aliases when migrating',
);

defineInlineTest(
	transformModule,
	{},
	// -------------------------------------------------------------------------
	// UNSAFE_-prefixed and hook symbols route to their kebab-case entry-points
	// -------------------------------------------------------------------------
	`import { UNSAFE_UpdateOnChange, usePreloadMedia } from '@atlaskit/spotlight';`,
	`import { UNSAFE_UpdateOnChange } from '@atlaskit/spotlight/update-on-change';
import { usePreloadMedia } from '@atlaskit/spotlight/use-preload-media';`,
	'migrates UNSAFE_ and hook exports to their entry-points',
);

defineInlineTest(
	transformModule,
	{},
	// -------------------------------------------------------------------------
	// Unknown symbol is left in the root barrel for TS to flag
	// -------------------------------------------------------------------------
	`import { SpotlightCard, SomethingUnknown } from '@atlaskit/spotlight';`,
	`import { SomethingUnknown } from '@atlaskit/spotlight';
import { SpotlightCard } from '@atlaskit/spotlight/card';`,
	'leaves unknown symbols in the root barrel',
);

defineInlineTest(
	transformModule,
	{},
	// -------------------------------------------------------------------------
	// File without @atlaskit/spotlight import is untouched
	// -------------------------------------------------------------------------
	`import { something } from 'some-other-package';`,
	`import { something } from 'some-other-package';`,
	'ignores files without @atlaskit/spotlight imports',
);
