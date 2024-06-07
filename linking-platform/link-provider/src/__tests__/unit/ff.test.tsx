import React from 'react';
import { render } from '@testing-library/react';
import SmartCardProvider from '../../provider';
import { useFeatureFlag } from '../../ff';

describe('useFeatureFlag()', () => {
	const Component = () => {
		const showHoverPreview = useFeatureFlag('showHoverPreview');

		return <div>{`${showHoverPreview}`}</div>;
	};

	it('should return undefined if provider.featureFlags are not provided', () => {
		const { getByText } = render(
			<SmartCardProvider>
				<Component />
			</SmartCardProvider>,
		);

		expect(getByText('undefined')).toBeInTheDocument();
	});

	it('should return undefined if showHoverPreview is not provided', () => {
		const { getByText } = render(
			<SmartCardProvider featureFlags={{}}>
				<Component />
			</SmartCardProvider>,
		);
		expect(getByText('undefined')).toBeInTheDocument();
	});

	it('should return ff when value is true', () => {
		const { getByText } = render(
			<SmartCardProvider featureFlags={{ showHoverPreview: true }}>
				<Component />
			</SmartCardProvider>,
		);
		expect(getByText('true')).toBeInTheDocument();
	});

	it('should return ff when value is false', () => {
		const { getByText } = render(
			<SmartCardProvider featureFlags={{ showHoverPreview: false }}>
				<Component />
			</SmartCardProvider>,
		);
		expect(getByText('false')).toBeInTheDocument();
	});

	it('should be able to access not defined ff', () => {
		const Component = () => {
			const showHoverPreview = useFeatureFlag('showHoverPreview');

			return <div>{`${showHoverPreview}`}</div>;
		};

		const { getByText } = render(
			<SmartCardProvider
				featureFlags={{
					newFeatureNotYetAdopted: true,
					showHoverPreview: false,
				}}
			>
				<Component />
			</SmartCardProvider>,
		);
		expect(getByText('false')).toBeInTheDocument();
	});
});
