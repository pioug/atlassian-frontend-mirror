import React from 'react';

import { Flex, xcss } from '@atlaskit/primitives';
import { components, MenuListComponentProps } from '@atlaskit/select';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import { FilterOptionsState } from '../../hooks/useFilterOptions';
import { BasicFilterFieldType, SelectOption } from '../../types';
import ShowMoreButton from '../async-popup-select/showMoreButton';

import CustomErrorMessage from './errorMessage';
import CustomDropdownLoadingMessage from './loadingMessage';
import CustomNoOptionsMessage from './noOptionsMessage';

const inlineSpinnerStyles = xcss({
  paddingTop: token('space.075', '6px'),
});

type CustomProps = {
  isError?: boolean;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  isEmpty?: boolean;
  showMore?: boolean;
  handleShowMore: () => void;
  filterType: BasicFilterFieldType;
  errors?: FilterOptionsState['errors'];
};

const CustomMenuList = ({
  children,
  ...props
}: MenuListComponentProps<SelectOption, true>) => {
  const {
    filterType,
    isLoading,
    isLoadingMore,
    isError,
    isEmpty,
    errors,
    showMore,
    handleShowMore,
  }: CustomProps = props.selectProps.menuListProps;

  const shouldDisplayShowMore = showMore && !isLoadingMore;
  const isLoadingMoreData = !shouldDisplayShowMore && isLoadingMore;

  const InlineSpinner = () => (
    <Flex justifyContent="center" xcss={inlineSpinnerStyles}>
      <Spinner size="medium" />
    </Flex>
  );

  const renderChildren = () => {
    if (isLoading) {
      return <CustomDropdownLoadingMessage />;
    }

    if (isError) {
      return <CustomErrorMessage filterType={filterType} errors={errors} />;
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
