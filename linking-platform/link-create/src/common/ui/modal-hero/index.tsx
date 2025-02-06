import React, { Fragment } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import { Stack } from '@atlaskit/primitives/compiled';

import { ErrorBoundary } from '../../../common/ui/error-boundary';

import { ModalHeroOld } from './old';

const ErrorComponent = () => {
	// when there's an error, render nothing but report the issue
	return <Fragment>{null}</Fragment>;
};

type ModalHeroProps = {
	hero?: React.ReactNode;
};

const ModalHeroNew = ({ hero }: ModalHeroProps) => {
	if (!hero) {
		return null;
	}

	return (
		<Stack testId="link-create-modal-hero">
			<ErrorBoundary errorComponent={<ErrorComponent />}>{hero}</ErrorBoundary>
		</Stack>
	);
};

export const ModalHero = (props: ModalHeroProps) => {
	if (fg('platform_bandicoots-link-create-css')) {
		return <ModalHeroNew {...props} />;
	}
	return <ModalHeroOld {...props} />;
};
