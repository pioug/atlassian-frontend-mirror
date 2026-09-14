import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ConnectedReactionPickerExample from './00-connected-reaction-picker';
import ConnectedReactionsViewExample from './01-connected-reactions-view';
import ReactionsStatusOptionsExample from './02-reactions-status-options';
import AllEmojiEnabledOverflowBorderExample from './03-all-emoji-enabled-overflow-border';
import ReactionsViewWithBackendExample from './04-reactions-view-with-backend';
import MultipleReactionsContainersExample from './05-multiple-reactions-containers';
import ReactionsDialogExample from './06-reactions-dialog';
import UfoIntegrationExample from './06-ufo-integration';
import SummaryReactionsExample from './07-summary-reactions';
import ReactionPickerOnlyExample from './08-reaction-picker-only';

export const ConnectedReactionPicker: WorkbenchExample = wb(ConnectedReactionPickerExample);
export const ConnectedReactionsView: WorkbenchExample = wb(ConnectedReactionsViewExample);
export const ReactionsStatusOptions: WorkbenchExample = wb(ReactionsStatusOptionsExample);
export const AllEmojiEnabledOverflowBorder: WorkbenchExample = wb(
	AllEmojiEnabledOverflowBorderExample,
);
export const ReactionsViewWithBackend: WorkbenchExample = wb(ReactionsViewWithBackendExample);
export const MultipleReactionsContainers: WorkbenchExample = wb(MultipleReactionsContainersExample);
export const ReactionsDialog: WorkbenchExample = wb(ReactionsDialogExample);
export const UfoIntegration: WorkbenchExample = wb(UfoIntegrationExample);
export const SummaryReactions: WorkbenchExample = wb(SummaryReactionsExample);
export const ReactionPickerOnly: WorkbenchExample = wb(ReactionPickerOnlyExample);
