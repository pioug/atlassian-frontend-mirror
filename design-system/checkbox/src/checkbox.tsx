/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type ChangeEvent,
	forwardRef,
	type ForwardRefExoticComponent,
	memo,
	type MemoExoticComponent,
	type Ref,
	type RefAttributes,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

import { cssMap, jsx } from '@compiled/react';

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { token } from '@atlaskit/tokens';

import CheckboxIcon from './internal/checkbox-icon';
import Label from './internal/label';
import LabelText from './internal/label-text';
import RequiredIndicator from './internal/required-indicator';
import type { CheckboxProps } from './types';

/**
 * The input is visually hidden but remains in the DOM for accessibility.
 * State-based styling is handled by the Label component using CSS custom properties
 * that cascade to the CheckboxIcon, avoiding nested sibling selectors.
 */
const checkboxStyles = cssMap({
	root: {
		width: '100%',
		height: '100%',
		appearance: 'none',
		border: 'none',
		// Positions the input in the same grid cell as the CheckboxIcon (which comes after in DOM order).
		// The icon appears on top (pointer-events: none) while the input sits below, invisible but interactive.
		gridArea: '1 / 1 / 2 / 2',
		marginBlockEnd: token('space.0'),
		marginBlockStart: token('space.0'),
		marginInlineEnd: token('space.0'),
		marginInlineStart: token('space.0'),
		opacity: 0,
		outline: 'none',
	},
});

/**
 * __Checkbox__
 *
 * A checkbox an input control that allows a user to select one or more options from a number of choices.
 *
 * - [Examples](https://atlassian.design/components/checkbox/examples)
 * - [Code](https://atlassian.design/components/checkbox/code)
 * - [Usage](https://atlassian.design/components/checkbox/usage)
 */
const Checkbox: MemoExoticComponent<
	ForwardRefExoticComponent<React.PropsWithoutRef<CheckboxProps> & RefAttributes<HTMLInputElement>>
> = memo(
	forwardRef(function Checkbox(
		{
			isChecked: isCheckedProp,
			isDisabled = false,
			isInvalid = false,
			defaultChecked = false,
			isIndeterminate = false,
			onChange: onChangeProps,
			analyticsContext,
			label,
			name,
			value,
			isRequired,
			testId,
			xcss,
			className,
			...rest
		}: CheckboxProps,
		ref: Ref<HTMLInputElement>,
	) {
		const [isCheckedState, setIsCheckedState] = useState(
			isCheckedProp !== undefined ? isCheckedProp : defaultChecked,
		);

		const onChange = useCallback(
			(e: ChangeEvent<HTMLInputElement>, analyticsEvent: UIAnalyticsEvent) => {
				setIsCheckedState(e.target.checked);
				if (onChangeProps) {
					onChangeProps(e, analyticsEvent);
				}
			},
			[onChangeProps],
		);

		const onChangeAnalytics = usePlatformLeafEventHandler({
			fn: onChange,
			action: 'changed',
			analyticsData: analyticsContext,
			componentName: 'checkbox',
			packageName: process.env._PACKAGE_NAME_ as string,
			packageVersion: process.env._PACKAGE_VERSION_ as string,
		});

		const internalRef = useRef<HTMLInputElement>(null);
		const mergedRefs = mergeRefs([internalRef, ref]);

		// Use isChecked from the state if it is controlled
		const isChecked = isCheckedProp === undefined ? isCheckedState : isCheckedProp;

		useEffect(() => {
			if (internalRef.current) {
				internalRef.current.indeterminate = isIndeterminate;
			}
		}, [isIndeterminate]);

		return (
			<Label
				isDisabled={isDisabled}
				isChecked={isChecked}
				isIndeterminate={isIndeterminate}
				isInvalid={isInvalid}
				label={label as string}
				id={rest.id ? `${rest.id}-label` : undefined}
				testId={testId && `${testId}--checkbox-label`}
				// Currently the rule hasn't been updated to enable "allowed" dynamic pass-throughs.
				// When there is more usage of this pattern we'll update the lint rule.
				xcss={xcss}
			>
				{/* eslint-disable-next-line @atlaskit/design-system/no-html-checkbox */}
				<input
					// It is necessary only for Safari. It allows to render focus styles.
					tabIndex={0}
					{...rest}
					type="checkbox"
					ref={mergedRefs}
					disabled={isDisabled}
					checked={isChecked}
					value={value}
					name={name}
					required={isRequired}
					css={checkboxStyles.root}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
					className={className}
					onChange={onChangeAnalytics}
					aria-invalid={isInvalid ? 'true' : undefined}
					data-testid={testId && `${testId}--hidden-checkbox`}
					data-invalid={isInvalid ? 'true' : undefined}
				/>
				<CheckboxIcon isIndeterminate={isIndeterminate} isChecked={isChecked} />
				{label && (
					<LabelText>
						{label}
						{isRequired && <RequiredIndicator />}
					</LabelText>
				)}
			</Label>
		);
	}),
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
