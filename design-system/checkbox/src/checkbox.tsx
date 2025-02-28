/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type ChangeEvent,
	forwardRef,
	memo,
	type Ref,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

import { css, jsx } from '@compiled/react';

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { B200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { CheckboxIcon, Label, LabelText, RequiredIndicator } from './internal';
import type { CheckboxProps } from './types';

const checkboxStyles = css({
	width: '100%',
	height: '100%',
	appearance: 'none',
	border: 'none',
	gridArea: '1 / 1 / 2 / 2',
	marginBlockEnd: token('space.0', '0px'),
	marginBlockStart: token('space.0', '0px'),
	marginInlineEnd: token('space.0', '0px'),
	marginInlineStart: token('space.0', '0px'),
	opacity: 0,
	outline: 'none',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles
	'& + svg': {
		'--checkbox-background-color': 'var(--local-background)',
		'--checkbox-border-color': 'var(--local-border)',
		'--checkbox-tick-color': 'var(--local-tick-rest)',
		color: 'var(--checkbox-background-color)',
		fill: 'var(--checkbox-tick-color)',
		gridArea: '1 / 1 / 2 / 2',
		pointerEvents: 'none',
		transition: 'color 0.2s ease-in-out, fill 0.2s ease-in-out',
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'rect:first-of-type': {
			stroke: 'var(--checkbox-border-color)',
			strokeWidth: token('border.width', '1px'),
			transition: 'stroke 0.2s ease-in-out',
		},
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
	'&&:focus + svg, &&:checked:focus + svg': {
		borderRadius: token('border.radius', '0.25rem'),
		outline: `${token('border.width.outline', '2px')} solid ${token('color.border.focused', B200)}`,
		outlineOffset: token('space.negative.025', '-2px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&:hover + svg': {
		'--checkbox-background-color': 'var(--local-background-hover)',
		'--checkbox-border-color': 'var(--local-border-hover)',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&:checked:hover + svg': {
		'--checkbox-background-color': 'var(--local-background-checked-hover)',
		'--checkbox-border-color': 'var(--local-border-checked-hover)',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&:checked + svg': {
		'--checkbox-background-color': 'var(--local-background-checked)',
		'--checkbox-border-color': 'var(--local-border-checked)',
		'--checkbox-tick-color': 'var(--local-tick-checked)',
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors
	'&[data-invalid] + svg': {
		'--checkbox-border-color': 'var(--local-border-invalid)',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&:checked[data-invalid] + svg': {
		'--checkbox-border-color': 'var(--local-border-checked-invalid)',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&:active + svg': {
		'--checkbox-background-color': 'var(--local-background-active)',
		'--checkbox-border-color': 'var(--local-border-active)',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&:checked:active + svg': {
		'--checkbox-background-color': 'var(--local-background-active)',
		'--checkbox-border-color': 'var(--local-border-active)',
		'--checkbox-tick-color': 'var(--local-tick-active)',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&:disabled + svg, &:disabled:hover + svg, &:disabled:focus + svg, &:disabled:active + svg, &:disabled[data-invalid] + svg':
		{
			'--checkbox-background-color': 'var(--local-background-disabled)',
			'--checkbox-border-color': 'var(--local-border-disabled)',
			cursor: 'not-allowed',
			pointerEvents: 'none',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&:disabled:checked + svg': {
		'--checkbox-tick-color': 'var(--local-tick-disabled)',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&:indeterminate + svg': {
		'--checkbox-background-color': 'var(--local-background-checked)',
		'--checkbox-border-color': 'var(--local-border-checked)',
		'--checkbox-tick-color': 'var(--local-tick-checked)',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&:disabled:indeterminate + svg': {
		'--checkbox-background-color': 'var(--local-background-disabled)',
		'--checkbox-border-color': 'var(--local-border-disabled)',
		'--checkbox-tick-color': 'var(--local-tick-disabled)',
	},
	'@media screen and (forced-colors: active)': {
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors
		'& + svg': {
			'--checkbox-background-color': 'Canvas',
			'--checkbox-border-color': 'CanvasText',
			'--checkbox-tick-color': 'CanvasText',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&:checked + svg, &:checked:hover + svg': {
			'--checkbox-background-color': 'Canvas',
			'--checkbox-border-color': 'CanvasText',
			'--checkbox-tick-color': 'CanvasText',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&:focus + svg rect:first-of-type': {
			stroke: 'Highlight',
		},
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-invalid] + svg': {
			'--checkbox-border-color': 'Highlight',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&:checked[data-invalid] + svg': {
			'--checkbox-border-color': 'Highlight',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&:disabled + svg, &:disabled:hover + svg, &:disabled:focus + svg, &:disabled:active + svg, &:disabled[data-invalid] + svg':
			{
				'--checkbox-background-color': 'Canvas',
				'--checkbox-border-color': 'GrayText',
				'--checkbox-tick-color': 'GrayText',
			},
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
const Checkbox = memo(
	forwardRef(function Checkbox(props: CheckboxProps, ref: Ref<HTMLInputElement>) {
		const {
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
		} = props;

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
				label={label as string}
				id={rest.id ? `${rest.id}-label` : undefined}
				testId={testId && `${testId}--checkbox-label`}
				// Currently the rule hasn't been updated to enable "allowed" dynamic pass-throughs.
				// When there is more usage of this pattern we'll update the lint rule.
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
				xcss={xcss}
			>
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
					css={checkboxStyles}
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
