import { snapshot } from '@af/visual-regression';

import RelatedLinksModal from '../../../examples/vr-related-links-modal/vr-related-links-modal';
import RelatedLinksResolvedView from '../../../examples/vr-related-links-modal/vr-related-links-modal-resolved-view';
import RelatedLinksResolvedViewWithEmptyList from '../../../examples/vr-related-links-modal/vr-related-links-modal-resolved-view-empty-outgoing';
import VrRelatedLinksModalErroredView from '../../../examples/vr-related-links-modal/vr-related-links-modal-errored-view';
import VrRelatedLinksModalUnavailableView from '../../../examples/vr-related-links-modal/vr-related-links-modal-unavailable-view';

snapshot(RelatedLinksModal, {
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
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
});

snapshot(RelatedLinksResolvedView, {
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
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
});

snapshot(RelatedLinksResolvedViewWithEmptyList, {
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
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
});

snapshot(VrRelatedLinksModalErroredView, {
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
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
});

snapshot(VrRelatedLinksModalUnavailableView, {
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
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
});
