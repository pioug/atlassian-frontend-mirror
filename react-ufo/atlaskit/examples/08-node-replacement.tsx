/* eslint-disable @atlaskit/design-system/no-html-button */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';

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

const mainStyles = css({
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
	width: '80vw',
	height: '80vh',
	boxShadow: '0 0 5px rgba(0,0,0,0.1)',
});

function VanillaJSApp(target: HTMLElement, onDone: () => void) {
	const myPlaceholderDiv = document.createElement('div');
	myPlaceholderDiv.setAttribute('data-testid', 'section-to-replace-placeholder');
	myPlaceholderDiv.style.cssText = contentDivStyle;
	myPlaceholderDiv.dataset.placeholder = 'true';
	myPlaceholderDiv.innerText = 'Content Div';

	target.appendChild(myPlaceholderDiv);

	setTimeout(() => {
		requestAnimationFrame(() => {
			const myDiv = document.createElement('div');
			myDiv.setAttribute('data-testid', 'section-to-replace-final');
			myDiv.style.cssText = contentDivStyle;
			myDiv.innerText = 'Content Div';

			target.replaceChild(myDiv, myPlaceholderDiv);

			requestAnimationFrame(() => {
				onDone();
			});
		});
	}, 500);
}

// The only way to reproduce a similar behavior like Editor Lazy Node View
// is by faking a native vanilla app.
export default function Example() {
	const contentRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!contentRef.current) {
			return;
		}

		setTimeout(() => {
			if (!contentRef.current) {
				return;
			}

			VanillaJSApp(contentRef.current, () => {
				setIsLoading(false);
			});
		}, 200);
	}, []);

	return (
		<UFOSegment name="app-root">
			<UFOLoadHold name="app-to-replace" hold={isLoading} />
			<div data-testid="main" ref={contentRef} css={mainStyles} data-vc-ignore-if-no-layout-shift={true}></div>
		</UFOSegment>
	);
}
