import { CardAction, CardActionType } from '../actions/types';
import { Reducer } from 'react';

export type CardReducerMap<StateType, ActionType> = Record<
  CardActionType,
  CardReducer<StateType, ActionType>
>;
export type CardReducer<StateType, ActionType> = Reducer<
  StateType,
  CardAction<ActionType>
>;
