/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { defaultBorderRadius, defaultRoundedBorderRadius } from './constants';

// Text colors
export const textColors = {
	standard: token('color.text', colors.N700),
	standardLink: token('color.link', colors.B400),
	blue: token('color.text.accent.blue.bolder', colors.N800),
	red: token('color.text.accent.red.bolder', colors.N800),
	yellow: token('color.text.accent.yellow.bolder', colors.N800),
	green: token('color.text.accent.green.bolder', colors.N800),
	teal: token('color.text.accent.teal.bolder', colors.N800),
	purple: token('color.text.accent.purple.bolder', colors.N800),
	lime: token('color.text.accent.lime.bolder', '#37471F'),
	magenta: token('color.text.accent.magenta.bolder', '#50253F'),
	orange: token('color.text.accent.orange.bolder', '#5F3811'),
	grey: token('color.text.accent.gray.bolder', colors.N0),
	blueLight: token('color.text.accent.blue', colors.B500),
	redLight: token('color.text.accent.red', colors.N500),
	yellowLight: token('color.text.accent.yellow', colors.N500),
	greenLight: token('color.text.accent.green', colors.G500),
	tealLight: token('color.text.accent.teal', colors.N500),
	purpleLight: token('color.text.accent.purple', colors.P500),
	limeLight: token('color.text.accent.lime', '#4C6B1F'),
	magentaLight: token('color.text.accent.magenta', '#943D73'),
	orangeLight: token('color.text.accent.orange', '#974F0C'),
	greyLight: token('color.text.accent.gray', colors.N500),
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
	standard: token('color.link', colors.B300),
	blue: token('color.text.accent.blue.bolder', colors.N800),
	red: token('color.text.accent.red.bolder', colors.N800),
	yellow: token('color.text.accent.yellow.bolder', colors.N800),
	green: token('color.text.accent.green.bolder', colors.N800),
	teal: token('color.text.accent.teal.bolder', colors.N800),
	purple: token('color.text.accent.purple.bolder', colors.N800),
	lime: token('color.text.accent.lime.bolder', '#37471F'),
	magenta: token('color.text.accent.magenta.bolder', '#50253F'),
	orange: token('color.text.accent.orange.bolder', '#5F3811'),
	grey: token('color.text.accent.gray.bolder', colors.N0),
	blueLight: token('color.text.accent.blue', colors.B500),
	redLight: token('color.text.accent.red', colors.N500),
	yellowLight: token('color.text.accent.yellow', colors.N500),
	greenLight: token('color.text.accent.green', colors.G500),
	tealLight: token('color.text.accent.teal', colors.N500),
	purpleLight: token('color.text.accent.purple', colors.P500),
	limeLight: token('color.text.accent.lime', '#4C6B1F'),
	magentaLight: token('color.text.accent.magenta', '#943D73'),
	orangeLight: token('color.text.accent.orange', '#974F0C'),
	greyLight: token('color.text.accent.gray', colors.N500),
};

export const textActiveColors = {
	standard: token('color.link.pressed', colors.B300),
	blue: token('color.text.accent.blue', colors.N800),
	red: token('color.text.accent.red', colors.N800),
	yellow: token('color.text.accent.yellow', colors.N800),
	green: token('color.text.accent.green', colors.N800),
	teal: token('color.text.accent.teal', colors.N800),
	purple: token('color.text.accent.purple', colors.N800),
	lime: token('color.text.accent.lime', '#4C6B1F'),
	magenta: token('color.text.accent.magenta', '#943D73'),
	orange: token('color.text.accent.orange', '#974F0C'),
	grey: token('color.text.accent.gray', colors.N0),
	blueLight: token('color.text.accent.blue.bolder', colors.B500),
	redLight: token('color.text.accent.red.bolder', colors.N500),
	yellowLight: token('color.text.accent.yellow.bolder', colors.N500),
	greenLight: token('color.text.accent.green.bolder', colors.G500),
	tealLight: token('color.text.accent.teal.bolder', colors.N500),
	purpleLight: token('color.text.accent.purple.bolder', colors.P500),
	limeLight: token('color.text.accent.lime.bolder', '#37471F'),
	magentaLight: token('color.text.accent.magenta.bolder', '#50253F'),
	orangeLight: token('color.text.accent.orange.bolder', '#5F3811'),
	greyLight: token('color.text.accent.gray.bolder', colors.N500),
};

