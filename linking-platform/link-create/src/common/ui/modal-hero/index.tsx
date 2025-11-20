import React, { Fragment } from 'react';

import { Stack } from '@atlaskit/primitives/compiled';

import { ErrorBoundary } from '../../../common/ui/error-boundary';

const ErrorComponent = () => {
	// when there's an error, render nothing but report the issue
	return <Fragment>{null}</Fragment>;
};

type ModalHeroProps = {
	hero?: React.ReactNode;
};

export const ModalHero = ({ hero }: ModalHeroProps): React.JSX.Element | null => {
	if (!hero) {
		return null;
	}

	return (
		<Stack testId="link-create-modal-hero">
			<ErrorBoundary errorComponent={<ErrorComponent />}>{hero}</ErrorBoundary>
		</Stack>
	);
};
