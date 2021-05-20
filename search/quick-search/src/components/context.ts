import React from 'react';
import { ComponentType } from 'react';
import { ResultData, ResultId, SelectedResultId } from './Results/types';
import { ResultBase } from './Results/ResultBase';

export type ResultContextType = {
  /** Register result as keyboard navigation target */
  registerResult: (result: ResultBase) => void;
  /** Unregister result as keyboard navigation target */
  unregisterResult: (result: ResultBase) => void;
  /** Triggered by mouseEnter event. */
  onMouseEnter: (resultData: ResultData) => void;
  /** Standard onMouseLeave event. */
  onMouseLeave: () => void;
  /** Fires an analytics event */
  sendAnalytics?: (eventName: string, eventData: Object) => void;
  /** get the index of the search result in the list of result */
  getIndex: (resultId: ResultId) => number | null;
  /** React component to be used for rendering links */
  linkComponent?: ComponentType;
};

const defaultState: ResultContextType = {
  sendAnalytics: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  registerResult: () => {},
  unregisterResult: () => {},
  getIndex: (n) => Number(n),
};

export const ResultContext = React.createContext(defaultState);
export const SelectedResultIdContext = React.createContext<SelectedResultId>(
  null,
);
