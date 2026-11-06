import { snapshot } from '@af/visual-regression';

import {
	VRBlockCardGoogleSheetsVisualize,
	VRBlockCardGoogleSheetsVisualizeOff,
	VREmbedCardGoogleSheetsVisualize,
	VREmbedCardGoogleSheetsVisualizeOff,
	VRInlineCardGoogleSheetsVisualize,
	VRInlineCardGoogleSheetsVisualizeOff,
} from '../../../examples/vr-google-sheets-visualize/vr-google-sheets-visualize.vr.ap';

snapshot(VRInlineCardGoogleSheetsVisualize, {
	description: 'inline card Google Sheets with Visualize Rovo action (experiment on)',
	waitForReactLazy: true,
});
snapshot(VRInlineCardGoogleSheetsVisualizeOff, {
	description: 'inline card Google Sheets without Visualize Rovo action (experiment off)',
	waitForReactLazy: true,
});
snapshot(VRBlockCardGoogleSheetsVisualize, {
	description: 'block card Google Sheets with Visualize Rovo action (experiment on)',
	waitForReactLazy: true,
});
snapshot(VRBlockCardGoogleSheetsVisualizeOff, {
	description: 'block card Google Sheets without Visualize Rovo action (experiment off)',
	waitForReactLazy: true,
});
snapshot(VREmbedCardGoogleSheetsVisualize, {
	description: 'embed card Google Sheets with Visualize Rovo action (experiment on)',
	waitForReactLazy: true,
});
snapshot(VREmbedCardGoogleSheetsVisualizeOff, {
	description: 'embed card Google Sheets without Visualize Rovo action (experiment off)',
	waitForReactLazy: true,
});
