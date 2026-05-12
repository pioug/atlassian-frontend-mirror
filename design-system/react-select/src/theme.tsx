// Used to calculate consistent margin/padding on elements
const baseUnit = 4;
// The minimum height of the control
const controlHeight = 38;
// The amount of space between the control and menu */
const menuGutter = baseUnit * 2;

export const spacing: {
	baseUnit: number;
	controlHeight: number;
	menuGutter: number;
} = {
	baseUnit,
	controlHeight,
	menuGutter,
};

export { colors } from './colors';
