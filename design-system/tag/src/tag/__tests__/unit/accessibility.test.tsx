import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';
import Avatar from '@atlaskit/avatar';

import RemovableTag from '../../removable-tag';
import Tag from '../../simple-tag';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Tag component accessibility', () => {
	describe('Simple Tag', () => {
		it('should not fail an aXe audit', async () => {
			const { container } = render(<Tag text="Testing" />);
			await axe(container);
		});

		it('should not fail an aXe audit when containing an href', async () => {
			const { container } = render(<Tag text="Testing" href="/test" />);
			await axe(container);
		});

		it('should not fail an aXe audit when containing an elemBefore', async () => {
			const { container } = render(
				<Tag text="Testing" elemBefore={<Avatar borderColor="transparent" size="xsmall" />} />,
			);

			await axe(container);
		});
	});

	describe('Removable Tag', () => {
		it('should not fail an aXe audit', async () => {
			const { container } = render(<RemovableTag text="Testing" removeButtonLabel="Remove" />);
			await axe(container);
		});

		it('should not fail an aXe audit when containing an href', async () => {
			const { container } = render(
				<RemovableTag text="Testing" removeButtonLabel="Remove" href="/test" />,
			);
			await axe(container);
		});

		it('should not fail an aXe audit when containing an elemBefore', async () => {
			const { container } = render(
				<RemovableTag
					text="Testing"
					removeButtonLabel="Remove"
					elemBefore={<Avatar borderColor="transparent" size="xsmall" />}
				/>,
			);

			await axe(container);
		});

		it('should not fail an aXe audit when containing removal event handlers', async () => {
			const { container } = render(
				<RemovableTag
					text="Testing"
					removeButtonLabel="Remove"
					onBeforeRemoveAction={() => true}
					onAfterRemoveAction={() => true}
				/>,
			);

			await axe(container);
		});
	});
});
