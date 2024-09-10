import React from 'react';

import { render, screen } from '@testing-library/react';

import SkeletonItem from '../../../menu-item/skeleton-item';
import Section from '../../section';

describe('<Section />', () => {
	it('should render heading when `title` is passed in', () => {
		render(
			<Section testId="section" title="title">
				<SkeletonItem />
			</Section>,
		);
		expect(screen.getByTestId('section--heading')).toBeInTheDocument();
	});

	it('should pass an id to the section', () => {
		render(
			<Section id="foo" testId="section" title="title">
				<SkeletonItem />
			</Section>,
		);
		expect(screen.queryByTestId('section')?.id).toEqual('foo');
	});

	it('should spread props because confluence relies on this to apply their hacks', () => {
		render(
			<Section id="foo" testId="section" data-hack="hackydoody">
				<SkeletonItem />
			</Section>,
		);

		expect(screen.queryByTestId('section')?.getAttribute('data-hack')).toEqual('hackydoody');
	});

	it('should not render a heading when `title` is not passed in', () => {
		render(
			<Section testId="section">
				<SkeletonItem />
			</Section>,
		);
		expect(screen.queryByTestId('section--heading')).not.toBeInTheDocument();
	});

	it('should give section an aria-label equal to the `title` prop', () => {
		render(
			<>
				<Section testId="section" title="title">
					<SkeletonItem />
				</Section>
				,
			</>,
		);

		expect(screen.getByTestId('section')).toHaveAttribute('aria-label', 'title');
	});
});
