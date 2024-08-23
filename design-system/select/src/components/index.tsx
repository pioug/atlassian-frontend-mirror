/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { components } from 'react-select';

import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import CrossIcon from '@atlaskit/icon/utility/cross';
import { fg } from '@atlaskit/platform-feature-flags';

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
				{fg('platform-component-visual-refresh') ? (
					// eslint-disable-next-line @atlaskit/design-system/ensure-icon-color
					<CrossIcon label="Clear" />
				) : (
					<SelectClearIcon
						label="Clear"
						size="small"
						primaryColor="transparent"
						secondaryColor="inherit"
					/>
				)}
			</div>
		</components.MultiValueRemove>
	);
};

export const IndicatorSeparator = null;
