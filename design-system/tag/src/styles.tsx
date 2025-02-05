import { token } from '@atlaskit/tokens';

// Text colors
export const textColors = {
	standard: token('color.text', '#253858'),
	standardLink: token('color.link', '#0052CC'),
	blue: token('color.text.accent.blue.bolder', '#172B4D'),
	red: token('color.text.accent.red.bolder', '#172B4D'),
	yellow: token('color.text.accent.yellow.bolder', '#172B4D'),
	green: token('color.text.accent.green.bolder', '#172B4D'),
	teal: token('color.text.accent.teal.bolder', '#172B4D'),
	purple: token('color.text.accent.purple.bolder', '#172B4D'),
	lime: token('color.text.accent.lime.bolder', '#37471F'),
	magenta: token('color.text.accent.magenta.bolder', '#50253F'),
	orange: token('color.text.accent.orange.bolder', '#5F3811'),
	grey: token('color.text.accent.gray.bolder', '#FFFFFF'),
	blueLight: token('color.text.accent.blue', '#0747A6'),
	redLight: token('color.text.accent.red', '#42526E'),
	yellowLight: token('color.text.accent.yellow', '#42526E'),
	greenLight: token('color.text.accent.green', '#006644'),
	tealLight: token('color.text.accent.teal', '#42526E'),
	purpleLight: token('color.text.accent.purple', '#403294'),
	limeLight: token('color.text.accent.lime', '#4C6B1F'),
	magentaLight: token('color.text.accent.magenta', '#943D73'),
	orangeLight: token('color.text.accent.orange', '#974F0C'),
	greyLight: token('color.text.accent.gray', '#42526E'),
};

// Border colors - Hardcoded for Visual Refresh
export const borderColors = {
	standard: '#B7B9BE',
	blue: '#669DF1',
	red: '#F87168',
	yellow: '#DDB30E',
	green: '#4BCE97',
	teal: '#6CC3E0',
	purple: '#C97CF4',
	lime: '#94C748',
	magenta: '#E774BB',
	orange: '#FCA700',
	grey: '#B7B9BE',
	standardLink: '#B7B9BE',
	blueLight: '#669DF1',
	redLight: '#F87168',
	yellowLight: '#DDB30E',
	greenLight: '#4BCE97',
	tealLight: '#6CC3E0',
	purpleLight: '#C97CF4',
	limeLight: '#94C748',
	magentaLight: '#E774BB',
	orangeLight: '#FCA700',
	greyLight: '#B7B9BE',
};

/**
 * With design tokens, hover colors do not change
 * compared to resting state. These are only here
 * for backwards compatibiltiy with legacy theming.
 * This can be removed when legacy theming is removed
 */
export const textHoverColors = {
	standard: token('color.link', '#0065FF'),
	blue: token('color.text.accent.blue.bolder', '#172B4D'),
	red: token('color.text.accent.red.bolder', '#172B4D'),
	yellow: token('color.text.accent.yellow.bolder', '#172B4D'),
	green: token('color.text.accent.green.bolder', '#172B4D'),
	teal: token('color.text.accent.teal.bolder', '#172B4D'),
	purple: token('color.text.accent.purple.bolder', '#172B4D'),
	lime: token('color.text.accent.lime.bolder', '#37471F'),
	magenta: token('color.text.accent.magenta.bolder', '#50253F'),
	orange: token('color.text.accent.orange.bolder', '#5F3811'),
	grey: token('color.text.accent.gray.bolder', '#FFFFFF'),
	blueLight: token('color.text.accent.blue', '#0747A6'),
	redLight: token('color.text.accent.red', '#42526E'),
	yellowLight: token('color.text.accent.yellow', '#42526E'),
	greenLight: token('color.text.accent.green', '#006644'),
	tealLight: token('color.text.accent.teal', '#42526E'),
	purpleLight: token('color.text.accent.purple', '#403294'),
	limeLight: token('color.text.accent.lime', '#4C6B1F'),
	magentaLight: token('color.text.accent.magenta', '#943D73'),
	orangeLight: token('color.text.accent.orange', '#974F0C'),
	greyLight: token('color.text.accent.gray', '#42526E'),
};

