/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

export const CardBox = ({ title, children }: { title: string; children: React.ReactNode }) => (
	<div style={{ marginBottom: '10px' }}>
		<h3 style={{ textAlign: 'center' }}>{title}</h3>
		{children}
	</div>
);

export const CardRow = ({ children }: { children: React.ReactNode }) => (
	<div
		style={{
			display: 'flex',
			flexWrap: 'wrap',
			gap: '10px',
			marginBottom: '10px',
		}}
	>
		{children}
	</div>
);
