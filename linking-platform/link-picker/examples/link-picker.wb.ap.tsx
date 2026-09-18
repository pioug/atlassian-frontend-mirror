import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from './00-basic';
import HideDisplayTextExample from './01-hide-display-text';
import NoresultsExample from './02-noresults';
import DisableWidthExample from './03-disable-width';
import CustomPaddingExample from './04-custom-padding';
import CustomMessagesExample from './05-custom-messages';
import SubmitInProgressExample from './05-submit-in-progress';
import DisableManualUrlInsertExample from './06-disable-manual-url-insert';
import DisableManualUrlInsertWithResultsExample from './07-disable-manual-url-insert-with-results';
import WithoutPluginsExample from './20-without-plugins';
import RootErrorBoundaryExample from './30-root-error-boundary';
import PopupContentResizeExample from './40-popup-content-resize';
import CustomEndpointsExample from './50-custom-endpoints';
import LinkPickerPluginsExample from './60-link-picker-plugins';
import LinkPickerPluginsNoResultsExample from './61-link-picker-plugins-no-results';
import LinkPickerAtlassianPluginsNoRecentsExample from './62-link-picker-atlassian-plugins-no-recents';
import LinkPickerAtlassianPluginsRecentsSearchExample from './63-link-picker-atlassian-plugins-recents-search';
import AdditionalErrorHandlingExample from './64-additional-error-handling';
import SubmitOnInputChangeExample from './65-submit-on-input-change';
import LinkPickerAtlassianPluginsErrorExample from './66-link-picker-atlassian-plugins-error';
import LinkPickerInFormExample from './70-link-picker-in-form';
import VrBasicExample from './vr-basic';
import VrEditLinkExample from './vr-edit-link';
import VrHandlePluginErrorExample from './vr-handle-plugin-error';
import VrHideDisplayTextExample from './vr-hide-display-text';
import VrHideDisplayTextWithMultiplePluginsExample from './vr-hide-display-text-with-multiple-plugins';
import VrHideDisplayTextWithPluginExample from './vr-hide-display-text-with-plugin';
import VrWithMultiplePluginsExample from './vr-with-multiple-plugins';
import VrWithMultiplePluginsDifferentContentExample from './vr-with-multiple-plugins-different-content';
import VrWithNoPluginsExample from './vr-with-no-plugins';
import VrWithNoResultsExample from './vr-with-no-results';
import VrWithNoResultsMultiProductExample from './vr-with-no-results-multi-product';
import VrWithPluginActionExample from './vr-with-plugin-action';
import VrWithPopupIntegrationExample from './vr-with-popup-integration';

export const Basic: WorkbenchExample = wb(BasicExample);
export const HideDisplayText: WorkbenchExample = wb(HideDisplayTextExample);
export const Noresults: WorkbenchExample = wb(NoresultsExample);
export const DisableWidth: WorkbenchExample = wb(DisableWidthExample);
export const CustomPadding: WorkbenchExample = wb(CustomPaddingExample);
export const CustomMessages: WorkbenchExample = wb(CustomMessagesExample);
export const SubmitInProgress: WorkbenchExample = wb(SubmitInProgressExample);
export const DisableManualUrlInsert: WorkbenchExample = wb(DisableManualUrlInsertExample);
export const DisableManualUrlInsertWithResults: WorkbenchExample = wb(
	DisableManualUrlInsertWithResultsExample,
);
export const WithoutPlugins: WorkbenchExample = wb(WithoutPluginsExample);
export const RootErrorBoundary: WorkbenchExample = wb(RootErrorBoundaryExample);
export const PopupContentResize: WorkbenchExample = wb(PopupContentResizeExample);
export const CustomEndpoints: WorkbenchExample = wb(CustomEndpointsExample);
export const LinkPickerPlugins: WorkbenchExample = wb(LinkPickerPluginsExample);
export const LinkPickerPluginsNoResults: WorkbenchExample = wb(LinkPickerPluginsNoResultsExample);
export const LinkPickerAtlassianPluginsNoRecents: WorkbenchExample = wb(
	LinkPickerAtlassianPluginsNoRecentsExample,
);
export const LinkPickerAtlassianPluginsRecentsSearch: WorkbenchExample = wb(
	LinkPickerAtlassianPluginsRecentsSearchExample,
);
export const AdditionalErrorHandling: WorkbenchExample = wb(AdditionalErrorHandlingExample);
export const SubmitOnInputChange: WorkbenchExample = wb(SubmitOnInputChangeExample);
export const LinkPickerAtlassianPluginsError: WorkbenchExample = wb(
	LinkPickerAtlassianPluginsErrorExample,
);
export const LinkPickerInForm: WorkbenchExample = wb(LinkPickerInFormExample);
export const VrBasic: WorkbenchExample = wb(VrBasicExample);
export const VrEditLink: WorkbenchExample = wb(VrEditLinkExample);
export const VrHandlePluginError: WorkbenchExample = wb(VrHandlePluginErrorExample);
export const VrHideDisplayTextWithMultiplePlugins: WorkbenchExample = wb(
	VrHideDisplayTextWithMultiplePluginsExample,
);
export const VrHideDisplayTextWithPlugin: WorkbenchExample = wb(VrHideDisplayTextWithPluginExample);
export const VrHideDisplayText: WorkbenchExample = wb(VrHideDisplayTextExample);
export const VrWithMultiplePluginsDifferentContent: WorkbenchExample = wb(
	VrWithMultiplePluginsDifferentContentExample,
);
export const VrWithMultiplePlugins: WorkbenchExample = wb(VrWithMultiplePluginsExample);
export const VrWithNoPlugins: WorkbenchExample = wb(VrWithNoPluginsExample);
export const VrWithNoResultsMultiProduct: WorkbenchExample = wb(VrWithNoResultsMultiProductExample);
export const VrWithNoResults: WorkbenchExample = wb(VrWithNoResultsExample);
export const VrWithPluginAction: WorkbenchExample = wb(VrWithPluginActionExample);
export const VrWithPopupIntegration: WorkbenchExample = wb(VrWithPopupIntegrationExample);