export const textActiveColors = {
	standard: token('color.link.pressed', '#0065FF'),
	blue: token('color.text.accent.blue', '#172B4D'),
	red: token('color.text.accent.red', '#172B4D'),
	yellow: token('color.text.accent.yellow', '#172B4D'),
	green: token('color.text.accent.green', '#172B4D'),
	teal: token('color.text.accent.teal', '#172B4D'),
	purple: token('color.text.accent.purple', '#172B4D'),
	lime: token('color.text.accent.lime', '#4C6B1F'),
	magenta: token('color.text.accent.magenta', '#943D73'),
	orange: token('color.text.accent.orange', '#974F0C'),
	grey: token('color.text.accent.gray', '#FFFFFF'),
	blueLight: token('color.text.accent.blue.bolder', '#0747A6'),
	redLight: token('color.text.accent.red.bolder', '#42526E'),
	yellowLight: token('color.text.accent.yellow.bolder', '#42526E'),
	greenLight: token('color.text.accent.green.bolder', '#006644'),
	tealLight: token('color.text.accent.teal.bolder', '#42526E'),
	purpleLight: token('color.text.accent.purple.bolder', '#403294'),
	limeLight: token('color.text.accent.lime.bolder', '#37471F'),
	magentaLight: token('color.text.accent.magenta.bolder', '#50253F'),
	orangeLight: token('color.text.accent.orange.bolder', '#5F3811'),
	greyLight: token('color.text.accent.gray.bolder', '#42526E'),
};

// Background colors
export const backgroundColors = {
	standard: token('color.background.neutral', '#F4F5F7'),
	blue: token('color.background.accent.blue.subtle', '#4C9AFF'),
	red: token('color.background.accent.red.subtle', '#FF8F73'),
	yellow: token('color.background.accent.yellow.subtle', '#FFC400'),
	green: token('color.background.accent.green.subtle', '#57D9A3'),
	teal: token('color.background.accent.teal.subtle', '#00C7E6'),
	purple: token('color.background.accent.purple.subtle', '#998DD9'),
	lime: token('color.background.accent.lime.subtle', '#94C748'),
	magenta: token('color.background.accent.magenta.subtle', '#E774BB'),
	orange: token('color.background.accent.orange.subtle', '#FAA53D'),
	grey: token('color.background.accent.gray.subtle', '#42526E'),
	blueLight: token('color.background.accent.blue.subtler', '#B3D4FF'),
	redLight: token('color.background.accent.red.subtler', '#FFBDAD'),
	yellowLight: token('color.background.accent.yellow.subtler', '#FFE380'),
	greenLight: token('color.background.accent.green.subtler', '#79F2C0'),
	tealLight: token('color.background.accent.teal.subtler', '#79E2F2'),
	purpleLight: token('color.background.accent.purple.subtler', '#C0B6F2'),
	limeLight: token('color.background.accent.lime.subtler', '#D3F1A7'),
	magentaLight: token('color.background.accent.magenta.subtler', '#FDD0EC'),
	orangeLight: token('color.background.accent.orange.subtler', '#FFE2BD'),
	greyLight: token('color.background.accent.gray.subtler', '#EBECF0'),
};

export const linkHoverBackgroundColors = {
	standard: token('color.background.neutral.hovered', '#EBECF0'),
	blue: token('color.background.accent.blue.subtle.hovered', '#B3D4FF'),
	red: token('color.background.accent.red.subtle.hovered', '#FFBDAD'),
	yellow: token('color.background.accent.yellow.subtle.hovered', '#FFE380'),
	green: token('color.background.accent.green.subtle.hovered', '#79F2C0'),
	teal: token('color.background.accent.teal.subtle.hovered', '#79E2F2'),
	purple: token('color.background.accent.purple.subtle.hovered', '#C0B6F2'),
	lime: token('color.background.accent.lime.subtle.hovered', '#B3DF72'),
	magenta: token('color.background.accent.magenta.subtle.hovered', '#F797D2'),
	orange: token('color.background.accent.orange.subtle.hovered', '#FEC57B'),
	grey: token('color.background.accent.gray.subtle.hovered', '#505F79'),
	blueLight: token('color.background.accent.blue.subtler.hovered', '#DEEBFF'),
	redLight: token('color.background.accent.red.subtler.hovered', '#FFEBE6'),
	yellowLight: token('color.background.accent.yellow.subtler.hovered', '#FFF0B3'),
	greenLight: token('color.background.accent.green.subtler.hovered', '#ABF5D1'),
	tealLight: token('color.background.accent.teal.subtler.hovered', '#B3F5FF'),
	purpleLight: token('color.background.accent.purple.subtler.hovered', '#EAE6FF'),
	limeLight: token('color.background.accent.lime.subtler.hovered', '#B3DF72'),
	magentaLight: token('color.background.accent.magenta.subtler.hovered', '#F797D2'),
	orangeLight: token('color.background.accent.orange.subtler.hovered', '#FEC57B'),
	greyLight: token('color.background.accent.gray.subtler.hovered', '#DFE1E6'),
};

