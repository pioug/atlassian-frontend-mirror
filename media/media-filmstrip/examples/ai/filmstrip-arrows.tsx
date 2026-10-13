import React, { useState } from 'react';

import { LeftArrow } from '@atlaskit/media-filmstrip/wrappers';
import { RightArrow } from '@atlaskit/media-filmstrip/wrappers';

const attachmentNames = ['Project brief.pdf', 'Launch checklist.docx', 'Planning board.png'];

export default function FilmstripArrowsExample(): React.JSX.Element {
	const [index, setIndex] = useState(0);
	const currentName = attachmentNames[index];

	return (
		<section aria-labelledby="attachment-navigation-heading">
			<h2 id="attachment-navigation-heading">Browse attachments</h2>
			<nav aria-label="Attachment navigation">
				{index > 0 && <LeftArrow onClick={() => setIndex((current) => Math.max(0, current - 1))} />}
				<span aria-live="polite">
					{currentName} ({index + 1} of {attachmentNames.length})
				</span>
				{index < attachmentNames.length - 1 && (
					<RightArrow
						onClick={() => setIndex((current) => Math.min(attachmentNames.length - 1, current + 1))}
					/>
				)}
			</nav>
		</section>
	);
}
