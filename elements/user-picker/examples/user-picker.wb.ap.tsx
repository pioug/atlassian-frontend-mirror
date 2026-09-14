import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SingleExample from './00-single';
import MultiVrApExample from './01-multi.vr.ap';
import AsyncOptionsLoadingExample from './02-async-options-loading';
import SingleCompactVrApExample from './03-single-compact.vr.ap';
import SingleSubtleVrApExample from './04-single-subtle.vr.ap';
import SingleSubtleAndCompactExample from './05-single-subtle-and-compact';
import MultiCompactExample from './06-multi-compact';
import MultiWithDefaultValuesVrApExample from './07-multi-with-default-values.vr.ap';
import MultiWithFixedValuesExample from './08-multi-with-fixed-values';
import SingleDisabledExample from './09-single-disabled';
import InATableCellVrApExample from './10-in-a-table-cell.vr.ap';
import WatchersExample from './11-watchers';
import CreatableWithLocaleExample from './12-creatable-with-locale';
import ModalExample from './13-modal';
import UserPickerMultiSelectExample from './15-user-picker-multi-select';
import MultiNoBorderVrApExample from './16-multi-no-border.vr.ap';
import PopupConfigExample from './19-popup-config';
import MultiWithExternalUsersExample from './20-multi-with-external-users';
import EmailInviteRecommendatonExample from './22-email-invite-recommendaton';
import UserPickerOnModalExample from './23-user-picker-on-modal';
import DisableInputExample from './24-disable-input';
import DisableOptionsExample from './25-disable-options';
import FooterVrApExample from './26-footer.vr.ap';
import HeaderVrApExample from './27-header.vr.ap';
import UserPickerOnDraggableExample from './28-user-picker-on-draggable';
import SingleOnClickExample from './29-single-on-click';
import TeamAvatarPlaceholderVrApExample from './29-team-avatar-placeholder.vr.ap';
import SingleInvalidVrApExample from './30-single-invalid.vr.ap';
import MultiInvalidVrApExample from './31-multi-invalid.vr.ap';
import UserPickerForwardedRefExample from './32-user-picker-forwarded-ref';
import UserPickerGroupByTypeExample from './33-user-picker-group-by-type';
import IsPendingActionExample from './34-is-pending-action';
import AgentHexagonAvatarVrApExample from './35-agent-hexagon-avatar.vr.ap';
import UserPickerWithIconVrApExample from './36-user-picker-with-icon.vr.ap';
import MultiWithDefaultValuesWithSelectedOfficialTeamsAndAdminGroupsVrApExample from './37-multi-with-default-values-with-selected-official-teams-and-admin-groups.vr.ap';
import SingleWithDefaultValuesWithOfficialTeamSelectedVrApExample from './38-single-with-default-values-with-official-team-selected.vr.ap';
import MultiDisabledExample from './39-multi-disabled';
import GroupByTypeWithDefaultValueVrApExample from './group-by-type-with-default-value.vr.ap';
import MultiWithAutoFocusVrApExample from './multi-with-auto-focus.vr.ap';
import PopupWithDefaultOpenVrApExample from './popup-with-default-open.vr.ap';
import SimpleDisabledOptionVrApExample from './simple-disabled-option.vr.ap';
import SimpleMultiWithExternalUsersWithTooltipVrApExample from './simple-multi-with-external-users-with-tooltip.vr.ap';
import SimpleMultiWithExternalUsersVrApExample from './simple-multi-with-external-users.vr.ap';
import SingleWithAutoFocusVrApExample from './single-with-auto-focus.vr.ap';

