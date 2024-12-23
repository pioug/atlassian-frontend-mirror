/* eslint-disable @atlaskit/design-system/no-html-button */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

function hyphenate(property: string): string {
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	return property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`).replace(/^ms/, '-ms');
}

function convertToInlineCss(
	properties: React.CSSProperties | Record<`--${string}`, string>,
): string {
	const cssString = Object.entries(properties)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(
			([property, value]) =>
				`${property.startsWith('--') ? property : hyphenate(property)}: ${value};`,
		)
		.join(' ');

	return cssString;
}

const mainStyles = convertToInlineCss({
	minWidth: '100vw',
	minHeight: '100vh',
	maxHeight: '100vh',
	backgroundColor: '#c0c2c23d',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const contentDivStyle = convertToInlineCss({
	backgroundColor: '#f9f9f9',
	padding: '20px',
	marginBottom: '10px',
	borderRadius: '4px',
	width: '700px',
	height: '400px',
	boxShadow: '0 0 5px rgba(0,0,0,0.1)',
});

function VanillaJSApp() {
	const myCustomApp = document.createElement('div');

	myCustomApp.setAttribute('id', 'custom-vanilla-app');
	myCustomApp.setAttribute('data-testid', 'custom-vanilla-app');
	myCustomApp.style.cssText = mainStyles;

	const example = document.querySelector('#examples');
	if (example instanceof HTMLElement) {
		example.style.display = 'none';
	}

	const myPlaceholderDiv = document.createElement('div');
	myPlaceholderDiv.setAttribute('data-testid', 'section-to-replace');
	myPlaceholderDiv.style.cssText = contentDivStyle;
	myPlaceholderDiv.dataset.placeholder = 'true';
	myPlaceholderDiv.innerText = 'Content Div';

	myCustomApp.appendChild(myPlaceholderDiv);

	document.body.appendChild(myCustomApp);
	(window as any).__editor_metrics_tests_tick?.call();

	setTimeout(() => {
		requestAnimationFrame(() => {
			const myDiv = document.createElement('div');
			myDiv.setAttribute('data-testid', 'section-to-replace');
			myDiv.style.cssText = contentDivStyle;
			myDiv.innerText = 'Content Div';

			myCustomApp.replaceChild(myDiv, myPlaceholderDiv);

			(window as any).__editor_metrics_tests_tick?.call();
		});
	}, 150);
}

// The only way to reproduce a similar behavior like Editor Lazy Node View
// is by faking a native vanilla app.
export default function Example() {
	useEffect(() => {
		VanillaJSApp();
	}, []);

	return null;
}
