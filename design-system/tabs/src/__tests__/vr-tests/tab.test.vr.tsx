import { snapshot } from '@af/visual-regression';

import Default from '../../../examples/00-default-tabs';
import Controlled from '../../../examples/10-controlled';
import CustomTabComponents from '../../../examples/30-custom-tab-panel-component';
import WithMany from '../../../examples/50-with-many';
import WithFlexContent from '../../../examples/60-with-flex-content';
import NoSpaceForTabs from '../../../examples/70-no-space-for-tabs';
import Overflow from '../../../examples/80-overflow';
import Testing from '../../../examples/99-testing';

snapshot(Default, {
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
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(Controlled, {
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
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(CustomTabComponents, {
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
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(WithMany, {
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
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
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
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
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
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
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
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(Testing, {
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
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
