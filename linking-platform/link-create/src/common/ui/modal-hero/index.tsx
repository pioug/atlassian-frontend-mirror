import React, { Fragment } from 'react';

import { Stack } from '@atlaskit/primitives';

import { ErrorBoundary } from '../../../common/ui/error-boundary';

const ErrorComponent = () => {
	// when there's an error, render nothing but report the issue
	return <Fragment>{null}</Fragment>;
};

export const ModalHero = ({ hero }: { hero?: React.ReactNode }) => {
	if (!hero) {
		return null;
	}

	return (
		<Stack testId="link-create-modal-hero">
			<ErrorBoundary errorComponent={<ErrorComponent />}>{hero}</ErrorBoundary>
		</Stack>
	);
};
