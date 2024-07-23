/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import React, { useCallback, useMemo } from 'react';
import { CheckboxField } from '@atlaskit/form';
import { Checkbox } from '@atlaskit/checkbox';
import { type ChangeParams, excludeStyles, handleOnChange } from '../../utils';

type Props<T extends object> = {
	defaultValue?: boolean;
	exclude?: boolean;
	label?: string;
	name: string;
	onChange: (template: T) => void;
	propName: keyof T;
	template: T;
	tooltipMessage?: string;
};
const CheckboxOption = <T extends object>({
	defaultValue = false,
	exclude,
	label,
	name,
	onChange,
	propName,
	template,
}: Props<T>) => {
	const styles = useMemo(() => (exclude ? [excludeStyles] : []), [exclude]);
	const handleOnCheckboxChange = useCallback(
		<T extends object>(...params: ChangeParams<T>) =>
			(e: React.SyntheticEvent<HTMLInputElement>) => {
				handleOnChange(...params, e.currentTarget.checked);
			},
		[],
	);
	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<span css={styles}>
			<CheckboxField name={name}>
				{({ fieldProps }) => (
					<Checkbox
						{...fieldProps}
						isChecked={template[propName] !== undefined ? !!template[propName] : defaultValue}
						label={label}
						onChange={handleOnCheckboxChange(onChange, template, propName, defaultValue)}
					/>
				)}
			</CheckboxField>
		</span>
	);
};
export default CheckboxOption;
