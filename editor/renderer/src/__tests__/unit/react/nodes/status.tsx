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

				// The status will not be a presentation element, and will have additional hidden text
				// for screen readers
				expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
				expect(screen.queryByText('status:')).toBeInTheDocument();
			},
			() => {
				renderWithIntl(<Status text="In Progress" color={'blue'} localId={'123'} />);

				// The status will be a presentation element, without additional hidden text
				expect(screen.queryByRole('group')).not.toBeInTheDocument();
				expect(screen.queryByRole('presentation')).toBeInTheDocument();
				expect(screen.queryByText('status')).not.toBeInTheDocument();
			},
		);
	});
});
