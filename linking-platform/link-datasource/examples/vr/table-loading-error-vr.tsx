import React from 'react';

import { cssMap } from '@compiled/react';

import { Box } from '@atlaskit/primitives/compiled';

import { LoadingError } from '../../src/ui/common/error-state/loading-error';

const styles = cssMap({
	wrapper: {
		width: '400px',
		display: 'flex',
		justifyContent: 'center',
	},
});

export const GenericLoadingErrorVR = () => (
	<Wrapper>
		<LoadingError onRefresh={() => false} />
	</Wrapper>
);

export const GenericLoadingErrorWithoutRefreshVR = () => (
	<Wrapper>
		<LoadingError />
	</Wrapper>
);

export const ConfluenceLoadingErrorVR = () => (
	<Wrapper>
		<LoadingError onRefresh={() => false} url={'https://atlassian.com/wiki/search'} />
	</Wrapper>
);

export const JiraLoadingErrorVR = () => (
	<Wrapper>
		<LoadingError onRefresh={() => false} url={'https://atlassian.com/issues?jql=project%3DTEST'} />
	</Wrapper>
);

const Wrapper = ({ children }: { children: React.ReactNode }) => (
	<Box xcss={styles.wrapper}>{children}</Box>
);
