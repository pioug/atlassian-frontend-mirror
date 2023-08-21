import type { FeatureFlags } from '@atlaskit/editor-common/types';
export type { ListState } from '@atlaskit/editor-plugin-list';

export const MAX_NESTED_LIST_INDENTATION = 6;

export type ListPluginOptions = Pick<FeatureFlags, 'restartNumberedLists'>;
