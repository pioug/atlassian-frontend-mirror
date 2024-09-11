import React from 'react';
import ExpandWithInt from '../../../ui/Expand';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

describe('Expand', () => {
	it('should render with a tooltip in web', () => {
		const { queryByTestId } = renderWithIntl(
			<ExpandWithInt
				title={'Expand test title'}
				nodeType={'expand'}
				children={<p>Text inside expand</p>}
				rendererAppearance={'full-page'}
			/>,
		);

		expect(queryByTestId('tooltip--container')).toBeInTheDocument();
	});
});
