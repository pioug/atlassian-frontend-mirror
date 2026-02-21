import React, { useCallback, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type CSSObject } from '@emotion/react';

import noop from '@atlaskit/ds-lib/noop';
import { useGlobalTheme } from '@atlaskit/theme/components';

import ButtonBase from './shared/button-base';
import { getCss } from './shared/css';
import getIsOnlySingleIcon from './shared/get-is-only-single-icon';
import { type BaseProps } from './types';

const isFirefox: boolean =
	typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

export interface ButtonProps extends BaseProps {}

/**
 * __Button__
 *
 * @deprecated Legacy buttons are deprecated and will be removed from `atlaskit/button` in an upcoming major release. Please use the new Button components from `@atlaskit/button/new`
 *
 * Please refer to the [migration guide](https://atlassian.design/components/button/button-legacy/migration-guide) for further details.
 *
 * A button triggers an event or action. They let users know what will happen next.
 *
 * - [Examples](https://atlassian.design/components/button/button-legacy/examples)
 * - [Code](https://atlassian.design/components/button/button-legacy/code)
 * - [Usage](https://atlassian.design/components/button/button-legacy/usage)
 */
const Button: React.MemoExoticComponent<
	React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLElement>>
> = React.memo(
	React.forwardRef(function Button(
		{
			appearance = 'default',
			children,
			iconBefore,
			iconAfter,
			isSelected = false,
			onMouseDown: providedOnMouseDown = noop,
			onMouseUp: providedOnMouseUp = noop,
			shouldFitContainer = false,
			spacing = 'default',
			...rest
		}: ButtonProps,
		ref: React.Ref<HTMLElement>,
	) {
		const { mode } = useGlobalTheme();
		const isOnlySingleIcon: boolean = getIsOnlySingleIcon({
			children,
			iconBefore,
			iconAfter,
		});

		const [isActive, setIsActive] = useState<boolean>(false);

		// Wrap onMouseDown / onMouseUp to manually trigger active state
		//  in Firefox
		const onMouseDown = useCallback(
			(event: React.MouseEvent<HTMLElement>) => {
				providedOnMouseDown(event);
				if (isFirefox) {
					setIsActive(true);
				}
			},
			[providedOnMouseDown, setIsActive],
		);

		const onMouseUp = useCallback(
			(event: React.MouseEvent<HTMLElement>) => {
				providedOnMouseUp(event);
				if (isFirefox) {
					setIsActive(false);
				}
			},
			[providedOnMouseUp, setIsActive],
		);

		const buttonCss: CSSObject = useMemo(
			() =>
				getCss({
					appearance,
					spacing,
					mode,
					isSelected,
					shouldFitContainer,
					isOnlySingleIcon,
				}),
			[appearance, spacing, mode, isSelected, shouldFitContainer, isOnlySingleIcon],
		);

		return (
			<ButtonBase
				{...rest}
				ref={ref}
				appearance={appearance}
				buttonCss={buttonCss}
				children={children}
				// Due to how click events are set, we need to set active styles
				//  manually in Firefox and wrap onMouseDown/onMouseUp
				data-firefox-is-active={isActive ? true : undefined}
				iconAfter={iconAfter}
				iconBefore={iconBefore}
				isSelected={isSelected}
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				spacing={spacing}
			/>
		);
	}),
);

// Tools including enzyme rely on components having a display name
Button.displayName = 'Button';

export default Button;
