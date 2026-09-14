import { snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import Colors from '../../../../examples/1-colors.vr.ap';
import TagDropdownTriggerExamples from '../../../../examples/13-tag-dropdown-trigger.vr.ap';
import Basic from '../../../../examples/vr-tests/basic-tag.vr.ap';
import ElementBeforeStates from '../../../../examples/vr-tests/element-before-states.vr.ap';
import LinkedTagStates from '../../../../examples/vr-tests/linked-tag-states.vr.ap';
import ColorsNonInteractive from '../../../../examples/vr-tests/non-interactive-colors.vr.ap';
import NonInteractiveStates from '../../../../examples/vr-tests/non-interactive-states.vr.ap';
import RemovableAvatar from '../../../../examples/vr-tests/removable-avatar.vr.ap';
import RemovableTagStates from '../../../../examples/vr-tests/removable-tag-states.vr.ap';
import TextMaxLengthComprehensive from '../../../../examples/vr-tests/text-max-length-comprehensive.vr.ap';

const themeVariants: SnapshotTestOptions<any>['variants'] = [
	{
		name: 'light',
		environment: {
			colorScheme: 'light',
		},
	},
];

// Basic tag - with ff on
snapshot(Basic, {
	description: 'tag-basic-visual-uplifts-ff-on',
	featureFlags: {
		'platform-dst-lozenge-tag-badge-visual-uplifts': true,
	},
	variants: themeVariants,
});

// Basic tag - with ff off
snapshot(Basic, {
	description: 'tag-basic-visual-uplifts-ff-off',
	featureFlags: {
		'platform-dst-lozenge-tag-badge-visual-uplifts': false,
	},
	variants: themeVariants,
});

// Colors tag - with ff on
snapshot(Colors, {
	description: 'tag-colors-visual-uplifts-ff-on',
	featureFlags: {
		'platform-dst-lozenge-tag-badge-visual-uplifts': true,
	},
	variants: themeVariants,
});

// Colors tag - with ff off
snapshot(Colors, {
	description: 'tag-colors-visual-uplifts-ff-off',
	featureFlags: {
		'platform-dst-lozenge-tag-badge-visual-uplifts': false,
	},
	variants: themeVariants,
});

// Element before states
snapshot(ElementBeforeStates, {
	states: [
		{
			selector: {
				byTestId: 'elemBeforeBlue-hover',
			},
			state: 'hovered',
		},
		{
			selector: {
				byTestId: 'elemBeforeBlue-focus',
			},
			state: 'focused',
		},
	],
	variants: themeVariants,
});

// Linked tag states
snapshot(LinkedTagStates, {
	states: [
		{
			selector: {
				byTestId: 'linkTag-hover--link',
			},
			state: 'hovered',
		},
		{
			selector: {
				byTestId: 'linkTag-focus--link',
			},
			state: 'focused',
		},
	],
	variants: themeVariants,
});

// Non-interactive states
snapshot(NonInteractiveStates, {
	states: [
		{
			selector: {
				byTestId: 'nonInteractive-hovered',
			},
			state: 'hovered',
		},
		{
			selector: {
				byTestId: 'nonInteractive-focused',
			},
			state: 'focused',
		},
	],
	variants: themeVariants,
});

// Non-interactive colors
snapshot(ColorsNonInteractive, {
	states: [
		{
			selector: {
				byTestId: 'nonInteractive-hovered',
			},
			state: 'hovered',
		},
		{
			selector: {
				byTestId: 'nonInteractive-focused',
			},
			state: 'focused',
		},
	],
	variants: themeVariants,
});

// Removable tag states
snapshot(RemovableTagStates, {
	states: [
		{
			selector: {
				byTestId: 'close-button-removableTag',
			},
			state: 'hovered',
		},
		{
			selector: {
				byTestId: 'close-button-removableTagColor',
			},
			state: 'hovered',
		},
	],
	variants: themeVariants,
});

// Removable avatar
snapshot(RemovableAvatar, {
	states: [
		{
			selector: {
				byTestId: 'close-button-avatarTag',
			},
			state: 'hovered',
		},
		{
			selector: {
				byTestId: 'avatarTag-focused',
			},
			state: 'focused',
		},
	],
	variants: themeVariants,
});

// Text max length comprehensive
snapshot(TextMaxLengthComprehensive, {
	variants: themeVariants,
});

// Tag Dropdown Trigger
snapshot(TagDropdownTriggerExamples, {
	description: 'tag-dropdown-trigger',
	variants: themeVariants,
});
