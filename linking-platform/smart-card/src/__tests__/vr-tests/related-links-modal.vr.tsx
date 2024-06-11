import { snapshot } from '@af/visual-regression';

import RelatedLinksModal from '../../../examples/vr-related-links-modal/vr-related-links-modal';
import RelatedLinksResolvedView from '../../../examples/vr-related-links-modal/vr-related-links-modal-resolved-view';
import RelatedLinksResolvedViewWithEmptyList from '../../../examples/vr-related-links-modal/vr-related-links-modal-resolved-view-empty-outgoing';
import RelatedLinksModalErroredView from '../../../examples/vr-related-links-modal/vr-related-links-modal-errored-view';
import RelatedLinksModalUnavailableView from '../../../examples/vr-related-links-modal/vr-related-links-modal-unavailable-view';
import RelatedLinksModalResolvingView from '../../../examples/vr-related-links-modal/vr-related-links-modal-resolving-view';

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
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
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
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
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
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
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
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
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
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
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
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
});
