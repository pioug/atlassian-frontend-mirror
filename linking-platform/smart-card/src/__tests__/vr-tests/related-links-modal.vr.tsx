import { snapshot } from '@af/visual-regression';

import RelatedLinksModal from '../../../examples/vr-related-links-modal/vr-related-links-modal';
import RelatedLinksModalErroredView from '../../../examples/vr-related-links-modal/vr-related-links-modal-errored-view';
import RelatedLinksResolvedView from '../../../examples/vr-related-links-modal/vr-related-links-modal-resolved-view';
import RelatedLinksResolvedViewWithEmptyList from '../../../examples/vr-related-links-modal/vr-related-links-modal-resolved-view-empty-outgoing';
import RelatedLinksModalResolvingView from '../../../examples/vr-related-links-modal/vr-related-links-modal-resolving-view';
import RelatedLinksModalUnavailableView from '../../../examples/vr-related-links-modal/vr-related-links-modal-unavailable-view';

snapshot(RelatedLinksModal, {
	description: 'empty',
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'dialog',
			},
		},
	],
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: {
		'platform-linking-visual-refresh-v2': true,
	},
});

snapshot(RelatedLinksResolvedView, {
	description: 'resolved',
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'dialog',
			},
		},
	],
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: {
		'platform-linking-visual-refresh-v2': true,
	},
});

snapshot(RelatedLinksResolvedViewWithEmptyList, {
	description: 'resolved-empty',
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'dialog',
			},
		},
	],
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: {
		'platform-linking-visual-refresh-v2': true,
	},
});

snapshot(RelatedLinksModalErroredView, {
	description: 'errored',
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'dialog',
			},
		},
	],
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: {
		'platform-linking-visual-refresh-v2': true,
	},
});

snapshot(RelatedLinksModalUnavailableView, {
	description: 'unavailable',
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'dialog',
			},
		},
	],
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: {
		'platform-linking-visual-refresh-v2': true,
	},
});

snapshot(RelatedLinksModalResolvingView, {
	description: 'resolving',
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'dialog',
			},
		},
	],
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: {
		'platform-linking-visual-refresh-v2': true,
	},
});
