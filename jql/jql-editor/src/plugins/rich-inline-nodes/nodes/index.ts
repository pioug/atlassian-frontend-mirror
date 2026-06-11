import { goal } from './goal';
import type { Props as GoalRichInlineProps } from './goal/types';
import {
	lozengeWithAvatar,
	type Props as LozengeWithAvatarRichInlineProps,
} from './lozenge-with-avatar';
import { project } from './project';
import type { Props as ProjectRichInlineProps } from './project/types';
import { team, type Props as TeamRichInlineProps } from './team';
import type { JQLNodeSpec } from './types';
import { user, type Props as UserRichInlineProps } from './user';

export const richInlineNodes: {
	goal: JQLNodeSpec<GoalRichInlineProps>;
	lozengeWithAvatar: JQLNodeSpec<LozengeWithAvatarRichInlineProps>;
	project: JQLNodeSpec<ProjectRichInlineProps>;
	team: JQLNodeSpec<TeamRichInlineProps>;
	user: JQLNodeSpec<UserRichInlineProps>;
} = {
	lozengeWithAvatar,
	user,
	team,
	project,
	goal,
};