export const linkActiveBackgroundColors = {
	standard: token('color.background.neutral.pressed', '#EBECF0'),
	blue: token('color.background.accent.blue.subtle.pressed', '#DEEBFF'),
	red: token('color.background.accent.red.subtle.pressed', '#FFEBE6'),
	yellow: token('color.background.accent.yellow.subtle.pressed', '#FFF0B3'),
	green: token('color.background.accent.green.subtle.pressed', '#ABF5D1'),
	teal: token('color.background.accent.teal.subtle.pressed', '#B3F5FF'),
	purple: token('color.background.accent.purple.subtle.pressed', '#EAE6FF'),
	grey: token('color.background.accent.gray.subtle.pressed', '#5E6C84'),
	lime: token('color.background.accent.lime.subtle.pressed', '#D3F1A7'),
	magenta: token('color.background.accent.magenta.subtle.pressed', '#FDD0EC'),
	orange: token('color.background.accent.orange.subtle.pressed', '#FFE2BD'),
	blueLight: token('color.background.accent.blue.subtler.pressed', '#4C9AFF'),
	redLight: token('color.background.accent.red.subtler.pressed', '#FF8F73'),
	yellowLight: token('color.background.accent.yellow.subtler.pressed', '#FFC400'),
	greenLight: token('color.background.accent.green.subtler.pressed', '#57D9A3'),
	tealLight: token('color.background.accent.teal.subtler.pressed', '#00C7E6'),
	purpleLight: token('color.background.accent.purple.subtler.pressed', '#998DD9'),
	limeLight: token('color.background.accent.lime.subtler.pressed', '#94C748'),
	magentaLight: token('color.background.accent.magenta.subtler.pressed', '#E774BB'),
	orangeLight: token('color.background.accent.orange.subtler.pressed', '#FAA53D'),
	greyLight: token('color.background.accent.gray.subtler.pressed', '#C1C7D0'),
};

export const focusRingColors = token('color.border.focused', '#4C9AFF');

export const removalHoverBackgroundColors = token('color.background.danger', '#FFEBE6');

export const removalActiveBackgroundColors = token('color.background.danger.hovered', '#FFEBE6');

export const removalTextColors = token('color.text.danger', '#BF2600');

/**
 * Remove button colors
 *
 * Once legacy theming support is dropped,
 * these can be removed and the remove button can inherit
 * from the tag text color
 */
export const removeButtonColors = {
	standard: token('color.text', '#42526E'),
	blue: token('color.text.accent.blue.bolder', '#42526E'),
	red: token('color.text.accent.red.bolder', '#42526E'),
	yellow: token('color.text.accent.yellow.bolder', '#42526E'),
	green: token('color.text.accent.green.bolder', '#42526E'),
	teal: token('color.text.accent.teal.bolder', '#42526E'),
	purple: token('color.text.accent.purple.bolder', '#42526E'),
	lime: token('color.text.accent.lime.bolder', '#42526E'),
	magenta: token('color.text.accent.magenta.bolder', '#42526E'),
	orange: token('color.text.accent.orange.bolder', '#42526E'),
	grey: token('color.text.accent.gray.bolder', '#42526E'),
	blueLight: token('color.text.accent.blue', '#42526E'),
	redLight: token('color.text.accent.red', '#42526E'),
	yellowLight: token('color.text.accent.yellow', '#42526E'),
	greenLight: token('color.text.accent.green', '#42526E'),
	tealLight: token('color.text.accent.teal', '#42526E'),
	purpleLight: token('color.text.accent.purple', '#42526E'),
	limeLight: token('color.text.accent.lime', '#42526E'),
	magentaLight: token('color.text.accent.magenta', '#42526E'),
	orangeLight: token('color.text.accent.orange', '#42526E'),
	greyLight: token('color.text.accent.gray', '#42526E'),
};

export const removeButtonHoverColors = {
	standard: token('color.text.danger', '#253858'),
	standardLink: token('color.text.danger', '#0052CC'),
	blue: token('color.text.danger', '#172B4D'),
	red: token('color.text.danger', '#172B4D'),
	yellow: token('color.text.danger', '#172B4D'),
	green: token('color.text.danger', '#172B4D'),
	teal: token('color.text.danger', '#172B4D'),
	purple: token('color.text.danger', '#172B4D'),
	lime: token('color.text.danger', '#172B4D'),
	magenta: token('color.text.danger', '#172B4D'),
	orange: token('color.text.danger', '#172B4D'),
	grey: token('color.text.danger', '#FFFFFF'),
	blueLight: token('color.text.danger', '#0747A6'),
	redLight: token('color.text.danger', '#42526E'),
	yellowLight: token('color.text.danger', '#42526E'),
	greenLight: token('color.text.danger', '#006644'),
	tealLight: token('color.text.danger', '#42526E'),
	purpleLight: token('color.text.danger', '#403294'),
	limeLight: token('color.text.danger', '#403294'),
	magentaLight: token('color.text.danger', '#403294'),
	orangeLight: token('color.text.danger', '#403294'),
	greyLight: token('color.text.danger', '#42526E'),
};
