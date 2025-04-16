import React from 'react';
import { screen } from '@testing-library/react';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import Status from '../../../../react/nodes/status';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

describe('Status Component', () => {
	describe('Accessibility attributes', () => {
		ffTest(
			'editor_a11y_status_renderer_description',
			() => {
				renderWithIntl(<Status text="In Progress" color={'blue'} localId={'123'} />);

				// The status text will be emphasized
				expect(screen.queryByRole('emphasis')).toBeInTheDocument();
			},
			() => {
				renderWithIntl(<Status text="In Progress" color={'blue'} localId={'123'} />);

				// The status text will not be emphasized
				expect(screen.queryByRole('emphasis')).not.toBeInTheDocument();
			},
		);
	});
});
