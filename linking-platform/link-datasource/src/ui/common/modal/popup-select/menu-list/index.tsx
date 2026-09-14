import React from 'react';

import { cx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Flex } from '@atlaskit/primitives/compiled';
import { components } from '@atlaskit/react-select/components';
import type { MenuListComponentProps } from '@atlaskit/select/types';
import Spinner from '@atlaskit/spinner/spinner';
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
	showMoreButtonBoxStyles: {
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.200'),
	},
});

export type CustomMenuListProps = {
	errors?: unknown[];
	filterLabel?: string;
	filterName: string;
	handleShowMore?: () => void;
	isEmpty?: boolean;
	isError?: boolean;
	isLoading?: boolean;
	isLoadingMore?: boolean;
	showMore?: boolean;
};

const CustomMenuList = ({
	children,
	...props
}: MenuListComponentProps<SelectOption, true>): React.JSX.Element => {
	const {
		filterName,
		isLoading,
		isLoadingMore,
		isError,
		isEmpty,
		errors,
		showMore,
		handleShowMore,
		filterLabel,
	}: CustomMenuListProps = props.selectProps.menuListProps;

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
					<Box xcss={cx(styles.showMoreButtonBoxStyles)}>
						<ShowMoreButton
							onShowMore={handleShowMore}
							filterName={filterName}
							filterLabel={filterLabel}
						/>
					</Box>
				)}

				{isLoadingMoreData && <InlineSpinner />}
			</>
		);
	};

	return <components.MenuList {...props}>{renderChildren()}</components.MenuList>;
};

export default CustomMenuList;
