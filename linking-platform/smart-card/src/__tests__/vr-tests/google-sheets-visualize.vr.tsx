import { snapshot } from '@af/visual-regression';

import {
	VRBlockCardGoogleSheetsRemix,
	VRBlockCardGoogleSheetsRemixOff,
	VRBlockCardGoogleSheetsRemixWithoutRovoChat,
	VREmbedCardGoogleSheetsRemix,
	VREmbedCardGoogleSheetsRemixOff,
	VREmbedCardGoogleSheetsRemixWithoutRovoChat,
	VRInlineCardGoogleSheetsRemix,
	VRInlineCardGoogleSheetsRemixOff,
	VRInlineCardGoogleSheetsRemixWithoutRovoChat,
} from '../../../examples/vr-google-sheets-visualize/vr-google-sheets-visualize.vr.ap';

snapshot(VRInlineCardGoogleSheetsRemix, {
	description: 'inline card Google Sheets with Remix action (experiment on)',
	waitForReactLazy: true,
});
snapshot(VRInlineCardGoogleSheetsRemixOff, {
	description: 'inline card Google Sheets without Remix action (experiment off)',
	waitForReactLazy: true,
});
snapshot(VRBlockCardGoogleSheetsRemix, {
	description: 'block card Google Sheets with Remix action (experiment on)',
	waitForReactLazy: true,
});
snapshot(VRBlockCardGoogleSheetsRemixOff, {
	description: 'block card Google Sheets without Remix action (experiment off)',
	waitForReactLazy: true,
});
snapshot(VREmbedCardGoogleSheetsRemix, {
	description: 'embed card Google Sheets with Remix action (experiment on)',
	waitForReactLazy: true,
});
snapshot(VREmbedCardGoogleSheetsRemixOff, {
	description: 'embed card Google Sheets without Remix action (experiment off)',
	waitForReactLazy: true,
});

snapshot(VRInlineCardGoogleSheetsRemixWithoutRovoChat, {
	description: 'inline card Google Sheets with Remix action and Rovo Chat action opted out',
	waitForReactLazy: true,
});
snapshot(VRBlockCardGoogleSheetsRemixWithoutRovoChat, {
	description: 'block card Google Sheets with Remix action and Rovo Chat action opted out',
	waitForReactLazy: true,
});
snapshot(VREmbedCardGoogleSheetsRemixWithoutRovoChat, {
	description: 'embed card Google Sheets with Remix action and Rovo Chat action opted out',
	waitForReactLazy: true,
});
