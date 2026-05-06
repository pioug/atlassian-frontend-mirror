import { legacyColorMixins } from './legacy-color-mixins';

export const isLegacyNamedColor: (value: string) => boolean = (value: string) =>
	legacyColorMixins.includes(value);
