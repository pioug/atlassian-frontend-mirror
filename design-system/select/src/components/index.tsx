/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import { components } from 'react-select';
import { type MultiValueRemoveProps } from '../types';

export { ClearIndicator, DropdownIndicator, LoadingIndicator } from './indicators';

const disabledStyles = css({
	display: 'none',
});

const enabledStyles = css({
	display: 'inherit',
});

export const MultiValueRemove = (props: MultiValueRemoveProps<any>) => {
	const { isDisabled } = props.selectProps;

	return (
		<components.MultiValueRemove {...props}>
			<div
				css={isDisabled ? disabledStyles : enabledStyles}
				data-testid={isDisabled ? 'hide-clear-icon' : 'show-clear-icon'}
			>
				<SelectClearIcon
					label="Clear"
					size="small"
					primaryColor="transparent"
					secondaryColor="inherit"
				/>
			</div>
		</components.MultiValueRemove>
	);
};

export const IndicatorSeparator = null;
