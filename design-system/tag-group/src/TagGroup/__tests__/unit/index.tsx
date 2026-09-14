import React from 'react';

import { render, screen } from '@testing-library/react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { useExitingPersistence } from '@atlaskit/motion/exiting-persistence/use-exiting-persistence';
import Tag from '@atlaskit/tag/removable-tag';

import TagGroup from '../../index';

function MotionBoundaryProbe(): JSX.Element {
	const { isInsideExitingPersistence } = useExitingPersistence();

	return (
		<span>{isInsideExitingPersistence ? 'inside motion boundary' : 'outside motion boundary'}</span>
	);
}

Object.defineProperty(MotionBoundaryProbe, Symbol.for('@atlaskit/tag/motion-capable'), {
	value: true,
});

function CustomChildMotionBoundaryProbe(): JSX.Element {
	const { isInsideExitingPersistence } = useExitingPersistence();

	return <span>{isInsideExitingPersistence ? 'custom child inside' : 'custom child outside'}</span>;
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('TagGroup', () => {
	it('should export a base component', () => {
		failGate('platform-dst-lozenge-tag-badge-visual-uplifts');
		render(
			<TagGroup>
				<Tag text="test" />
			</TagGroup>,
		);
		expect(screen.getByText('test')).toBeInTheDocument();
	});

	it('should render supplied tags', () => {
		failGate('platform-dst-lozenge-tag-badge-visual-uplifts');
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

	it('should not add a motion boundary when only the visual feature gate is enabled', () => {
		passGate('platform-dst-lozenge-tag-badge-visual-uplifts');
		failGate('platform-dst-motion-uplift-labels');

		render(
			<TagGroup>
				<MotionBoundaryProbe />
			</TagGroup>,
		);

		expect(screen.getByText('outside motion boundary')).toBeInTheDocument();
	});

	it('should add a motion boundary when both tag feature gates are enabled', () => {
		passGate('platform-dst-lozenge-tag-badge-visual-uplifts');
		passGate('platform-dst-motion-uplift-labels');

		render(
			<TagGroup>
				<MotionBoundaryProbe />
			</TagGroup>,
		);

		expect(screen.getByText('inside motion boundary')).toBeInTheDocument();
	});

	it('should not add a motion boundary to custom children when both gates are enabled', () => {
		passGate('platform-dst-lozenge-tag-badge-visual-uplifts');
		passGate('platform-dst-motion-uplift-labels');

		render(
			<TagGroup>
				<CustomChildMotionBoundaryProbe />
			</TagGroup>,
		);

		expect(screen.getByText('custom child outside')).toBeInTheDocument();
	});

	it('should justify to the start when alignment not set', () => {
		failGate('platform-dst-lozenge-tag-badge-visual-uplifts');
		render(
			<TagGroup>
				<Tag text="test" />
			</TagGroup>,
		);
		const tagGroup = screen.getByRole('group');
		expect(tagGroup).toHaveStyle('justify-content: flex-start');
	});

	it('should justify to the end when alignment is set to end', () => {
		failGate('platform-dst-lozenge-tag-badge-visual-uplifts');
		render(
			<TagGroup alignment="end">
				<Tag text="test" />
			</TagGroup>,
		);
		const tagGroup = screen.getByRole('group');
		expect(tagGroup).toHaveStyle(`justify-content: flex-end`);
	});
	it('should should have attribute role="group"', () => {
		failGate('platform-dst-lozenge-tag-badge-visual-uplifts');
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
		failGate('platform-dst-lozenge-tag-badge-visual-uplifts');
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
