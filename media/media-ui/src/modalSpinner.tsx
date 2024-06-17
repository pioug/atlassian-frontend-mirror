import React from 'react';

import { layers } from '@atlaskit/theme/constants';
import Spinner from '@atlaskit/spinner';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

const overlayZindex = layers.modal() + 10;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Blanket = styled.div({
	position: 'fixed',
	top: 0,
	left: 0,
	bottom: 0,
	right: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: overlayZindex,
});
Blanket.displayName = 'Blanket';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SpinnerWrapper = styled.div({
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
});
SpinnerWrapper.displayName = 'SpinnerWrapper';

interface Props {
	blankedColor?: string;
	invertSpinnerColor?: boolean;
}

const defaultProps: Props = {
	blankedColor: 'none',
	invertSpinnerColor: false,
};

export default ({ blankedColor, invertSpinnerColor }: Props) => (
	<Blanket style={{ backgroundColor: blankedColor || defaultProps.blankedColor }}>
		<SpinnerWrapper>
			<Spinner
				size="large"
				appearance={invertSpinnerColor || defaultProps.invertSpinnerColor ? 'invert' : 'inherit'}
			/>
		</SpinnerWrapper>
	</Blanket>
);
