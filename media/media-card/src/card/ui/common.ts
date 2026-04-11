export enum Breakpoint {
	SMALL = 'small',
	LARGE = 'large',
}

export const responsiveSettings: {
	small: {
		fontSize: number;
		lineHeight: number;
		titleBox: {
			verticalPadding: number;
			horizontalPadding: number;
		};
	};
	large: {
		fontSize: number;
		lineHeight: number;
		titleBox: {
			verticalPadding: number;
			horizontalPadding: number;
		};
	};
} = {
	[Breakpoint.SMALL]: {
		fontSize: 11,
		lineHeight: 14,
		titleBox: {
			verticalPadding: 4,
			horizontalPadding: 8,
		},
	},
	[Breakpoint.LARGE]: {
		fontSize: 14,
		lineHeight: 22,
		titleBox: {
			verticalPadding: 8,
			horizontalPadding: 12,
		},
	},
};

export const getTitleBoxHeight = (breakpoint: Breakpoint): number =>
	(responsiveSettings[breakpoint].lineHeight +
		responsiveSettings[breakpoint].titleBox.verticalPadding) *
	2;
