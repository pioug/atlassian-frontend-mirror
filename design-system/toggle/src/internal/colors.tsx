import { B200, G400, G500, N0, N20, N200, N400, N70 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export type ToggleContainerColors = {
	backgroundColorChecked: string;
	backgroundColorCheckedHover: string;
	backgroundColorCheckedDisabled: string;

	backgroundColorUnchecked: string;
	backgroundColorUncheckedHover: string;
	backgroundColorUncheckedDisabled: string;

	borderColorFocus: string;

	iconColorChecked: string;
	iconColorUnchecked: string;
	iconColorDisabled: string;

	handleBackgroundColor: string;
	handleBackgroundColorChecked: string;
	handleBackgroundColorDisabled: string;
};

const colorMap = {
	backgroundColorChecked: token('color.background.success.bold', G400),
	backgroundColorCheckedHover: token('color.background.success.bold.hovered', G500),
	backgroundColorCheckedDisabled: token('color.background.disabled', N20),

	backgroundColorUnchecked: token('color.background.neutral.bold', N200),
	backgroundColorUncheckedHover: token('color.background.neutral.bold.hovered', N400),
	backgroundColorUncheckedDisabled: token('color.background.disabled', N20),

	borderColorFocus: token('color.border.focused', B200),

	iconColorChecked: token('color.icon.inverse', N0),
	iconColorDisabled: token('color.icon.disabled', N70),
	iconColorUnchecked: token('color.icon.inverse', N0),

	handleBackgroundColor: token('color.icon.inverse', N0),
	handleBackgroundColorChecked: token('color.icon.inverse', N0),
	handleBackgroundColorDisabled: token('color.icon.inverse', N0),
};

export const getColors = (): ToggleContainerColors => colorMap;