export const Single: WorkbenchExample = wb(SingleExample);
export const Multi: WorkbenchExample = wb(MultiVrApExample);
export const MultiVrAp: WorkbenchExample = wb(MultiVrApExample);
export const AsyncOptionsLoading: WorkbenchExample = wb(AsyncOptionsLoadingExample);
export const SingleCompactVrAp: WorkbenchExample = wb(SingleCompactVrApExample);
export const SingleSubtleVrAp: WorkbenchExample = wb(SingleSubtleVrApExample);
export const SingleSubtleAndCompact: WorkbenchExample = wb(SingleSubtleAndCompactExample);
export const MultiCompact: WorkbenchExample = wb(MultiCompactExample);
export const MultiWithDefaultValuesVrAp: WorkbenchExample = wb(MultiWithDefaultValuesVrApExample);
export const MultiWithFixedValues: WorkbenchExample = wb(MultiWithFixedValuesExample);
export const SingleDisabled: WorkbenchExample = wb(SingleDisabledExample);
export const InATableCellVrAp: WorkbenchExample = wb(InATableCellVrApExample);
export const Watchers: WorkbenchExample = wb(WatchersExample);
export const CreatableWithLocale: WorkbenchExample = wb(CreatableWithLocaleExample);
export const Modal: WorkbenchExample = wb(ModalExample);
export const UserPickerMultiSelect: WorkbenchExample = wb(UserPickerMultiSelectExample);
export const MultiNoBorderVrAp: WorkbenchExample = wb(MultiNoBorderVrApExample);
export const PopupConfig: WorkbenchExample = wb(PopupConfigExample);
export const MultiWithExternalUsers: WorkbenchExample = wb(MultiWithExternalUsersExample);
export const EmailInviteRecommendaton: WorkbenchExample = wb(EmailInviteRecommendatonExample);
export const UserPickerOnModal: WorkbenchExample = wb(UserPickerOnModalExample);
export const DisableInput: WorkbenchExample = wb(DisableInputExample);
export const DisableOptions: WorkbenchExample = wb(DisableOptionsExample);
export const FooterVrAp: WorkbenchExample = wb(FooterVrApExample);
export const HeaderVrAp: WorkbenchExample = wb(HeaderVrApExample);
export const UserPickerOnDraggable: WorkbenchExample = wb(UserPickerOnDraggableExample);
export const SingleOnClick: WorkbenchExample = wb(SingleOnClickExample);
export const TeamAvatarPlaceholderVrAp: WorkbenchExample = wb(TeamAvatarPlaceholderVrApExample);
export const SingleInvalidVrAp: WorkbenchExample = wb(SingleInvalidVrApExample);
export const MultiInvalidVrAp: WorkbenchExample = wb(MultiInvalidVrApExample);
export const UserPickerForwardedRef: WorkbenchExample = wb(UserPickerForwardedRefExample);
export const UserPickerGroupByType: WorkbenchExample = wb(UserPickerGroupByTypeExample);
export const IsPendingAction: WorkbenchExample = wb(IsPendingActionExample);
export const AgentHexagonAvatarVrAp: WorkbenchExample = wb(AgentHexagonAvatarVrApExample);
export const UserPickerWithIconVrAp: WorkbenchExample = wb(UserPickerWithIconVrApExample);
export const MultiWithDefaultValuesWithSelectedOfficialTeamsAndAdminGroupsVrAp: WorkbenchExample =
	wb(MultiWithDefaultValuesWithSelectedOfficialTeamsAndAdminGroupsVrApExample);
export const SingleWithDefaultValuesWithOfficialTeamSelectedVrAp: WorkbenchExample = wb(
	SingleWithDefaultValuesWithOfficialTeamSelectedVrApExample,
);
export const MultiDisabled: WorkbenchExample = wb(MultiDisabledExample);
export const GroupByTypeWithDefaultValueVrAp: WorkbenchExample = wb(
	GroupByTypeWithDefaultValueVrApExample,
);
export const MultiWithAutoFocusVrAp: WorkbenchExample = wb(MultiWithAutoFocusVrApExample);
export const PopupWithDefaultOpenVrAp: WorkbenchExample = wb(PopupWithDefaultOpenVrApExample);
export const SimpleDisabledOptionVrAp: WorkbenchExample = wb(SimpleDisabledOptionVrApExample);
export const SimpleMultiWithExternalUsersWithTooltipVrAp: WorkbenchExample = wb(
	SimpleMultiWithExternalUsersWithTooltipVrApExample,
);
export const SimpleMultiWithExternalUsersVrAp: WorkbenchExample = wb(
	SimpleMultiWithExternalUsersVrApExample,
);
export const SingleWithAutoFocusVrAp: WorkbenchExample = wb(SingleWithAutoFocusVrApExample);
