import { snapshot } from '@af/visual-regression';

import MultiUserPicker from '../../../examples/01-multi';
import SingleCompact from '../../../examples/03-single-compact';
import SingleSubtle from '../../../examples/04-single-subtle';
import MultiWithDefaultValues from '../../../examples/07-multi-with-default-values';
import InATableCell from '../../../examples/10-in-a-table-cell';
import MultiNoBorder from '../../../examples/16-multi-no-border';
import Footer from '../../../examples/26-footer';
import Header from '../../../examples/27-header';
import TeamAvatarPlaceholder from '../../../examples/29-team-avatar-placeholder';
import SingleInvalid from '../../../examples/30-single-invalid';
import MultiInvalid from '../../../examples/31-multi-invalid';
import GroupByTypeWithDefaultValue from '../../../examples/group-by-type-with-default-value';
import MultiWithAutoFocus from '../../../examples/multi-with-auto-focus';
import PopupWithDefaultOpen from '../../../examples/popup-with-default-open';
import SimpleDisabledOption from '../../../examples/simple-disabled-option';
import SimpleMultiWithExternalUsers from '../../../examples/simple-multi-with-external-users';
import SimpleMultiWithExternalUsersWithTooltip from '../../../examples/simple-multi-with-external-users-with-tooltip';
import SingleUserPickerWithAutoFocus from '../../../examples/single-with-auto-focus';
import SingleUserPickerWithAgentHexagonAvatar from '../../../examples/35-agent-hexagon-avatar';
import UserPickerWithIcon from '../../../examples/36-user-picker-with-icon';

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
	featureFlags: {
		jira_ai_agent_avatar_user_picker_user_option: true,
	},
});

snapshot(UserPickerWithIcon, {
	drawsOutsideBounds: true,
	featureFlags: {	
		atlaskit_user_picker_support_icon: true,
	},
});