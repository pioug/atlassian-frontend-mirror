import { snapshot } from '@af/visual-regression';

import FilterButtonExample from '../../../examples/97-filter-button.vr.ap';

const variants = [{ name: 'Light', environment: { colorScheme: 'light' as const } }];

snapshot(FilterButtonExample, {
	description: 'Filter button',
	variants,
	featureFlags: { 'platform-dst-tokens-finesse': [false, true] },
});

snapshot(FilterButtonExample, {
	description: 'Filter button hovered',
	variants,
	featureFlags: { 'platform-dst-tokens-finesse': [false, true] },
	states: [{ state: 'hovered', selector: { byTestId: 'filter' } }],
});

snapshot(FilterButtonExample, {
	description: 'Filter button focused',
	variants,
	featureFlags: { 'platform-dst-tokens-finesse': [false, true] },
	states: [{ state: 'focused', selector: { byTestId: 'filter' } }],
});
