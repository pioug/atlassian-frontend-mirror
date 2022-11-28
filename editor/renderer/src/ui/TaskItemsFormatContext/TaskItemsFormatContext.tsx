import React, { ReactNode } from 'react';

export type TaskItemsDone = boolean | undefined;

export type TaskItemsStateContext = [
  TaskItemsDone,
  React.Dispatch<TaskItemsFormatReducerAction>,
];

const defaultValue = [undefined, () => {}] as TaskItemsStateContext;

export const TaskItemsFormatContext =
  React.createContext<TaskItemsStateContext>(defaultValue);

export type TaskItemsFormatReducerAction = boolean | undefined;

const reducer = (
  _state: TaskItemsDone,
  action: TaskItemsFormatReducerAction,
) => {
  return action;
};

export function TaskItemsFormatProvider({ children }: { children: ReactNode }) {
  const value = React.useReducer(reducer, undefined);

  return (
    <TaskItemsFormatContext.Provider value={value}>
      {children}
    </TaskItemsFormatContext.Provider>
  );
}

export function useTaskItemsFormatContext() {
  return React.useContext(TaskItemsFormatContext);
}

export function TaskItemsFormatConsumer({
  children,
}: {
  children: ([isChecked, dispatch]: TaskItemsStateContext) => ReactNode;
}) {
  return (
    <TaskItemsFormatContext.Consumer>
      {children}
    </TaskItemsFormatContext.Consumer>
  );
}
