import { snapshot, Device } from '@af/visual-regression';
import {
	MediaWrappedLayout,
	MediaWrappedLayoutSplit,
	MediaWrappedComplexLayout,
	MediaWrappedComplexResizeLayout,
	MediaWrappedLayoutShiftUp,
	MultipleWrappedMediaInLayout,
} from './media-layout.fixture';

snapshot(MediaWrappedLayout, {
	description: 'should render 2 media items in 1 line when wrapped with text in between',
});

snapshot(MediaWrappedLayoutSplit, {
	description: 'should render 2 media items in 2 lines when wrapped with a large enough width',
});

// ED-14454
snapshot(MediaWrappedLayoutShiftUp, {
	description: 'should not let content outside renderer slide up next to wrapped media',
});

snapshot(MediaWrappedComplexLayout, {
	description: 'should render complex layout',
	variants: [
		{
			name: 'mobile device',
			device: Device.MOBILE_CHROME,
		},
		{
			name: 'desktop device',
			device: Device.DESKTOP_CHROME,
		},
		{
			name: 'desktop wide',
			device: Device.DESKTOP_CHROME_1920_1080,
		},
	],
});

snapshot(MediaWrappedComplexResizeLayout, {
	description: 'should render complex resize layout',
	variants: [
		{
			name: 'mobile device',
			device: Device.MOBILE_CHROME,
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'desktop device',
			device: Device.DESKTOP_CHROME,
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'desktop wide',
			device: Device.DESKTOP_CHROME_1920_1080,
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(MultipleWrappedMediaInLayout, {
	description: 'should render multiple and single wrapped media with correct margin',
});
