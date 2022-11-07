import React, { useRef } from 'react';
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
  setDisableParentScroll?: (disable: boolean) => void;
}

export default function Search(props: Props) {
  const selectRef = useRef<any>(null);

  const { width = 200 } = props;
  const style = React.useMemo(
    () => ({
      container: (base: any) => ({ ...base, width }),
      menuPortal: (base: any) => {
        const controlWrapper =
          selectRef?.current?.select.select.controlRef.parentNode;
        const menuPortalStyles =
          controlWrapper && props.setDisableParentScroll
            ? {
                // since the portal is now outside, we need to position it as before
                top: controlWrapper.offsetTop,
                left: controlWrapper.offsetLeft,
                height: controlWrapper.offsetHeight,
                width,
              }
            : {};
        return {
          ...base,
          ...menuPortalStyles,
        };
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width],
  );

  const onMenuOpen = () => {
    if (props.setDisableParentScroll) {
      props.setDisableParentScroll(true);
    }
  };

  const onMenuClose = () => {
    if (props.setDisableParentScroll) {
      props.setDisableParentScroll(false);
    }
  };

  return (
    <Select<SelectOption>
      ref={selectRef}
      options={props.options}
      value={props.defaultValue}
      onChange={props.onChange}
      placeholder={props.placeholder}
      spacing="compact"
      menuPlacement="auto"
      filterOption={props.filterOption}
      styles={style}
      menuPortalTarget={props.mountPoint}
      onMenuOpen={onMenuOpen}
      onMenuClose={onMenuClose}
    />
  );
}
