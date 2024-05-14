import type { AllowList } from './types';

const motionCurves = ['easeInOut', 'easeIn', 'easeOut'];
const motionDurations = [
  'smallDurationMs',
  'mediumDurationMs',
  'largeDurationMs',
];

/**
 * By default these are allowed in values of style objects.
 *
 * Some are functions while some are strings / numbers.
 * We rely on types to enforce appropriate usage beyond allow listing.
 */
export const defaultAllowedValues: AllowList = {
  '@atlaskit/motion': [...motionCurves, ...motionDurations],
  '@atlaskit/motion/curves': motionCurves,
  '@atlaskit/motion/durations': motionDurations,
  '@atlaskit/theme/colors': [
    'R50',
    'R75',
    'R100',
    'R200',
    'R300',
    'R400',
    'R500',
    'Y50',
    'Y75',
    'Y100',
    'Y200',
    'Y300',
    'Y400',
    'Y500',
    'G50',
    'G75',
    'G100',
    'G200',
    'G300',
    'G400',
    'G500',
    'B50',
    'B75',
    'B100',
    'B200',
    'B300',
    'B400',
    'B500',
    'P50',
    'P75',
    'P100',
    'P200',
    'P300',
    'P400',
    'P500',
    'T50',
    'T75',
    'T100',
    'T200',
    'T300',
    'T400',
    'T500',
    'N0',
    'N10',
    'N20',
    'N30',
    'N40',
    'N50',
    'N60',
    'N70',
    'N80',
    'N90',
    'N100',
    'N200',
    'N300',
    'N400',
    'N500',
    'N600',
    'N700',
    'N800',
    'N900',
    'N10A',
    'N20A',
    'N30A',
    'N40A',
    'N50A',
    'N60A',
    'N70A',
    'N80A',
    'N90A',
    'N100A',
    'N200A',
    'N300A',
    'N400A',
    'N500A',
    'N600A',
    'N700A',
    'N800A',
    'DN900',
    'DN800',
    'DN700',
    'DN600',
    'DN500',
    'DN400',
    'DN300',
    'DN200',
    'DN100',
    'DN90',
    'DN80',
    'DN70',
    'DN60',
    'DN50',
    'DN40',
    'DN30',
    'DN20',
    'DN10',
    'DN0',
    'DN800A',
    'DN700A',
    'DN600A',
    'DN500A',
    'DN400A',
    'DN300A',
    'DN200A',
    'DN100A',
    'DN90A',
    'DN80A',
    'DN70A',
    'DN60A',
    'DN50A',
    'DN40A',
    'DN30A',
    'DN20A',
    'DN10A',
  ],
  '@atlaskit/theme/constants': [
    'fontSize',
    'fontSizeSmall',
    'fontFamily',
    'codeFontFamily',
    'layers',
  ],
  '@atlaskit/tokens': ['token'],
  '@atlaskit/css': ['keyframes'],
  '@compiled/react': ['keyframes'],
  '@emotion/react': ['keyframes'],
  'styled-components': ['keyframes'],
};

/**
 * By default these are allowed as keys in style objects.
 *
 * For objects like `media` any of their descendant properties will also be allowed.
 */
export const defaultAllowedDynamicKeys: AllowList = {
  '@atlaskit/primitives': ['media'],
  '@atlaskit/primitives/responsive': ['media'],
  '@atlaskit/tokens': ['CURRENT_SURFACE_CSS_VAR'],
};
