import { assets } from './assets';
import type { Props as AssetsRichInlineProps } from './assets/types';
import { focusArea } from './focus-area';
import type { Props as FocusAreaRichInlineProps } from './focus-area/types';
import { goal } from './goal';
import type { Props as GoalRichInlineProps } from './goal/types';
import {
	lozengeWithAvatar,
	type Props as LozengeWithAvatarRichInlineProps,
} from './lozenge-with-avatar';
import { project } from './project';
import type { Props as ProjectRichInlineProps } from './project/types';
import { team } from './team';
import type { Props as TeamRichInlineProps } from './team/types';
import type { JQLNodeSpec } from './types';
import { user, type Props as UserRichInlineProps } from './user';

export const richInlineNodes: {
	assets: JQLNodeSpec<AssetsRichInlineProps>;
	focusArea: JQLNodeSpec<FocusAreaRichInlineProps>;
	goal: JQLNodeSpec<GoalRichInlineProps>;
	lozengeWithAvatar: JQLNodeSpec<LozengeWithAvatarRichInlineProps>;
	project: JQLNodeSpec<ProjectRichInlineProps>;
	team: JQLNodeSpec<TeamRichInlineProps>;
	user: JQLNodeSpec<UserRichInlineProps>;
} = {
	assets,
	focusArea,
	lozengeWithAvatar,
	user,
	team,
	project,
	goal,
};
