import { snapshot } from '@af/visual-regression';

import FilterButtonTruncationExample from '../../../examples/98-filter-button-truncation.vr.ap';

snapshot(FilterButtonTruncationExample, {
	description: 'Filter button constrained label with count and trailing icon',
	variants: [{ name: 'Light', environment: { colorScheme: 'light' as const } }],
	featureFlags: { 'platform-dst-tokens-finesse': [false, true] },
});
