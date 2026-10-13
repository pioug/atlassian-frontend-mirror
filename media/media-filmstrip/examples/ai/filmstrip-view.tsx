import React, { useState } from 'react';

import { FilmstripView } from '@atlaskit/media-filmstrip/filmstrip-view';
import type { ScrollEvent } from '@atlaskit/media-filmstrip/filmstrip-view';

const attachmentNames = [
	'Project brief.pdf',
	'Launch checklist.docx',
	'Planning board.png',
	'Customer interview.mp4',
];

export default function FilmstripViewExample(): React.JSX.Element {
	const [offset, setOffset] = useState(0);
	const [animate, setAnimate] = useState(false);
	const [selectedItem, setSelectedItem] = useState('No attachment selected.');
	const handleScroll = ({ offset: nextOffset, animate: shouldAnimate }: ScrollEvent) => {
		setOffset(nextOffset);
		setAnimate(shouldAnimate);
	};

	return (
		<section aria-labelledby="custom-attachments-heading">
			<h2 id="custom-attachments-heading">Custom attachment strip</h2>
			<p aria-live="polite">{selectedItem}</p>
			<FilmstripView offset={offset} animate={animate} onScroll={handleScroll}>
				{attachmentNames.map((name) => (
					<button key={name} type="button" onClick={() => setSelectedItem(`${name} selected.`)}>
						{name}
					</button>
				))}
			</FilmstripView>
		</section>
	);
}
