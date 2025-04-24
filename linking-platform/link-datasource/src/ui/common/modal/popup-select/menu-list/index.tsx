import React from 'react';

import { cx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Flex } from '@atlaskit/primitives/compiled';
import { components, type MenuListComponentProps } from '@atlaskit/select';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import { type SelectOption } from '../types';

import CustomErrorMessage from './errorMessage';
import CustomDropdownLoadingMessage from './loadingMessage';
import CustomNoOptionsMessage from './noOptionsMessage';
import ShowMoreButton from './showMoreButton';

const styles = cssMap({
	inlineSpinnerStyles: {
		paddingTop: token('space.075'),
	},
	showMoreButtonBoxStylesOld: {
		paddingLeft: token('space.075'),
		paddingTop: token('space.100'),
	},
	showMoreButtonBoxStyles: {
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.200'),
	},
});

export type CustomMenuListProps = {
	isError?: boolean;
	isLoading?: boolean;
	isLoadingMore?: boolean;
	isEmpty?: boolean;
	showMore?: boolean;
	handleShowMore?: () => void;
	filterName: string;
	errors?: unknown[];
};

const CustomMenuList = ({ children, ...props }: MenuListComponentProps<SelectOption, true>) => {
	const {
		filterName,
		isLoading,
		isLoadingMore,
		isError,
		isEmpty,
		errors,
		showMore,
		handleShowMore,
	}: CustomMenuListProps =
		// @ts-ignore - https://product-fabric.atlassian.net/browse/DSP-21000
		props.selectProps.menuListProps;

	const shouldDisplayShowMore = showMore && !isLoadingMore;
	const isLoadingMoreData = !shouldDisplayShowMore && isLoadingMore;

	const InlineSpinner = () => (
		<Flex justifyContent="center" xcss={styles.inlineSpinnerStyles}>
			<Spinner size="medium" />
		</Flex>
	);

	const renderChildren = () => {
		if (isLoading) {
			return <CustomDropdownLoadingMessage filterName={filterName} />;
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

				{shouldDisplayShowMore && handleShowMore && (
					<Box
						xcss={cx(
							fg('platform-linking-visual-refresh-sllv')
								? styles.showMoreButtonBoxStyles
								: styles.showMoreButtonBoxStylesOld,
						)}
					>
						<ShowMoreButton onShowMore={handleShowMore} filterName={filterName} />
					</Box>
				)}

				{isLoadingMoreData && <InlineSpinner />}
			</>
		);
	};

	return <components.MenuList {...props}>{renderChildren()}</components.MenuList>;
};

export default CustomMenuList;
