/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, memo, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

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

		const handleBlur = usePlatformLeafEventHandler({
			fn: providedOnBlur,
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

		const shouldChecked = isControlled ? checked : isChecked;

		const controlProps = {
			'data-checked': shouldChecked ? shouldChecked : undefined,
			'data-disabled': isDisabled ? isDisabled : undefined,
			'data-size': size,
			'data-testid': testId ? testId : undefined,
		};

		const toggleStyles = useMemo(() => getStyles(size), [size]);

		const legacyIconSize = iconSizeMap[size];

		const labelId = useId();

		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			<label {...controlProps} css={toggleStyles}>
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
