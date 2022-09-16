import React from 'react';
import Select, { ValueType } from '@atlaskit/select';

import type {
  RenderOptionsPropsT,
  SelectOption,
} from '@atlaskit/editor-common/types';

export type { RenderOptionsPropsT, SelectOption };

export interface Props {
  hideExpandIcon?: boolean;
  options: SelectOption[];
  dispatchCommand: (command: Function) => void;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  defaultValue?: SelectOption | null;
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
