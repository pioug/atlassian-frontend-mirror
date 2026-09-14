import { GOAL_ICON_KEYS } from './goal-icon';
import type { GoalIconKey } from './goal-icon';

export const isGoalIconKey = (value: string): value is GoalIconKey =>
	(GOAL_ICON_KEYS as readonly string[]).includes(value);
