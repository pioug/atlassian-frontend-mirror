import React from 'react';

export interface RenderOptionsPropsT<T> {
  hide: () => void;
  dispatchCommand: (command: T) => void;
}

export interface DropdownOptionT<T> {
  id?: string;
  title: string;
  onClick: T;
  selected?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  testId?: string;
  tooltip?: string;
}

export type DropdownOptions<T> =
  | Array<DropdownOptionT<T>>
  | {
      render: (props: RenderOptionsPropsT<T>) => React.ReactElement<any> | null;
      height: number;
      width: number;
    };
