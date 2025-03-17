/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

const spinnerWrapperStyles = css({
	display: 'flex',
	justifyContent: 'center',
	marginTop: token('space.800', '64px'),
});

const LoadingState = () => (
	<div css={spinnerWrapperStyles} data-testid="ConfigPanelLoading">
		<Spinner size="small" interactionName="config-panel-spinner" />
	</div>
);

export default LoadingState;
