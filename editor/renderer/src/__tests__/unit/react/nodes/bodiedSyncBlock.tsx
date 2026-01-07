import React from 'react';
import { render } from '@testing-library/react';
import BodiedSyncBlock from '../../../../react/nodes/bodiedSyncBlock';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer - React/Nodes/BodiedSyncBlock', () => {
	it('should wrap content with div-tag', () => {
		const { container } = render(
			<BodiedSyncBlock localId="sample-local-id" resourceId="sample-resource-id">
				<p>test</p>
			</BodiedSyncBlock>,
		);

		expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
	});

	it('should render attributes properly', () => {
		const { container } = render(
			<BodiedSyncBlock localId="sample-local-id" resourceId="sample-resource-id">
				<p>test</p>
			</BodiedSyncBlock>,
		);

		const wrapper = container.firstChild;

		expect(wrapper).toHaveAttribute('data-bodied-sync-block', 'true');
		expect(wrapper).toHaveAttribute('data-local-id', 'sample-local-id');
		expect(wrapper).toHaveAttribute('data-resource-id', 'sample-resource-id');
	});
});
