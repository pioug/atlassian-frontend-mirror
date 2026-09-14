import { snapshot } from '@af/visual-regression';

import Default from '../../../examples/00-default-tabs.vr.ap';
import Controlled from '../../../examples/10-controlled.vr.ap';
import CustomTabComponents from '../../../examples/30-custom-tab-panel-component.vr.ap';
import WithMany from '../../../examples/50-with-many.vr.ap';
import WithFlexContent from '../../../examples/60-with-flex-content.vr.ap';
import NoSpaceForTabs from '../../../examples/70-no-space-for-tabs.vr.ap';
import Overflow from '../../../examples/80-overflow.vr.ap';
import Testing from '../../../examples/99-testing.vr.ap';

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(Default, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(Controlled, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(CustomTabComponents, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(WithMany, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(WithFlexContent, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(NoSpaceForTabs, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(Overflow, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(Testing, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
