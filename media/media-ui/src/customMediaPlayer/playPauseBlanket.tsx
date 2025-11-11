import React from 'react';
import { PlayPauseBlanket as CompiledPlayPauseBlanket } from './playPauseBlanket-compiled';

export const PlayPauseBlanket = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => (
	<CompiledPlayPauseBlanket {...props} />
);
