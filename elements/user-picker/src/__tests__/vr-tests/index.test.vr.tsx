import { snapshot } from '@af/visual-regression';

import MultiUserPicker from '../../../examples/01-multi.vr.ap';
import SingleCompact from '../../../examples/03-single-compact.vr.ap';
import SingleSubtle from '../../../examples/04-single-subtle.vr.ap';
import MultiWithDefaultValues from '../../../examples/07-multi-with-default-values.vr.ap';
import InATableCell from '../../../examples/10-in-a-table-cell.vr.ap';
import MultiNoBorder from '../../../examples/16-multi-no-border.vr.ap';
import Footer from '../../../examples/26-footer.vr.ap';
import Header from '../../../examples/27-header.vr.ap';
import TeamAvatarPlaceholder from '../../../examples/29-team-avatar-placeholder.vr.ap';
import SingleInvalid from '../../../examples/30-single-invalid.vr.ap';
import MultiInvalid from '../../../examples/31-multi-invalid.vr.ap';
import GroupByTypeWithDefaultValue from '../../../examples/group-by-type-with-default-value.vr.ap';
import MultiWithAutoFocus from '../../../examples/multi-with-auto-focus.vr.ap';
import PopupWithDefaultOpen from '../../../examples/popup-with-default-open.vr.ap';
import SimpleDisabledOption from '../../../examples/simple-disabled-option.vr.ap';
import SimpleMultiWithExternalUsers from '../../../examples/simple-multi-with-external-users.vr.ap';
import SimpleMultiWithExternalUsersWithTooltip from '../../../examples/simple-multi-with-external-users-with-tooltip.vr.ap';
import SingleUserPickerWithAutoFocus from '../../../examples/single-with-auto-focus.vr.ap';
import SingleUserPickerWithAgentHexagonAvatar from '../../../examples/35-agent-hexagon-avatar.vr.ap';
import UserPickerWithIcon from '../../../examples/36-user-picker-with-icon.vr.ap';
import MultiWithDefaultValuesWithSelectedOfficialTeams from '../../../examples/37-multi-with-default-values-with-selected-official-teams-and-admin-groups.vr.ap';
import SingleWithDefaultValuesWithSelectedOfficialTeamSelected from '../../../examples/38-single-with-default-values-with-official-team-selected.vr.ap';

snapshot(SingleUserPickerWithAutoFocus, {
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});

snapshot(MultiUserPicker);

snapshot(MultiWithAutoFocus, {
	drawsOutsideBounds: true,
});

snapshot(SingleCompact);

snapshot(SingleSubtle);

snapshot(MultiWithDefaultValues);

snapshot(InATableCell);

snapshot(MultiNoBorder);

snapshot(PopupWithDefaultOpen, {
	drawsOutsideBounds: true,
});

snapshot(SimpleMultiWithExternalUsers, {
	drawsOutsideBounds: true,
});

snapshot(SimpleMultiWithExternalUsersWithTooltip, {
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'source-icon',
			},
		},
	],
});

snapshot(SimpleDisabledOption, {
	drawsOutsideBounds: true,
});

snapshot(Footer, {
	drawsOutsideBounds: true,
});

snapshot(Header, {
	drawsOutsideBounds: true,
});

snapshot(TeamAvatarPlaceholder);

snapshot(SingleInvalid);

snapshot(MultiInvalid);

snapshot(GroupByTypeWithDefaultValue, {
	drawsOutsideBounds: true,
});

snapshot(SingleUserPickerWithAgentHexagonAvatar, {
	drawsOutsideBounds: true,
});

snapshot(UserPickerWithIcon, {
	drawsOutsideBounds: true,
});

snapshot(MultiWithDefaultValuesWithSelectedOfficialTeams);

snapshot(SingleWithDefaultValuesWithSelectedOfficialTeamSelected);
