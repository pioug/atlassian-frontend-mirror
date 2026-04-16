/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl';

import { typeAheadListMessages as messages } from '@atlaskit/editor-common/type-ahead';

import { EmptyState } from './EmptyState';
import { GenericErrorSVG } from './GenericErrorSVG';

const minHeightComponentStyles = css({
	display: 'flex',
	alignItems: 'stretch',
	justifyContent: 'center',
	minHeight: '290px',
});

export const TypeAheadErrorFallback = (): jsx.JSX.Element => {
	const intl = useIntl();
	const header = intl.formatMessage(messages.typeAheadErrorFallbackHeading);
	const description = intl.formatMessage(messages.typeAheadErrorFallbackDesc);

	return (
		<div data-testid="typeahead-error-boundary-ui" css={minHeightComponentStyles}>
			<EmptyState
				header={header}
				// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
				renderImage={() => <GenericErrorSVG />}
				description={description}
			/>
		</div>
	);
};
