import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const noDialogContainerBorderColor: 'var(--ds-border)' = token('color.border', N40); // This has not been confirmed by the ADG yet
export const noDialogContainerBorderRadius: 'var(--ds-radius-small)' = token('radius.small', '3px');
export const noDialogContainerBoxShadow: 'var(--ds-shadow-overlay)' = token(
	'elevation.shadow.overlay',
	'0 4px 8px -2px rgba(9, 30, 66, 0.25), 0 0 1px rgba(9, 30, 66, 0.31)',
); // Copied from droplist style

export const scrollableMaxHeight = '264px';
export const mentionListWidth = '340px';
