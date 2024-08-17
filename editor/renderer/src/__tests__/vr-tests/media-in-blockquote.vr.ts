import { snapshot } from '@af/visual-regression';
import { MediaGroupInBlockquote, MediaSingleInBlockquote } from './media-in-blockquote.fixture';

snapshot(MediaSingleInBlockquote, {
	description: 'should render media single inside blockquote',
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
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
});

snapshot(MediaGroupInBlockquote, {
	description: 'should render media group inside blockquote',
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
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
});
