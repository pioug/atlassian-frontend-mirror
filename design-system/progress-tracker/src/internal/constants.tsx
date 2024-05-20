import { token } from '@atlaskit/tokens';

export const TRANSITION_SPEED = 300;
export const LINEAR_TRANSITION_SPEED = 50;
export const ANIMATION_EASE_OUT = 'cubic-bezier(0.15,1,0.3,1)';
export const varSpacing = '--ds--pt--sp';
export const varTransitionSpeed = '--ds--pt--ts';
export const varTransitionDelay = '--ds--pt--td';
export const varTransitionEasing = '--ds--pt--te';
export const varMarkerColor = '--ds--pt--mc';
export const varBackgroundColor = '--ds--pt--bg';

export const REGULAR_FONT_WEIGHT = token('font.weight.regular', '400');
export const SEMI_BOLD_FONT_WEIGHT = token('font.weight.semibold', '600');

export const HALF_GRID_SIZE = token('space.050', '4px');
export const PROGRESS_BAR_HEIGHT = token('space.100', '8px');

// Labels sit 16px from bottom of progress bar i.e. 8 + 16
export const LABEL_TOP_SPACING = token('space.300', '24px');
