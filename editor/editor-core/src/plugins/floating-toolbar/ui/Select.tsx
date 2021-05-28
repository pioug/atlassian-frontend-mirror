import React from 'react';
import Select, { ValueType } from '@atlaskit/select';

export interface RenderOptionsPropsT<T> {
  hide: () => void;
  dispatchCommand: (command: T) => void;
}

export interface SelectOption<T = unknown> {
  value: string;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  data?: T;
}

export interface Props {
  hideExpandIcon?: boolean;
  options: SelectOption[];
  dispatchCommand: (command: Function) => void;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  defaultValue?: SelectOption;
  placeholder?: string;
  onChange?: (change: ValueType<SelectOption>) => void;
  width?: number;
  filterOption?: ((option: SelectOption, rawInput: string) => boolean) | null;
}

export default function Search(props: Props) {
  const { width = 200 } = props;
  const style = React.useMemo(
    () => ({ container: (base: any) => ({ ...base, width }) }),
    [width],
  );

  return (
    <Select<SelectOption>
      options={props.options}
      value={props.defaultValue}
      onChange={props.onChange}
      placeholder={props.placeholder}
      spacing="compact"
      menuPlacement="auto"
      filterOption={props.filterOption}
      styles={style}
    />
  );
}
