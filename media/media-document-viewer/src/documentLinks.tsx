/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
import React from 'react';

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

const DocumentLink = ({ link, dataTestId }: { link: Link; dataTestId?: string }) => {
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
				<Anchor {...foreignObjectProps} href={`#page-${link.p_num + 1}`} style={anchorStyles} />
			)}
		</foreignObject>
	);
};

export const DocumentLinks = ({ links }: { links: readonly Link[] }) => {
	return (
		<>
			{links.map((link, i) => (
				<DocumentLink link={link} dataTestId={`document-link-${i}`} key={i} />
			))}
		</>
	);
};
