import {
	customPanelEmojiAndColoredBackground,
	customPanelEmojiAndColoredBackgroundAndColoredText,
	customPanelMissingDefaults,
	customPanelOnlyBackground,
	customPanelOnlyEmoji,
	errorPanel,
	infoPanel,
	notePanel,
	successPanel,
	successPanelWithColoredText,
	warningPanel,
} from '../__fixtures__/panel-types.adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const CustomPanelEmojiAndColoredBackground = generateRendererComponent({
	document: customPanelEmojiAndColoredBackground,
	appearance: 'full-width',
});

export const CustomPanelEmojiAndColoredBackgroundAndColoredText = generateRendererComponent({
	document: customPanelEmojiAndColoredBackgroundAndColoredText,
	appearance: 'full-width',
});

export const CustomPanelMissingDefaults = generateRendererComponent({
	document: customPanelMissingDefaults,
	appearance: 'full-width',
});

export const CustomPanelMissingDefaultsFinal = generateRendererComponent({
	document: customPanelMissingDefaults,
	appearance: 'full-width',
	allowCustomPanels: true,
});

export const CustomPanelOnlyBackground = generateRendererComponent({
	document: customPanelOnlyBackground,
	appearance: 'full-width',
});

export const CustomPanelOnlyBackgroundFinal = generateRendererComponent({
	document: customPanelOnlyBackground,
	appearance: 'full-width',
	allowCustomPanels: true,
});

export const CustomPanelOnlyEmoji = generateRendererComponent({
	document: customPanelOnlyEmoji,
	appearance: 'full-width',
});

export const ErrorPanel = generateRendererComponent({
	document: errorPanel,
	appearance: 'full-width',
});

export const ErrorPanelFinal = generateRendererComponent({
	document: errorPanel,
	appearance: 'full-width',
	allowCustomPanels: true,
});

export const InfoPanel = generateRendererComponent({
	document: infoPanel,
	appearance: 'full-width',
});

export const InfoPanelFinal = generateRendererComponent({
	document: infoPanel,
	appearance: 'full-width',
	allowCustomPanels: true,
});

export const NotePanel = generateRendererComponent({
	document: notePanel,
	appearance: 'full-width',
});

export const NotePanelFinal = generateRendererComponent({
	document: notePanel,
	appearance: 'full-width',
	allowCustomPanels: true,
});

export const SuccessPanel = generateRendererComponent({
	document: successPanel,
	appearance: 'full-width',
});

export const SuccessPanelFinal = generateRendererComponent({
	document: successPanel,
	appearance: 'full-width',
	allowCustomPanels: true,
});

export const SuccessPanelWithColoredText = generateRendererComponent({
	document: successPanelWithColoredText,
	appearance: 'full-width',
});

export const SuccessPanelWithColoredTextFinal = generateRendererComponent({
	document: successPanelWithColoredText,
	appearance: 'full-width',
	allowCustomPanels: true,
});

export const WarningPanel = generateRendererComponent({
	document: warningPanel,
	appearance: 'full-width',
});

export const WarningPanelFinal = generateRendererComponent({
	document: warningPanel,
	appearance: 'full-width',
	allowCustomPanels: true,
});
