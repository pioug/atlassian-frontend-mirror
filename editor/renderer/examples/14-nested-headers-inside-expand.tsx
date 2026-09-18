/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useEffect, useState } from 'react';

/* eslint-disable @typescript-eslint/consistent-type-imports, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic */
import { jsx, css } from '@emotion/react';

import Button from '@atlaskit/button/default/button';
import RadioGroup from '@atlaskit/radio/radio-group';
import type { OptionsPropType } from '@atlaskit/radio/types';
import { token } from '@atlaskit/tokens';

import nestedHeadersAdf from '../src/__tests__/__fixtures__/nested-headings-adf.json';
import RendererDemo from './helper/RendererDemo';

const getHeaderIdsAsRadioOptions = () =>
	Array.from(document.querySelectorAll('.heading-anchor-wrapper')).map(({ parentElement }) => {
		const headingId = parentElement && parentElement.getAttribute('id');

		return {
			value: headingId === null ? undefined : headingId,
			label: headingId,
			name: 'headingids',
		};
	});

const headersIdListStyle = css({
	display: 'flex',
	flexWrap: 'wrap',
});

const containerStyle = css({
	display: 'inline-block',
	marginTop: token('space.150'),
	marginBottom: token('space.150'),
});

export default function Example(): jsx.JSX.Element {
	const [headings, setHeadings] = useState<OptionsPropType | undefined>();
	const [activeHeadingId, setActiveHeadingId] = useState<string | undefined>();
	const [rendererDemoExampleKey, setRendererDemoExampleKey] = useState(1);

	useEffect(() => {
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		window.addEventListener('load', () => {
			setHeadings(getHeaderIdsAsRadioOptions());
		});
	}, []);

	useEffect(() => {
		setHeadings(getHeaderIdsAsRadioOptions());
	}, [rendererDemoExampleKey]);

	return (
		<RendererDemo
			key={`renderer-demo-example-${rendererDemoExampleKey}`}
			serializer="react"
			document={nestedHeadersAdf}
			disableSidebar
			disableEventHandlers
			actionButtons={
				<div css={containerStyle}>
					<h4>Header Ids:</h4>
					<div css={headersIdListStyle}>
						{headings ? (
							<RadioGroup
								options={headings}
								onChange={(event) => setActiveHeadingId(event.currentTarget.value)}
							/>
						) : null}
					</div>
					<Button
						onClick={() => {
							setActiveHeadingId(undefined);
							setRendererDemoExampleKey(rendererDemoExampleKey + 1);
						}}
					>
						Reset Document
					</Button>
				</div>
			}
			onDocumentChange={() => setHeadings(getHeaderIdsAsRadioOptions())}
			allowHeadingAnchorLinks={{
				allowNestedHeaderLinks: true,
				activeHeadingId,
			}}
		/>
	);
}
