import { Reducer } from 'react';
import { CardAction, CardActionType } from '@atlaskit/linking-common';

export type CardReducerMap<StateType, ActionType> = Record<
  CardActionType,
  CardReducer<StateType, ActionType>
>;
export type CardReducer<StateType, ActionType> = Reducer<
  StateType,
  CardAction<ActionType>
>;
