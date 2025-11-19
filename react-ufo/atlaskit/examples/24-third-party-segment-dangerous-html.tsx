/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */
import { useEffect, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment, { UFOThirdPartySegment } from '@atlaskit/react-ufo/segment';

const containerStyle = css({
	display: 'flex',
	flexDirection: 'column',
	gap: '20px',
	padding: '20px',
	fontFamily: 'Arial, sans-serif',
});

const sectionStyle = css({
	borderColor: '#dddddd',
	borderStyle: 'solid',
	borderWidth: '2px',
	borderRadius: '8px',
	padding: '20px',
	backgroundColor: '#f9f9f9',
});

const thirdPartyStyle = css({
	backgroundColor: '#f5f5f5',
	borderColor: '#666666',
	borderStyle: 'dashed',
	borderWidth: '2px',
});

const htmlContentStyle = css({
	marginTop: '15px',
	padding: '10px',
	backgroundColor: '#ffffff',
	borderColor: '#cccccc',
	borderStyle: 'solid',
	borderWidth: '1px',
	borderRadius: '4px',
});

const THIRD_PARTY_CONTENT = `
		<div style="background: #e0e0e0; padding: 20px; border-radius: 8px; color: black;">
			<h3>Third-Party Widget</h3>
			<div style="background: #d0d0d0; padding: 15px; margin: 10px 0;">
				<p>Widget container with some content</p>
				<p>This simulates third-party content loaded via dangerouslySetInnerHTML</p>
			</div>
		</div>
	`;

// Component that simulates third-party content loading
const ThirdPartyContent = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [content, setContent] = useState<string>('');
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Simulate async loading of third-party content
		const timer = setTimeout(() => {
			setContent(THIRD_PARTY_CONTENT);
			setIsLoading(false);
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (!isLoading && containerRef.current) {
			const childElement = containerRef.current.querySelector('h3');
			if (childElement) {
				const mutationIndicator = document.createElement('p');
				childElement.appendChild(mutationIndicator);

				mutationIndicator.setAttribute('data-mutation-test', 'mutated-immediately');
				mutationIndicator.innerHTML =
					'Mutation - This is a very long text that will cause layout shift';
				mutationIndicator.style.color = 'red';
				mutationIndicator.style.fontWeight = 'bold';
				mutationIndicator.style.margin = '20px 0';
				mutationIndicator.style.padding = '15px';
				mutationIndicator.style.width = '400px';
				mutationIndicator.style.height = '60px';
				mutationIndicator.style.backgroundColor = '#ffcccc';
				mutationIndicator.style.border = '2px solid #ff0000';
				mutationIndicator.style.borderRadius = '8px';
				mutationIndicator.style.fontSize = '16px';
				mutationIndicator.style.lineHeight = '1.2';
				mutationIndicator.style.overflow = 'visible'; // Allow overflow to affect layout
			}
		}
	}, [isLoading]);

	if (isLoading) {
		return <UFOLoadHold name="content-loading"></UFOLoadHold>;
	}

	return (
		<UFOThirdPartySegment name="third-party-widget">
			<div
				ref={containerRef}
				css={htmlContentStyle}
				dangerouslySetInnerHTML={{ __html: content }}
				data-dynamic-content
			/>
		</UFOThirdPartySegment>
	);
};

// Main App component
export default function Example(): JSX.Element {
	return (
		<UFOSegment name="dangerous-html-example-root">
			<div css={containerStyle}>
				<h1>UFO Third-Party Segment with dangerouslySetInnerHTML Example</h1>
				<div css={[sectionStyle, thirdPartyStyle]}>
					<p>This simulates a widget loaded via dangerouslySetInnerHTML:</p>
					<ThirdPartyContent />
				</div>
			</div>
		</UFOSegment>
	);
}
