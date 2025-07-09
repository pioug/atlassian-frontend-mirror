/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { typeAheadListMessages as messages } from '@atlaskit/editor-common/type-ahead';

import { EmptyState } from './EmptyState';
import { GenericErrorSVG } from './GenericErrorSVG';

const minHeightComponentStyles = css({
	display: 'flex',
	alignItems: 'stretch',
	justifyContent: 'center',
	minHeight: '290px',
});

export const TypeAheadErrorFallback = () => {
	const intl = useIntl();
	const header = intl.formatMessage(messages.typeAheadErrorFallbackHeading);
	const description = intl.formatMessage(messages.typeAheadErrorFallbackDesc);

	return (
		<div data-testid="typeahead-error-boundary-ui" css={minHeightComponentStyles}>
			<EmptyState
				header={header}
				renderImage={() => <GenericErrorSVG />}
				description={description}
			/>
		</div>
	);
};
