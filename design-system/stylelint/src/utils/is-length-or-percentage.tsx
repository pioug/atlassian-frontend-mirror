import { type Node } from 'postcss-value-parser';

const lengthAndPercentageUnitsPattern =
	/cm$|mm$|Q$|pc$|pt$|px$|%$|em$|ex$|ch$|rem$|lh$|rlh$|vw$|vh$|vmin$|vmax$|vb$|vi$|svw$|svh$|lvw$|lvh$|dvw$|dvh$|^-?[0-9]+(\.[0-9]+)*$/;

export const isLengthOrPercentage = (value: Node['value']): boolean =>
	lengthAndPercentageUnitsPattern.test(value);
