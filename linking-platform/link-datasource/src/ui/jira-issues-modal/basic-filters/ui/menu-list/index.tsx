import React from 'react';

import { components, MenuListComponentProps } from '@atlaskit/select';

import { SelectOption } from '../../types';

import CustomErrorMessage from './errorMessage';
import CustomDropdownLoadingMessage from './loadingMessage';
import CustomNoOptionsMessage from './noOptionsMessage';

type CustomProps = {
  isError?: boolean;
  isLoading?: boolean;
  isEmpty?: boolean;
};

const CustomMenuList = ({
  isLoading,
  isError,
  isEmpty,
  children,
  ...props
}: MenuListComponentProps<SelectOption, true> & CustomProps) => {
  const getChildComponent = () => {
    if (isLoading) {
      return <CustomDropdownLoadingMessage />;
    }

    if (isError) {
      return <CustomErrorMessage />;
    }

    if (isEmpty) {
      return <CustomNoOptionsMessage />;
    }

    return children;
  };

  return (
    <components.MenuList {...props}>{getChildComponent()}</components.MenuList>
  );
};

export default CustomMenuList;
