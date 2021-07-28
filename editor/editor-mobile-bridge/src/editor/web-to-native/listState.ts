import { ListState } from '@atlaskit/editor-core';

export interface ListsState {
  name: string;
  active: boolean;
  enabled: boolean;
}

export function valueOf(state: ListState): ListsState[] {
  let states: ListsState[] = [
    {
      name: 'bullet',
      active: state.bulletListActive,
      enabled: !state.bulletListDisabled,
    },
    {
      name: 'ordered',
      active: state.orderedListActive,
      enabled: !state.orderedListDisabled,
    },
  ];
  return states;
}
