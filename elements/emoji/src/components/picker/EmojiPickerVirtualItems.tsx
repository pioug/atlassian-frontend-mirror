/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { ReactNode } from 'react';

import type { VirtualItem as VirtualItemContext } from '@tanstack/react-virtual';

export interface RenderItem {
	(context?: VirtualItemContext): ReactNode;
}

export interface VirtualItem<P> {
	height: number;
	props: P;
	renderItem: RenderItem;
}