// Background colors
export const backgroundColors = {
	standard: token('color.background.neutral', colors.N20),
	blue: token('color.background.accent.blue.subtle', colors.B100),
	red: token('color.background.accent.red.subtle', colors.R100),
	yellow: token('color.background.accent.yellow.subtle', colors.Y200),
	green: token('color.background.accent.green.subtle', colors.G200),
	teal: token('color.background.accent.teal.subtle', colors.T200),
	purple: token('color.background.accent.purple.subtle', colors.P100),
	lime: token('color.background.accent.lime.subtle', '#94C748'),
	magenta: token('color.background.accent.magenta.subtle', '#E774BB'),
	orange: token('color.background.accent.orange.subtle', '#FAA53D'),
	grey: token('color.background.accent.gray.subtle', colors.N500),
	blueLight: token('color.background.accent.blue.subtler', colors.B75),
	redLight: token('color.background.accent.red.subtler', colors.R75),
	yellowLight: token('color.background.accent.yellow.subtler', colors.Y100),
	greenLight: token('color.background.accent.green.subtler', colors.G100),
	tealLight: token('color.background.accent.teal.subtler', colors.T100),
	purpleLight: token('color.background.accent.purple.subtler', colors.P75),
	limeLight: token('color.background.accent.lime.subtler', '#D3F1A7'),
	magentaLight: token('color.background.accent.magenta.subtler', '#FDD0EC'),
	orangeLight: token('color.background.accent.orange.subtler', '#FFE2BD'),
	greyLight: token('color.background.accent.gray.subtler', colors.N30),
};

export const linkHoverBackgroundColors = {
	standard: token('color.background.neutral.hovered', colors.N30),
	blue: token('color.background.accent.blue.subtle.hovered', colors.B75),
	red: token('color.background.accent.red.subtle.hovered', colors.R75),
	yellow: token('color.background.accent.yellow.subtle.hovered', colors.Y100),
	green: token('color.background.accent.green.subtle.hovered', colors.G100),
	teal: token('color.background.accent.teal.subtle.hovered', colors.T100),
	purple: token('color.background.accent.purple.subtle.hovered', colors.P75),
	lime: token('color.background.accent.lime.subtle.hovered', '#B3DF72'),
	magenta: token('color.background.accent.magenta.subtle.hovered', '#F797D2'),
	orange: token('color.background.accent.orange.subtle.hovered', '#FEC57B'),
	grey: token('color.background.accent.gray.subtle.hovered', colors.N400),
	blueLight: token('color.background.accent.blue.subtler.hovered', colors.B50),
	redLight: token('color.background.accent.red.subtler.hovered', colors.R50),
	yellowLight: token('color.background.accent.yellow.subtler.hovered', colors.Y75),
	greenLight: token('color.background.accent.green.subtler.hovered', colors.G75),
	tealLight: token('color.background.accent.teal.subtler.hovered', colors.T75),
	purpleLight: token('color.background.accent.purple.subtler.hovered', colors.P50),
	limeLight: token('color.background.accent.lime.subtler.hovered', '#B3DF72'),
	magentaLight: token('color.background.accent.magenta.subtler.hovered', '#F797D2'),
	orangeLight: token('color.background.accent.orange.subtler.hovered', '#FEC57B'),
	greyLight: token('color.background.accent.gray.subtler.hovered', colors.N40),
};

