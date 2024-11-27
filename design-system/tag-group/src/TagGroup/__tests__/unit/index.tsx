import React from 'react';

import { render, screen } from '@testing-library/react';

import Tag from '@atlaskit/tag';

import TagGroup from '../../index';

describe('TagGroup', () => {
	it('should export a base component', () => {
		render(
			<TagGroup>
				<Tag text="test" />
			</TagGroup>,
		);
		expect(screen.getByText('test')).toBeInTheDocument();
	});

	it('should render supplied tags', () => {
		const tags = ['Candy canes', 'Tiramisu', 'Gummi bears'];
		render(
			<TagGroup>
				{tags.map((tagName) => (
					<Tag key={tagName} text={tagName} />
				))}
			</TagGroup>,
		);
		tags.forEach((tagText) => {
			expect(screen.getByText(tagText)).toBeInTheDocument();
		});
	});

	it('should justify to the start when alignment not set', () => {
		render(
			<TagGroup>
				<Tag text="test" />
			</TagGroup>,
		);
		const tagGroup = screen.getByRole('group');
		expect(tagGroup).toHaveStyle('justify-content: flex-start');
	});

	it('should justify to the end when alignment is set to end', () => {
		render(
			<TagGroup alignment="end">
				<Tag text="test" />
			</TagGroup>,
		);
		const tagGroup = screen.getByRole('group');
		expect(tagGroup).toHaveStyle(`justify-content: flex-end`);
	});
	it('should should have attribute role="group"', () => {
		render(
			<TagGroup label="test tags" alignment="end">
				<Tag text="test" />
				<Tag text="test" />
				<Tag text="test" />
			</TagGroup>,
		);
		expect(screen.getByRole('group')).toBeInTheDocument();
	});
	it('should add label prop value to an aria-label attribute', () => {
		render(
			<TagGroup label="test tags" alignment="end">
				<Tag text="test" />
				<Tag text="test" />
				<Tag text="test" />
			</TagGroup>,
		);
		expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'test tags');
	});
});
