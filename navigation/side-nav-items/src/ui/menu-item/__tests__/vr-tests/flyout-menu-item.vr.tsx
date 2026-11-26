import { Device, snapshot } from '@af/visual-regression';

import {
	FlyoutMenuItemDefaultOpenExample,
	FlyoutMenuItemDefaultOpenRTL,
	FlyoutMenuItemDefaultOpenSelectedVR,
	FlyoutMenuItemExample,
	FlyoutMenuItemRTL,
	FlyoutMenuItemSingleItemDefaultOpen,
	FlyoutMenuItemSlotsManyDefaultOpen,
	FlyoutMenuItemWithNestedPopupDefaultOpenExample,
} from '../../../../../examples/flyout-menu-item.vr.ap';

const variants = {
	desktop: {
		environment: { colorScheme: 'light' },
		name: 'default',
	},
	mobile: {
		device: Device.MOBILE_CHROME,
		environment: { colorScheme: 'light' },
		name: 'mobile',
	},
} as const;

snapshot(FlyoutMenuItemExample, {
	variants: [variants.desktop],
});

snapshot(FlyoutMenuItemDefaultOpenExample, {
	variants: [variants.desktop],
	drawsOutsideBounds: true,
});

snapshot(FlyoutMenuItemDefaultOpenSelectedVR, {
	variants: [variants.desktop],
	drawsOutsideBounds: true,
});

snapshot(FlyoutMenuItemRTL, {
	variants: [variants.desktop],
});

snapshot(FlyoutMenuItemDefaultOpenRTL, {
	variants: [variants.desktop],
	drawsOutsideBounds: true,
});

snapshot(FlyoutMenuItemWithNestedPopupDefaultOpenExample, {
	description: 'A flyout menu with a nested popup using `shouldRenderToParent`',
	variants: [variants.desktop],
	drawsOutsideBounds: true,
});

snapshot(FlyoutMenuItemSingleItemDefaultOpen, {
	description: 'Flyout body item focus ring is not clipped',
	variants: [variants.desktop],
	drawsOutsideBounds: true,
	states: [
		{ state: 'focused', selector: { byRole: 'button', options: { name: 'Button menu item' } } },
	],
});

snapshot(FlyoutMenuItemSlotsManyDefaultOpen, {
	description:
		'A flyout menu with many items does not exceed the bounds of the window and should have a visible footer',
	variants: [variants.desktop],
	drawsOutsideBounds: true,
});
// TODO(top-layer): with `platform-dst-motion-uplift-popup` on (production), compositional
// `PopupContent` does not pass `zIndex` to the motion container, so on mobile the `UNSAFE_modal-
// below-sm` blanket paints over the flyout. The top layer should fix this.
snapshot.skip(FlyoutMenuItemSlotsManyDefaultOpen, {
	description:
		'A flyout menu with many items does not exceed the bounds of the window and should have a visible footer',
	variants: [variants.mobile],
	drawsOutsideBounds: true,
});
