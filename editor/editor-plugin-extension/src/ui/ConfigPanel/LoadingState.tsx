/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { IntlShape, injectIntl } from 'react-intl-next';
import type { LoadingComponentProps } from 'react-loadable';

import { messages } from '@atlaskit/editor-common/extensions';
import SectionMessage from '@atlaskit/section-message';
import Spinner from '@atlaskit/spinner';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

const spinnerWrapperStyles = css({
	display: 'flex',
	justifyContent: 'center',
	marginTop: token('space.800', '64px'),
});

const errorWrapperStyles = css({
	marginTop: token('space.400', '32px'), // Add some padding to the top to make sure we place this below the offline status banner
});

const LoadingStateWithErrorHandling = injectIntl(
	(props: Partial<LoadingComponentProps> & { intl: IntlShape }) => {
		if (props.error) {
			return (
				<div css={errorWrapperStyles} data-testid="ConfigPanelLoadingError">
					<SectionMessage appearance="error">
						{props.intl.formatMessage(messages.panelLoadingError)}
					</SectionMessage>
				</div>
			);
		}
		return (
			<div css={spinnerWrapperStyles} data-testid="ConfigPanelLoading">
				<Spinner size="small" interactionName="config-panel-spinner" />
			</div>
		);
	},
);

const LoadingStateWithoutErrorHandling = () => (
	<div css={spinnerWrapperStyles} data-testid="ConfigPanelLoading">
		<Spinner size="small" interactionName="config-panel-spinner" />
	</div>
);

const LoadingState = (props: Partial<LoadingComponentProps>) =>
	editorExperiment('platform_editor_offline_editing_web', true)
		? LoadingStateWithErrorHandling(props)
		: LoadingStateWithoutErrorHandling();

export default LoadingState;
