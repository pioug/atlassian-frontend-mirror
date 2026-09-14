import React from 'react';

import { render, screen } from '@atlassian/testing-library';

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
