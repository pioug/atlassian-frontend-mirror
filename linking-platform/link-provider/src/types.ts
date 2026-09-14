import { type Reducer } from 'react';
import type { CardActionType, CardAction } from '@atlaskit/linking-common/types';

export type CardReducerMap<StateType, ActionType> = Record<
	CardActionType,
	CardReducer<StateType, ActionType>
>;
export type CardReducer<StateType, ActionType> = Reducer<StateType, CardAction<ActionType>>;
