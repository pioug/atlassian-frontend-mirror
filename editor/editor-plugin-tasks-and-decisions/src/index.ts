/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

export { tasksAndDecisionsPlugin } from './tasksAndDecisionsPlugin';
export type { TasksAndDecisionsPlugin } from './tasksAndDecisionsPluginType';
export type {
	TaskDecisionPluginOptions,
	TasksAndDecisionsPluginOptions,
	TaskAndDecisionsSharedState,
	TaskDecisionListType,
	AddItemTransactionCreator,
} from './types';
