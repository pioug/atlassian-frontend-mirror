import React from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import AddIcon from '../../../../../core/add';
import IconTile from '../../index';

const testId = 'icon-tile-test';
// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('IconTile', () => {
	it('should render testId', () => {
		render(<IconTile icon={AddIcon} label="Add" appearance="blue" testId={testId} />);
		expect(screen.getAllByTestId(testId)).toHaveLength(1);
	});
});
