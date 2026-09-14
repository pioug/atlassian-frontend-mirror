import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DecisionItemExample from './00-decision-item';
import DecisionListExample from './01-decision-list';
import TaskItemExample from './02-task-item';
import TaskListExample from './03-task-list';
import ResourcedTaskItemExample from './04-resourced-task-item';

export const DecisionItem: WorkbenchExample = wb(DecisionItemExample);
export const DecisionList: WorkbenchExample = wb(DecisionListExample);
export const TaskItem: WorkbenchExample = wb(TaskItemExample);
export const TaskList: WorkbenchExample = wb(TaskListExample);
export const ResourcedTaskItem: WorkbenchExample = wb(ResourcedTaskItemExample);
