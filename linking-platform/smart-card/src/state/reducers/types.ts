import { type Reducer } from 'react';
import { type CardAction, type CardActionType } from '@atlaskit/linking-common';

export type CardReducerMap<StateType, ActionType> = Record<
  CardActionType,
  CardReducer<StateType, ActionType>
>;
export type CardReducer<StateType, ActionType> = Reducer<
  StateType,
  CardAction<ActionType>
>;
