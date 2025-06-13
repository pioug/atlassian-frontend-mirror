/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { DocumentViewer } from '../src/documentViewer';

const style = css({
	position: 'fixed',
	top: '10px',
	left: '10px',
	zIndex: '1000',
	backgroundColor: 'white',
	padding: '10px',
	borderRadius: '5px',
	boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
});

export default function Basic() {
	const [source, setSource] = useState(
		'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
	);
	const [zoom, setZoom] = useState(1.75);
	const getContent = async (pageStart: number, pageEnd: number) => {
		const res = await fetch(
			`http://localhost:3000/document/content?source=${source}&pageStart=${pageStart}&pageEnd=${pageEnd}`,
		);
		if (!res.ok) {
			return {};
		}
		const json = await res.json();
		return json;
	};
	const getPageImageUrl = async (pageNumber: number, zoom: number) => {
		return fetch(
			`http://localhost:3000/document/page?source=${source}&page=${pageNumber}&zoom=${zoom}`,
		)
			.then((res) => res.blob())
			.then((blob) => URL.createObjectURL(blob));
	};

	const [isServerRunning, setIsServerRunning] = useState(false);
	useEffect(() => {
		fetch('http://localhost:3000/health').then((res) => {
			if (res.ok) {
				setIsServerRunning(true);
			}
		});
	}, []);

	if (!isServerRunning) {
		return <div>Server is not running. Please start the server from media-document-processor.</div>;
	}

	return (
		<div>
			<div css={style}>
				<input type="text" value={source} onChange={(e) => setSource(e.target.value)} />
				{/* eslint-disable-next-line @atlaskit/design-system/no-html-select */}
				<select value={zoom} onChange={(e) => setZoom(Number(e.target.value))}>
					<option value={0.5}>0.5</option>
					<option value={0.75}>0.75</option>
					<option value={1}>1</option>
					<option value={1.25}>1.25</option>
					<option value={1.5}>1.5</option>
					<option value={1.75}>1.75</option>
					<option value={2}>2</option>
					<option value={2.5}>2.5</option>
					<option value={3}>3</option>
				</select>
			</div>
			<DocumentViewer
				getContent={getContent}
				getPageImageUrl={getPageImageUrl}
				zoom={zoom}
				key={source}
			/>
		</div>
	);
}
