import EmotionDecisionItem from './components/DecisionItem';
import CompiledDecisionItem from './components/compiled/DecisionItem';

import EmotionDecisionList from './components/DecisionList';
import CompiledDecisionList from './components/compiled/DecisionList';

import ResourcedTaskItem from './components/ResourcedTaskItem';
import TaskDecisionResource from './api/TaskDecisionResource';
import EmotionTaskItem from './components/TaskItem';
import CompiledTaskItem from './components/compiled/TaskItem';

import EmotionTaskList from './components/TaskList';
import CompiledTaskList from './components/compiled/TaskList';

import { componentWithFG } from '@atlaskit/platform-feature-flags-react';

const DecisionItem = componentWithFG(
	'platform_editor_css_migrate_stage_1',
	CompiledDecisionItem,
	EmotionDecisionItem,
);

const DecisionList = componentWithFG(
	'platform_editor_css_migrate_stage_1',
	CompiledDecisionList,
	EmotionDecisionList,
);

const TaskItem = componentWithFG(
	'platform_editor_css_migrate_stage_1',
	CompiledTaskItem,
	EmotionTaskItem,
);

const TaskList = componentWithFG(
	'platform_editor_css_migrate_stage_1',
	CompiledTaskList,
	EmotionTaskList,
);

export { PubSubSpecialEventType } from './types';
export type {
	Appearance,
	ARI,
	AVI,
	BaseItem,
	ContentRef,
	Cursor,
	Decision,
	DecisionState,
	DecisionStatus,
	DecisionType,
	Handler,
	Item,
	Meta,
	ObjectKey,
	OnUpdate,
	PubSubClient,
	PubSubOnEvent,
	RecentUpdateContext,
	RecentUpdatesId,
	RecentUpdatesListener,
	RenderDocument,
	RendererContext,
	ServiceDecision,
	ServiceDecisionResponse,
	ServiceItem,
	ServiceTask,
	ServiceTaskState,
	Task,
	TaskDecisionProvider,
	TaskDecisionResourceConfig,
	TaskState,
	TaskType,
	UserId,
} from './types';

export { DecisionItem, DecisionList, ResourcedTaskItem, TaskDecisionResource, TaskItem, TaskList };