export const linkActiveBackgroundColors = {
	standard: token('color.background.neutral.pressed', colors.N30),
	blue: token('color.background.accent.blue.subtle.pressed', colors.B50),
	red: token('color.background.accent.red.subtle.pressed', colors.R50),
	yellow: token('color.background.accent.yellow.subtle.pressed', colors.Y75),
	green: token('color.background.accent.green.subtle.pressed', colors.G75),
	teal: token('color.background.accent.teal.subtle.pressed', colors.T75),
	purple: token('color.background.accent.purple.subtle.pressed', colors.P50),
	grey: token('color.background.accent.gray.subtle.pressed', colors.N300),
	lime: token('color.background.accent.lime.subtle.pressed', '#D3F1A7'),
	magenta: token('color.background.accent.magenta.subtle.pressed', '#FDD0EC'),
	orange: token('color.background.accent.orange.subtle.pressed', '#FFE2BD'),
	blueLight: token('color.background.accent.blue.subtler.pressed', colors.B100),
	redLight: token('color.background.accent.red.subtler.pressed', colors.R100),
	yellowLight: token('color.background.accent.yellow.subtler.pressed', colors.Y200),
	greenLight: token('color.background.accent.green.subtler.pressed', colors.G200),
	tealLight: token('color.background.accent.teal.subtler.pressed', colors.T200),
	purpleLight: token('color.background.accent.purple.subtler.pressed', colors.P100),
	limeLight: token('color.background.accent.lime.subtler.pressed', '#94C748'),
	magentaLight: token('color.background.accent.magenta.subtler.pressed', '#E774BB'),
	orangeLight: token('color.background.accent.orange.subtler.pressed', '#FAA53D'),
	greyLight: token('color.background.accent.gray.subtler.pressed', colors.N50),
};

export const focusRingColors = token('color.border.focused', colors.B100);

export const borderRadius = {
	default: defaultBorderRadius,
	rounded: defaultRoundedBorderRadius,
};

export const removalHoverBackgroundColors = token('color.background.danger', colors.R50);

export const removalActiveBackgroundColors = token('color.background.danger.hovered', colors.R50);

export const removalTextColors = token('color.text.danger', colors.R500);

/**
 * Remove button colors
 *
 * Once legacy theming support is dropped,
 * these can be removed and the remove button can inherit
 * from the tag text color
 */
export const removeButtonColors = {
	standard: token('color.text', colors.N500),
	blue: token('color.text.accent.blue.bolder', colors.N500),
	red: token('color.text.accent.red.bolder', colors.N500),
	yellow: token('color.text.accent.yellow.bolder', colors.N500),
	green: token('color.text.accent.green.bolder', colors.N500),
	teal: token('color.text.accent.teal.bolder', colors.N500),
	purple: token('color.text.accent.purple.bolder', colors.N500),
	lime: token('color.text.accent.lime.bolder', colors.N500),
	magenta: token('color.text.accent.magenta.bolder', colors.N500),
	orange: token('color.text.accent.orange.bolder', colors.N500),
	grey: token('color.text.accent.gray.bolder', colors.N500),
	blueLight: token('color.text.accent.blue', colors.N500),
	redLight: token('color.text.accent.red', colors.N500),
	yellowLight: token('color.text.accent.yellow', colors.N500),
	greenLight: token('color.text.accent.green', colors.N500),
	tealLight: token('color.text.accent.teal', colors.N500),
	purpleLight: token('color.text.accent.purple', colors.N500),
	limeLight: token('color.text.accent.lime', colors.N500),
	magentaLight: token('color.text.accent.magenta', colors.N500),
	orangeLight: token('color.text.accent.orange', colors.N500),
	greyLight: token('color.text.accent.gray', colors.N500),
};

export const removeButtonHoverColors = {
	standard: token('color.text.danger', colors.N700),
	standardLink: token('color.text.danger', colors.B400),
	blue: token('color.text.danger', colors.N800),
	red: token('color.text.danger', colors.N800),
	yellow: token('color.text.danger', colors.N800),
	green: token('color.text.danger', colors.N800),
	teal: token('color.text.danger', colors.N800),
	purple: token('color.text.danger', colors.N800),
	lime: token('color.text.danger', colors.N800),
	magenta: token('color.text.danger', colors.N800),
	orange: token('color.text.danger', colors.N800),
	grey: token('color.text.danger', colors.N0),
	blueLight: token('color.text.danger', colors.B500),
	redLight: token('color.text.danger', colors.N500),
	yellowLight: token('color.text.danger', colors.N500),
	greenLight: token('color.text.danger', colors.G500),
	tealLight: token('color.text.danger', colors.N500),
	purpleLight: token('color.text.danger', colors.P500),
	limeLight: token('color.text.danger', colors.P500),
	magentaLight: token('color.text.danger', colors.P500),
	orangeLight: token('color.text.danger', colors.P500),
	greyLight: token('color.text.danger', colors.N500),
};
