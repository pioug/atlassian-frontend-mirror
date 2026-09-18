import React from 'react';

import { screen } from '@testing-library/react';

import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

import Status from '../../../../react/nodes/status';

describe('Status Component', () => {
	it('Accessibility attributes', () => {
		renderWithIntl(<Status text="In Progress" color={'blue'} localId={'123'} />);
		// The status text will be emphasized
		expect(screen.queryByRole('emphasis')).toBeInTheDocument();
	});
});
