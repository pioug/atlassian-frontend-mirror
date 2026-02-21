import memoizeOne, { type MemoizedFn } from 'memoize-one';
import { type Placement } from '@atlaskit/popper';

import { type Target, type BoundariesElement, type RootBoundary } from '../types';

export const getPopupProps: MemoizedFn<
	(
		width: string | number,
		target: Target,
		onFlip: (data: any) => any,
		boundariesElement?: BoundariesElement,
		offset?: number[],
		placement?: Placement,
		rootBoundary?: RootBoundary,
		shouldFlip?: boolean,
		popupTitle?: string,
		strategy?: 'fixed' | 'absolute',
	) => {
		autoFocus: boolean;
		controlShouldRenderValue: boolean;
		maxMenuWidth: string | number;
		minMenuWidth: string | number;
		popperProps: {
			modifiers: (
				| {
						enabled?: undefined;
						fn?: undefined;
						name: string;
						options: {
							boundary?: undefined;
							offset: number[] | undefined;
							rootBoundary?: undefined;
						};
						order?: undefined;
				  }
				| {
						enabled: boolean;
						fn: (data: any) => any;
						name: string;
						options?: undefined;
						order: number;
				  }
				| {
						enabled?: undefined;
						fn?: undefined;
						name: string;
						options: {
							boundary: BoundariesElement | undefined;
							offset?: undefined;
							rootBoundary: RootBoundary | undefined;
						};
						order?: undefined;
				  }
				| {
						enabled: boolean | undefined;
						fn?: undefined;
						name: string;
						options?: undefined;
						order?: undefined;
				  }
			)[];
			placement: Placement;
			strategy: 'fixed' | 'absolute';
		};
		popupTitle: string | undefined;
		searchThreshold: number;
		target: Target;
	}
> = memoizeOne(
	(
		width: string | number,
		target: Target,
		onFlip: (data: any) => any,
		boundariesElement?: BoundariesElement,
		offset?: number[],
		placement?: Placement,
		rootBoundary?: RootBoundary,
		shouldFlip?: boolean,
		popupTitle?: string,
		strategy?: 'fixed' | 'absolute',
	): {
		autoFocus: boolean;
		controlShouldRenderValue: boolean;
		maxMenuWidth: string | number;
		minMenuWidth: string | number;
		popperProps: {
			modifiers: (
				| {
						enabled?: undefined;
						fn?: undefined;
						name: string;
						options: {
							boundary?: undefined;
							offset: number[] | undefined;
							rootBoundary?: undefined;
						};
						order?: undefined;
				  }
				| {
						enabled: boolean;
						fn: (data: any) => any;
						name: string;
						options?: undefined;
						order: number;
				  }
				| {
						enabled?: undefined;
						fn?: undefined;
						name: string;
						options: {
							boundary: BoundariesElement | undefined;
							offset?: undefined;
							rootBoundary: RootBoundary | undefined;
						};
						order?: undefined;
				  }
				| {
						enabled: boolean | undefined;
						fn?: undefined;
						name: string;
						options?: undefined;
						order?: undefined;
				  }
			)[];
			placement: Placement;
			strategy: 'fixed' | 'absolute';
		};
		popupTitle: string | undefined;
		searchThreshold: number;
		target: Target;
	} => ({
		searchThreshold: -1,
		controlShouldRenderValue: true,
		minMenuWidth: width,
		maxMenuWidth: width,
		autoFocus: false,
		target,
		popupTitle,
		popperProps: {
			placement: placement || 'auto',
			strategy: strategy || 'fixed',
			modifiers: [
				{
					name: 'offset',
					options: {
						offset,
					},
				},
				{
					name: 'handleFlipStyle',
					enabled: true,
					order: 910,
					fn: (data: any) => onFlip(data),
				},
				{
					name: 'preventOverflow',
					options: {
						rootBoundary: rootBoundary,
						boundary: boundariesElement,
					},
				},
				{
					name: 'flip',
					enabled: shouldFlip,
				},
			],
		},
	}),
);
