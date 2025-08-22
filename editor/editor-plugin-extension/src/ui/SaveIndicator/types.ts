import type { ReactNode } from 'react';

interface SaveIndicatorRenderOptions {
	onSaveEnded: () => void;
	onSaveStarted: () => void;
}

export interface SaveIndicatorProps {
	children: (options: SaveIndicatorRenderOptions) => ReactNode;
	duration: number;
	visible?: boolean;
}
