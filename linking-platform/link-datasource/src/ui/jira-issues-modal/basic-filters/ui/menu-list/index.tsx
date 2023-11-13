import React from 'react';

import { Flex } from '@atlaskit/primitives';
import { components, MenuListComponentProps } from '@atlaskit/select';
import Spinner from '@atlaskit/spinner';

import { BasicFilterFieldType, SelectOption } from '../../types';
import ShowMoreButton from '../async-popup-select/showMoreButton';

import CustomErrorMessage from './errorMessage';
import CustomDropdownLoadingMessage from './loadingMessage';
import CustomNoOptionsMessage from './noOptionsMessage';

type CustomProps = {
  isError?: boolean;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  isEmpty?: boolean;
  showMore?: boolean;
  handleShowMore: () => void;
  filterType: BasicFilterFieldType;
};

const CustomMenuList = ({
  filterType,
  isLoading,
  isLoadingMore,
  isError,
  isEmpty,
  showMore,
  handleShowMore,
  children,
  ...props
}: MenuListComponentProps<SelectOption, true> & CustomProps) => {
  const shouldDisplayShowMore = showMore && !isLoadingMore;
  const isLoadingMoreData = !shouldDisplayShowMore && isLoadingMore;

  const InlineSpinner = () => (
    <Flex justifyContent="center">
      <Spinner size="medium" />
    </Flex>
  );

  const renderChildren = () => {
    if (isLoading) {
      return <CustomDropdownLoadingMessage />;
    }

    if (isError) {
      return <CustomErrorMessage />;
    }

    if (isEmpty) {
      return <CustomNoOptionsMessage filterType={filterType} />;
    }

    return (
      <>
        {children}

        {shouldDisplayShowMore && (
          <ShowMoreButton onShowMore={handleShowMore} />
        )}

        {isLoadingMoreData && <InlineSpinner />}
      </>
    );
  };

  return (
    <components.MenuList {...props}>{renderChildren()}</components.MenuList>
  );
};

export default CustomMenuList;
