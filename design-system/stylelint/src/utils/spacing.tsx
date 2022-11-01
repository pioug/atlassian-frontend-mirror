import { Node } from 'postcss-value-parser';

// https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units
const lengthAndPercentageUnitsPattern = /cm$|mm$|Q$|pc$|pt$|px$|%$|em$|ex$|ch$|rem$|lh$|rlh$|vw$|vh$|vmin$|vmax$|vb$|vi$|svw$|svh$|lvw$|lvh$|dvw$|dvh$|^-?[0-9]+(\.[0-9]+)*$/;

export const isLengthOrPercentage = (value: Node['value']): boolean =>
  lengthAndPercentageUnitsPattern.test(value);
