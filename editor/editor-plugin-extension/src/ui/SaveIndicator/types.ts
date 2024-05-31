import type { ReactNode } from 'react';

interface SaveIndicatorRenderOptions {
	onSaveStarted: () => void;
	onSaveEnded: () => void;
}

export interface SaveIndicatorProps {
	children: (options: SaveIndicatorRenderOptions) => ReactNode;
	duration: number;
	visible?: boolean;
}
