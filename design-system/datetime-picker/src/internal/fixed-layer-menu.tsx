/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { components, type MenuProps, type OptionType } from '@atlaskit/select';

import FixedLayer from '../internal/fixed-layer';

/**
 * This is the fixed layer menu used in the time picker.
 */
export const FixedLayerMenu = ({ selectProps, ...rest }: MenuProps<OptionType>) => (
	<FixedLayer
		inputValue={selectProps.inputValue}
		containerRef={selectProps.fixedLayerRef}
		content={
			<components.Menu {...(rest as MenuProps<OptionType>)} menuShouldScrollIntoView={false} />
		}
		testId={selectProps.testId}
	/>
);
