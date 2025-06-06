import React from 'react';

import { render, screen } from '@testing-library/react';

import { AutoUpgradeAvoidDeactivationProps } from './types';

import { AutoUpgradeAvoidDeactivationModal } from './index';

const props: AutoUpgradeAvoidDeactivationProps = {};

describe('AutoUpgradeNotATrial', () => {
	it('should find AutoUpgradeAvoidDeactivationModal', async () => {
		render(<AutoUpgradeAvoidDeactivationModal {...props} />);

		expect(screen.getByText('Take Action to Avoid Deactivation')).toBeTruthy();
	});
});
