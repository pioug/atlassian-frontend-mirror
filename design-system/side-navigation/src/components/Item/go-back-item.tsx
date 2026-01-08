import React, { forwardRef, useCallback, useState } from 'react';

import ArrowLeftIcon from '@atlaskit/icon/core/arrow-left';
import type { ButtonItemProps } from '@atlaskit/menu';

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
const GoBackItem: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<ButtonItemProps> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, ButtonItemProps>(
	(
		{
			className,
			iconBefore = <ArrowLeftIcon color="currentColor" label="" />,
			onClick,
			isSelected,
			...rest
		},
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
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides, @atlaskit/ui-styling-standard/no-classname-prop
				className={className}
				iconBefore={iconBefore}
				onClick={onClickHandler}
				ref={ref}
				{...rest}
			/>
		);
	},
);

export default GoBackItem;
