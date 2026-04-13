import { generateTheme, type NavigationTheme } from '@atlaskit/atlassian-navigation';

export const theme: NavigationTheme[] = [
	generateTheme({
		name: 'atlassian',
		backgroundColor: '#0052CC',
		highlightColor: '#FFFFFF',
	}),
	generateTheme({
		name: 'settings',
		backgroundColor: '#172B4D',
		highlightColor: '#FFFFFF',
	}),
	generateTheme({
		name: 'white',
		backgroundColor: '#FFFFFF',
		highlightColor: '#172B4D',
	}),
	generateTheme({
		name: 'red',
		backgroundColor: '#FF5630',
		highlightColor: '#FFFFFF',
	}),
	generateTheme({
		name: 'orange',
		backgroundColor: '#FFAB00',
		highlightColor: '#172B4D',
	}),
	generateTheme({
		name: 'yellow',
		backgroundColor: '#ffff00',
		highlightColor: '#172B4D',
	}),
	generateTheme({
		name: 'green',
		backgroundColor: '#36B37E',
		highlightColor: '#172B4D',
	}),
	generateTheme({
		name: 'blue',
		backgroundColor: '#00B8D9',
		highlightColor: '#172B4D',
	}),
	generateTheme({
		name: 'violet',
		backgroundColor: '#6554C0',
		highlightColor: '#FFFFFF',
	}),
	generateTheme({
		name: 'pink',
		backgroundColor: '#fec8d8',
		highlightColor: '#172B4D',
	}),
];

export const themes: NavigationTheme[] = [
	generateTheme({
		name: 'huge',
		backgroundColor: '#FFFFFF',
		highlightColor: '#D8388A',
	}),
	generateTheme({
		name: 'showpo',
		backgroundColor: '#E8CBD2',
		highlightColor: '#333333',
	}),
	generateTheme({
		name: 'up',
		backgroundColor: '#EF816B',
		highlightColor: '#FDEE80',
	}),
	generateTheme({
		name: '86400',
		backgroundColor: '#000448',
		highlightColor: '#6FF2B4',
	}),
	generateTheme({
		name: 'netflix',
		backgroundColor: '#272727',
		highlightColor: '#E94E34',
	}),
	generateTheme({
		// naming a theme "atlassian" forces the theme to be the default theme; the colors below aren't used
		name: 'atlassian',
		backgroundColor: '#0052CC',
		highlightColor: '#FFFFFF',
	}),
];
