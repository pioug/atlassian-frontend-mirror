import type { Size } from './types';

export const sizes: Record<Size, string> = {
	small: '16px',
	medium: '24px',
	large: '32px',
	xlarge: '48px',
};

export const sizeMap: Record<Size, Size> = {
	small: 'small',
	medium: 'medium',
	large: 'large',
	xlarge: 'xlarge',
};

export const dimensions: {
    readonly small: {
        readonly width: string;
        readonly height: string;
    };
    readonly medium: {
        readonly width: string;
        readonly height: string;
    };
    readonly large: {
        readonly width: string;
        readonly height: string;
    };
    readonly xlarge: {
        readonly width: string;
        readonly height: string;
    };
} = {
	small: {
		width: sizes.small,
		height: sizes.small,
	},
	medium: {
		width: sizes.medium,
		height: sizes.medium,
	},
	large: {
		width: sizes.large,
		height: sizes.large,
	},
	xlarge: {
		width: sizes.xlarge,
		height: sizes.xlarge,
	},
} as const;
