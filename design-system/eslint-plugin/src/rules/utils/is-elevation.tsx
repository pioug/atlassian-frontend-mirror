import type tokens from '@atlaskit/tokens/token-names';

const legacyElevation: Record<
	string,
	{ background: keyof typeof tokens; shadow: keyof typeof tokens }
> = {
	e100: {
		background: 'elevation.surface.raised',
		shadow: 'elevation.shadow.raised',
	},
	e200: {
		background: 'elevation.surface.overlay',
		shadow: 'elevation.shadow.overlay',
	},
	e300: {
		background: 'elevation.surface.overlay',
		shadow: 'elevation.shadow.overlay',
	},
	e400: {
		background: 'elevation.surface.overlay',
		shadow: 'elevation.shadow.overlay',
	},
	e500: {
		background: 'elevation.surface.overlay',
		shadow: 'elevation.shadow.overlay',
	},
};

export const isLegacyElevation: (name: string) =>
	| false
	| {
			background: keyof typeof tokens;
			shadow: keyof typeof tokens;
	  } = (name: string) => {
	if (Object.keys(legacyElevation).includes(name)) {
		return legacyElevation[name];
	}

	return false;
};
