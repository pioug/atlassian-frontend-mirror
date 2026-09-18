import React from 'react';

import { axe } from '@af/accessibility-testing';
import Avatar from '@atlaskit/avatar/avatar';
import { render } from '@atlassian/testing-library';

import { default as RemovableTag } from '../../internal/removable';
import { default as Tag } from '../../internal/simple';

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
				<Tag text="Testing" elemBefore={<Avatar borderColor="transparent" size="xxsmall" />} />,
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
					elemBefore={<Avatar borderColor="transparent" size="xxsmall" />}
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
