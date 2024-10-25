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
});
