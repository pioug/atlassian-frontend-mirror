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

export const Single: WorkbenchExample<typeof SingleExample> = wb(SingleExample);
export const Multi: WorkbenchExample<typeof MultiVrApExample> = wb(MultiVrApExample);
export const AsyncOptionsLoading: WorkbenchExample<typeof AsyncOptionsLoadingExample> = wb(
	AsyncOptionsLoadingExample,
);
export const SingleCompactVrAp: WorkbenchExample<typeof SingleCompactVrApExample> =
	wb(SingleCompactVrApExample);
export const SingleSubtleVrAp: WorkbenchExample<typeof SingleSubtleVrApExample> =
	wb(SingleSubtleVrApExample);
export const SingleSubtleAndCompact: WorkbenchExample<typeof SingleSubtleAndCompactExample> = wb(
	SingleSubtleAndCompactExample,
);
export const MultiCompact: WorkbenchExample<typeof MultiCompactExample> = wb(MultiCompactExample);
export const MultiWithDefaultValuesVrAp: WorkbenchExample<
	typeof MultiWithDefaultValuesVrApExample
> = wb(MultiWithDefaultValuesVrApExample);
export const MultiWithFixedValues: WorkbenchExample<typeof MultiWithFixedValuesExample> = wb(
	MultiWithFixedValuesExample,
);
export const SingleDisabled: WorkbenchExample<typeof SingleDisabledExample> =
	wb(SingleDisabledExample);
export const InATableCellVrAp: WorkbenchExample<typeof InATableCellVrApExample> =
	wb(InATableCellVrApExample);
export const Watchers: WorkbenchExample<typeof WatchersExample> = wb(WatchersExample);
export const CreatableWithLocale: WorkbenchExample<typeof CreatableWithLocaleExample> = wb(
	CreatableWithLocaleExample,
);
export const Modal: WorkbenchExample<typeof ModalExample> = wb(ModalExample);
export const UserPickerMultiSelect: WorkbenchExample<typeof UserPickerMultiSelectExample> = wb(
	UserPickerMultiSelectExample,
);
export const MultiNoBorderVrAp: WorkbenchExample<typeof MultiNoBorderVrApExample> =
	wb(MultiNoBorderVrApExample);
export const PopupConfig: WorkbenchExample<typeof PopupConfigExample> = wb(PopupConfigExample);
export const MultiWithExternalUsers: WorkbenchExample<typeof MultiWithExternalUsersExample> = wb(
	MultiWithExternalUsersExample,
);
export const EmailInviteRecommendaton: WorkbenchExample<typeof EmailInviteRecommendatonExample> =
	wb(EmailInviteRecommendatonExample);
export const UserPickerOnModal: WorkbenchExample<typeof UserPickerOnModalExample> =
	wb(UserPickerOnModalExample);
export const DisableInput: WorkbenchExample<typeof DisableInputExample> = wb(DisableInputExample);
export const DisableOptions: WorkbenchExample<typeof DisableOptionsExample> =
	wb(DisableOptionsExample);
export const FooterVrAp: WorkbenchExample<typeof FooterVrApExample> = wb(FooterVrApExample);
export const HeaderVrAp: WorkbenchExample<typeof HeaderVrApExample> = wb(HeaderVrApExample);
export const UserPickerOnDraggable: WorkbenchExample<typeof UserPickerOnDraggableExample> = wb(
	UserPickerOnDraggableExample,
);
export const SingleOnClick: WorkbenchExample<typeof SingleOnClickExample> =
	wb(SingleOnClickExample);
export const TeamAvatarPlaceholderVrAp: WorkbenchExample<typeof TeamAvatarPlaceholderVrApExample> =
	wb(TeamAvatarPlaceholderVrApExample);
export const SingleInvalidVrAp: WorkbenchExample<typeof SingleInvalidVrApExample> =
	wb(SingleInvalidVrApExample);
export const MultiInvalidVrAp: WorkbenchExample<typeof MultiInvalidVrApExample> =
	wb(MultiInvalidVrApExample);
export const UserPickerForwardedRef: WorkbenchExample<typeof UserPickerForwardedRefExample> = wb(
	UserPickerForwardedRefExample,
);
export const UserPickerGroupByType: WorkbenchExample<typeof UserPickerGroupByTypeExample> = wb(
	UserPickerGroupByTypeExample,
);
export const IsPendingAction: WorkbenchExample<typeof IsPendingActionExample> =
	wb(IsPendingActionExample);
export const AgentHexagonAvatarVrAp: WorkbenchExample<typeof AgentHexagonAvatarVrApExample> = wb(
	AgentHexagonAvatarVrApExample,
);
export const UserPickerWithIconVrAp: WorkbenchExample<typeof UserPickerWithIconVrApExample> = wb(
	UserPickerWithIconVrApExample,
);
export const MultiWithDefaultValuesWithSelectedOfficialTeamsAndAdminGroupsVrAp: WorkbenchExample<
	typeof MultiWithDefaultValuesWithSelectedOfficialTeamsAndAdminGroupsVrApExample
> = wb(MultiWithDefaultValuesWithSelectedOfficialTeamsAndAdminGroupsVrApExample);
export const SingleWithDefaultValuesWithOfficialTeamSelectedVrAp: WorkbenchExample<
	typeof SingleWithDefaultValuesWithOfficialTeamSelectedVrApExample
> = wb(SingleWithDefaultValuesWithOfficialTeamSelectedVrApExample);
export const MultiDisabled: WorkbenchExample<typeof MultiDisabledExample> =
	wb(MultiDisabledExample);
export const GroupByTypeWithDefaultValueVrAp: WorkbenchExample<
	typeof GroupByTypeWithDefaultValueVrApExample
> = wb(GroupByTypeWithDefaultValueVrApExample);
export const MultiWithAutoFocusVrAp: WorkbenchExample<typeof MultiWithAutoFocusVrApExample> = wb(
	MultiWithAutoFocusVrApExample,
);
export const PopupWithDefaultOpenVrAp: WorkbenchExample<typeof PopupWithDefaultOpenVrApExample> =
	wb(PopupWithDefaultOpenVrApExample);
export const SimpleDisabledOptionVrAp: WorkbenchExample<typeof SimpleDisabledOptionVrApExample> =
	wb(SimpleDisabledOptionVrApExample);
export const SimpleMultiWithExternalUsersWithTooltipVrAp: WorkbenchExample<
	typeof SimpleMultiWithExternalUsersWithTooltipVrApExample
> = wb(SimpleMultiWithExternalUsersWithTooltipVrApExample);
export const SimpleMultiWithExternalUsersVrAp: WorkbenchExample<
	typeof SimpleMultiWithExternalUsersVrApExample
> = wb(SimpleMultiWithExternalUsersVrApExample);
export const SingleWithAutoFocusVrAp: WorkbenchExample<typeof SingleWithAutoFocusVrApExample> = wb(
	SingleWithAutoFocusVrApExample,
);
