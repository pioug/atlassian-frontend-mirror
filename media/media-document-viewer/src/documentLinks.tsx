/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- TODO: migrate to @atlaskit/primitives/compiled
import Anchor from '@atlaskit/primitives/anchor';

import { type Link } from './types';

const foreignObjectProps = {
	xmlns: 'http://www.w3.org/1999/xhtml',
};

const anchorStyles = {
	display: 'block',
	width: '100%',
	height: '100%',
};

const DocumentLink = ({
	link,
	dataTestId,
	appendUpTo,
}: {
	link: Link;
	dataTestId?: string;
	/**
	 * Called when a local `#page-N` anchor is clicked inside the document.
	 * Fast-forwards the lazy page count so `id="page-N"` exists in the DOM
	 * before the browser performs the native anchor scroll.
	 * Only provided when `enableLazyPageRendering` is true.
	 */
	appendUpTo?: (n: number) => void;
}) => {
	return (
		<foreignObject x={link.x} y={-link.y} width={link.w} height={link.h} data-testid={dataTestId}>
			{link.type === 'uri' ? (
				<Anchor
					{...foreignObjectProps}
					href={link.dest}
					target="_blank"
					rel="noopener noreferrer"
					style={anchorStyles}
				/>
			) : (
				<Anchor
					{...foreignObjectProps}
					href={`#page-${link.p_num + 1}`}
					style={anchorStyles}
					onClick={appendUpTo ? () => appendUpTo(link.p_num + 1) : undefined}
				/>
			)}
		</foreignObject>
	);
};

export const DocumentLinks = ({
	links,
	appendUpTo,
}: {
	links: readonly Link[];
	appendUpTo?: (n: number) => void;
}): React.JSX.Element => {
	return (
		<>
			{links.map((link, i) => (
				<DocumentLink
					link={link}
					dataTestId={`document-link-${i}`}
					appendUpTo={appendUpTo}
					key={i}
				/>
			))}
		</>
	);
};
