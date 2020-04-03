import { ListsState } from '@atlaskit/editor-core';

export interface ListState {
  name: string;
  active: boolean;
  enabled: boolean;
}

export function valueOf(state: ListsState): ListState[] {
  let states: ListState[] = [
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
