import { snapshot } from '@af/visual-regression';

import BasicUsage from '../../../examples/00-basic-usage';
import Indeterminate from '../../../examples/03-indeterminate';
import MultilineLabel from '../../../examples/09-multiline-label';

// Test with both feature flag states (legacy nested selectors vs new atomic styles)
const featureFlags = { 'platform-checkbox-atomic-styles': [false, true] } as const;

snapshot(BasicUsage, {
	description: 'Basic usage',
	featureFlags,
});
snapshot(BasicUsage, {
	description: 'Basic usage - focused - default',
	states: [{ state: 'focused', selector: { byTestId: 'cb-basic--hidden-checkbox' } }],
	featureFlags,
});
snapshot(BasicUsage, {
	description: 'Basic usage - focused - checked',
	states: [{ state: 'focused', selector: { byTestId: 'cb-default-checked--hidden-checkbox' } }],
	featureFlags,
});
snapshot(BasicUsage, {
	description: 'Basic usage - focused - disabled',
	states: [{ state: 'focused', selector: { byTestId: 'cb-disabled--hidden-checkbox' } }],
	featureFlags,
});
snapshot(BasicUsage, {
	description: 'Basic usage - focused - invalid',
	states: [{ state: 'focused', selector: { byTestId: 'cb-invalid--hidden-checkbox' } }],
	featureFlags,
});

snapshot(Indeterminate, { featureFlags });
snapshot(MultilineLabel, { featureFlags });
