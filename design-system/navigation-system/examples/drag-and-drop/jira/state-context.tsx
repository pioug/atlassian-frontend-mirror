import { createContext, useContext } from 'react';

import invariant from 'tiny-invariant';

import type { TAction, TData } from './data';

export type TDispatchContextValue = (action: TAction) => void;

export const DispatchContext = createContext<TDispatchContextValue | null>(null);

export function useDispatch(): TDispatchContextValue {
	const dispatch = useContext(DispatchContext);
	invariant(dispatch, 'Could not find dispatch');
	return dispatch;
}

export type TGetDataContextValue = () => TData;

export const GetDataContext = createContext<TGetDataContextValue | null>(null);

export function useGetData() {
	const getData = useContext(GetDataContext);
	invariant(getData, 'Could not find getData()');
	return getData;
}

export const LastActionContext = createContext<TAction | null>(null);
/**
 * Not ideal. Use sparingly
 */
export function useLastAction(): TAction | null {
	const action = useContext(LastActionContext);
	return action;
}
