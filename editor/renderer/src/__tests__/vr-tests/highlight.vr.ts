import { snapshot } from '@af/visual-regression';
import {
	BackgroundColorDefinedColors,
	BackgroundColorOverlapped,
	BackgroundColorCustomColors,
} from './highlight.fixture';

snapshot(BackgroundColorDefinedColors, {
	description: 'should render six defined highlight text colors',
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

snapshot(BackgroundColorOverlapped, {
	description: 'should render overlapped highlight with inline comments',
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

snapshot(BackgroundColorCustomColors, {
	description: 'should render custom highlight colors',
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
