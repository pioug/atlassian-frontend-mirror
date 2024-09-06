import React, { forwardRef, useCallback, useState } from 'react';

import ArrowLeftIcon from '@atlaskit/icon/core/migration/arrow-left--arrow-left-circle';
import type { ButtonItemProps } from '@atlaskit/menu';
import { N10 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import ButtonItem from './button-item';

export type { ButtonItemProps as GoBackItemProps } from '@atlaskit/menu';

/**
 * __Go back item__
 *
 * A go back item is used to provide a customized "go back" button in nested
 * navigations.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#go-back-item)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const GoBackItem = forwardRef<HTMLElement, ButtonItemProps>(
	(
		{
			cssFn,
			iconBefore = (
				<ArrowLeftIcon
					color="currentColor"
					LEGACY_secondaryColor={token('elevation.surface', N10)}
					label=""
				/>
			),
			onClick,
			isSelected,
			...rest
		}: // Type needed on props to extract types with extract react types.
		ButtonItemProps,
		ref,
	) => {
		const [isInteracted, setIsInteracted] = useState(false);

		const onClickHandler: NonNullable<ButtonItemProps['onClick']> = useCallback(
			(e) => {
				if (isInteracted) {
					return;
				}

				setIsInteracted(true);
				onClick && onClick(e);
			},
			[onClick, isInteracted],
		);

		return (
			<ButtonItem
				isSelected={isSelected}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				cssFn={cssFn}
				iconBefore={iconBefore}
				onClick={onClickHandler}
				ref={ref}
				{...rest}
			/>
		);
	},
);

export default GoBackItem;
