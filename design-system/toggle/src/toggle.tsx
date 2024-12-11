/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type FocusEvent,
	forwardRef,
	type KeyboardEvent,
	memo,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { bindAll } from 'bind-event-listener';

import { type UIAnalyticsEvent, usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import __noop from '@atlaskit/ds-lib/noop';
import { useId } from '@atlaskit/ds-lib/use-id';
import type { Size as IconSize } from '@atlaskit/icon/types';
import CheckMarkIcon from '@atlaskit/icon/utility/migration/check-mark--editor-done';
import CloseIcon from '@atlaskit/icon/utility/migration/cross--editor-close';

import IconContainer from './icon-container';
import { getStyles } from './internal/styles';
import { type Size, type ToggleProps } from './types';

const noop = __noop;

const analyticsAttributes = {
	componentName: 'toggle',
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
};

const iconSizeMap: Record<Size, IconSize> = {
	regular: 'small',
	large: 'medium',
};

/**
 * __Toggle__
 *
 * A toggle is used to view or switch between enabled or disabled states.
 *
 * - [Examples](https://atlassian.design/components/toggle/examples)
 * - [Code](https://atlassian.design/components/toggle/code)
 * - [Usage](https://atlassian.design/components/toggle/usage)
 */
const Toggle = memo(
	forwardRef<HTMLInputElement, ToggleProps>((props, ref) => {
		const {
			defaultChecked = false,
			isDisabled = false,
			onBlur: providedOnBlur = noop,
			onChange: providedChange = noop,
			onFocus: providedFocus = noop,
			size = 'regular' as Size,
			name = '',
			value = '',
			isChecked,
			analyticsContext,
			id,
			testId,
			label,
			descriptionId,
		} = props;

		const isControlled = typeof isChecked === 'undefined';
		const [checked, setChecked] = useState(defaultChecked);
		const [isKeyboardUsed, setIsKeyboardUsed] = useState<boolean | null>(true);
		const wrapperRef = useRef<HTMLLabelElement>(null);

		useEffect(() => {
			if (id && wrapperRef.current && wrapperRef.current.parentElement) {
				/*
					DSP-21524 Handling the click on <label> that is linked via "for" attribute.
					By default click on the label fires absolutely same onclick event as click on the input element.
					To differentiate keyboard click from mouse we need this additional listener.
				*/
				const linkedLabel: HTMLLabelElement | null = wrapperRef.current.parentElement.querySelector(
					`label[for='${id}']`,
				);
				if (linkedLabel) {
					const unbind = bindAll(linkedLabel, [
						{
							type: 'click',
							listener: (event) => {
								setIsKeyboardUsed(false);
								if (event?.detail > 1) {
									/*
									DSP-21524 double or triple click on label initiating the text selection for label text and adds additional step to tab order.
									So here we set the isKeyboardUsed to true, to display focus ring on next Tab press
									*/
									setIsKeyboardUsed(true);
								}
							},
						},
					]);
					return unbind;
				}
			}
		}, [id, wrapperRef, isKeyboardUsed]);

		const handleBlur = usePlatformLeafEventHandler({
			fn: (event: FocusEvent<HTMLInputElement>, analyticsEvent: UIAnalyticsEvent) => {
				if (!isKeyboardUsed) {
					setIsKeyboardUsed(true);
				}
				providedOnBlur(event, analyticsEvent);
			},
			action: 'blur',
			analyticsData: analyticsContext,
			...analyticsAttributes,
		});

		const handleFocus = usePlatformLeafEventHandler({
			fn: providedFocus,
			action: 'focus',
			analyticsData: analyticsContext,
			...analyticsAttributes,
		});

		const handleChange = usePlatformLeafEventHandler({
			fn: (event: React.ChangeEvent<HTMLInputElement>, analyticsEvent: UIAnalyticsEvent) => {
				if (isControlled) {
					setChecked((checked) => !checked);
				}
				return providedChange(event, analyticsEvent);
			},
			action: 'change',
			analyticsData: analyticsContext,
			...analyticsAttributes,
		});

		const onLabelKeyDown = (event: KeyboardEvent<HTMLElement>) => {
			if ([' ', 'Tab', 'Space'].includes(event.key)) {
				setIsKeyboardUsed(true);
			}
		};

		const shouldChecked = isControlled ? checked : isChecked;

		const controlProps = {
			'data-checked': shouldChecked ? shouldChecked : undefined,
			'data-disabled': isDisabled ? isDisabled : undefined,
			'data-size': size,
			'data-testid': testId ? testId : undefined,
			// DSP-21524 Because label gets focus ring via focus-within and focus-within also triggers by mouse click we have to manually control the ring appearance.
			onKeyDown: onLabelKeyDown,
			onMouseDown: () => {
				setIsKeyboardUsed(false);
			},
		};
		const toggleStyles = useMemo(
			() => getStyles(size, Boolean(isKeyboardUsed)),
			[size, isKeyboardUsed],
		);

		const legacyIconSize = iconSizeMap[size];

		const labelId = useId();
		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			<label {...controlProps} css={toggleStyles} ref={wrapperRef}>
				{label ? (
					<span id={labelId} hidden>
						{label}
					</span>
				) : null}
				<input
					ref={ref}
					checked={shouldChecked}
					disabled={isDisabled}
					id={id}
					name={name}
					onBlur={handleBlur}
					onChange={handleChange}
					onFocus={handleFocus}
					type="checkbox"
					value={value}
					data-testid={testId && `${testId}--input`}
					aria-labelledby={label ? labelId : undefined}
					aria-describedby={descriptionId}
				/>
				<IconContainer size={size} isHidden={!shouldChecked} position="left">
					<CheckMarkIcon
						label=""
						color="currentColor"
						LEGACY_size={legacyIconSize}
						testId={testId && `${testId}--toggle-check-icon`}
					/>
				</IconContainer>
				<IconContainer size={size} isHidden={shouldChecked} position="right">
					<CloseIcon
						label=""
						color="currentColor"
						LEGACY_size={legacyIconSize}
						testId={testId && `${testId}--toggle-cross-icon`}
					/>
				</IconContainer>
			</label>
		);
	}),
);

Toggle.displayName = 'Toggle';

export default Toggle;
