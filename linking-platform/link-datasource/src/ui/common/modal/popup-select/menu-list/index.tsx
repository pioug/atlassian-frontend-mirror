import React from 'react';

import { Box, Flex, xcss } from '@atlaskit/primitives';
import { components, MenuListComponentProps } from '@atlaskit/select';
import Spinner from '@atlaskit/spinner';

import { SelectOption } from '../types';

import CustomErrorMessage from './errorMessage';
import CustomDropdownLoadingMessage from './loadingMessage';
import CustomNoOptionsMessage from './noOptionsMessage';
import ShowMoreButton from './showMoreButton';

const inlineSpinnerStyles = xcss({
  paddingTop: 'space.075',
});

const showMoreButtonBoxStyles = xcss({
  paddingLeft: 'space.075',
  paddingTop: 'space.100',
});

export type CustomMenuListProps = {
  isError?: boolean;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  isEmpty?: boolean;
  showMore?: boolean;
  handleShowMore: () => void;
  filterName: string;
  errors?: unknown[];
};

const CustomMenuList = ({
  children,
  ...props
}: MenuListComponentProps<SelectOption, true>) => {
  const {
    filterName,
    isLoading,
    isLoadingMore,
    isError,
    isEmpty,
    errors,
    showMore,
    handleShowMore,
  }: CustomMenuListProps = props.selectProps.menuListProps;

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
      return <CustomErrorMessage filterName={filterName} errors={errors} />;
    }

    if (isEmpty) {
      return <CustomNoOptionsMessage filterName={filterName} />;
    }

    return (
      <>
        {children}

        {shouldDisplayShowMore && (
          <Box xcss={showMoreButtonBoxStyles}>
            <ShowMoreButton
              onShowMore={handleShowMore}
              filterName={filterName}
            />
          </Box>
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
