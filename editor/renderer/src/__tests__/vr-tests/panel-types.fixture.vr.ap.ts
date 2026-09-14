import type { ComponentType } from 'react';
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

import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const CustomPanelEmojiAndColoredBackground: ComponentType<any> = generateRendererComponent({
	document: customPanelEmojiAndColoredBackground,
	appearance: 'full-width',
});

export const CustomPanelEmojiAndColoredBackgroundAndColoredText: ComponentType<any> =
	generateRendererComponent({
		document: customPanelEmojiAndColoredBackgroundAndColoredText,
		appearance: 'full-width',
	});

export const CustomPanelMissingDefaults: ComponentType<any> = generateRendererComponent({
	document: customPanelMissingDefaults,
	appearance: 'full-width',
});

export const CustomPanelMissingDefaultsFinal: ComponentType<any> = generateRendererComponent({
	document: customPanelMissingDefaults,
	appearance: 'full-width',
	allowCustomPanels: true,
});

export const CustomPanelOnlyBackground: ComponentType<any> = generateRendererComponent({
	document: customPanelOnlyBackground,
	appearance: 'full-width',
});

export const CustomPanelOnlyBackgroundFinal: ComponentType<any> = generateRendererComponent({
	document: customPanelOnlyBackground,
	appearance: 'full-width',
	allowCustomPanels: true,
});

export const CustomPanelOnlyEmoji: ComponentType<any> = generateRendererComponent({
	document: customPanelOnlyEmoji,
	appearance: 'full-width',
});

export const ErrorPanel: ComponentType<any> = generateRendererComponent({
	document: errorPanel,
	appearance: 'full-width',
});

export const ErrorPanelFinal: ComponentType<any> = generateRendererComponent({
	document: errorPanel,
	appearance: 'full-width',
	allowCustomPanels: true,
});

export const InfoPanel: ComponentType<any> = generateRendererComponent({
	document: infoPanel,
	appearance: 'full-width',
});

export const InfoPanelFinal: ComponentType<any> = generateRendererComponent({
	document: infoPanel,
	appearance: 'full-width',
	allowCustomPanels: true,
});

export const NotePanel: ComponentType<any> = generateRendererComponent({
	document: notePanel,
	appearance: 'full-width',
});

export const NotePanelFinal: ComponentType<any> = generateRendererComponent({
	document: notePanel,
	appearance: 'full-width',
	allowCustomPanels: true,
});

export const SuccessPanel: ComponentType<any> = generateRendererComponent({
	document: successPanel,
	appearance: 'full-width',
});

export const SuccessPanelFinal: ComponentType<any> = generateRendererComponent({
	document: successPanel,
	appearance: 'full-width',
	allowCustomPanels: true,
});

export const SuccessPanelWithColoredText: ComponentType<any> = generateRendererComponent({
	document: successPanelWithColoredText,
	appearance: 'full-width',
});

export const SuccessPanelWithColoredTextFinal: ComponentType<any> = generateRendererComponent({
	document: successPanelWithColoredText,
	appearance: 'full-width',
	allowCustomPanels: true,
});

export const WarningPanel: ComponentType<any> = generateRendererComponent({
	document: warningPanel,
	appearance: 'full-width',
});

export const WarningPanelFinal: ComponentType<any> = generateRendererComponent({
	document: warningPanel,
	appearance: 'full-width',
	allowCustomPanels: true,
});
