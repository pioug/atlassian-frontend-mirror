/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */

import React from 'react';

import { render as rtlRender, screen } from '@atlassian/testing-library';

import { appearanceMapping } from '../../appearance-mapping';
import BadgeNew from '../../badge-new';

const render = (component: React.ReactNode) => {
	return rtlRender(<React.StrictMode>{component}</React.StrictMode>);
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('BadgeNew component (UI uplift)', () => {
	const testId = 'test-badge-new';

	describe('new appearance names', () => {
		it('should render with "success" appearance', () => {
			render(
				<BadgeNew appearance="success" testId={testId}>
					{5}
				</BadgeNew>,
			);
			const badge = screen.getByTestId(testId);
			expect(badge).toBeInTheDocument();
			expect(badge).toHaveTextContent('5');
		});

		it('should render with "danger" appearance', () => {
			render(
				<BadgeNew appearance="danger" testId={testId}>
					{10}
				</BadgeNew>,
			);
			const badge = screen.getByTestId(testId);
			expect(badge).toBeInTheDocument();
			expect(badge).toHaveTextContent('10');
		});

		it('should render with "neutral" appearance (default)', () => {
			render(
				<BadgeNew appearance="neutral" testId={testId}>
					{15}
				</BadgeNew>,
			);
			const badge = screen.getByTestId(testId);
			expect(badge).toBeInTheDocument();
			expect(badge).toHaveTextContent('15');
		});

		it('should render with "information" appearance', () => {
			render(
				<BadgeNew appearance="information" testId={testId}>
					{20}
				</BadgeNew>,
			);
			const badge = screen.getByTestId(testId);
			expect(badge).toBeInTheDocument();
			expect(badge).toHaveTextContent('20');
		});

		it('should render with "inverse" appearance', () => {
			render(
				<BadgeNew appearance="inverse" testId={testId}>
					{25}
				</BadgeNew>,
			);
			const badge = screen.getByTestId(testId);
			expect(badge).toBeInTheDocument();
			expect(badge).toHaveTextContent('25');
		});

		it('should render with "warning" appearance', () => {
			render(
				<BadgeNew appearance="warning" testId={testId}>
					{30}
				</BadgeNew>,
			);
			const badge = screen.getByTestId(testId);
			expect(badge).toBeInTheDocument();
			expect(badge).toHaveTextContent('30');
		});

		it('should render with "discovery" appearance', () => {
			render(
				<BadgeNew appearance="discovery" testId={testId}>
					{35}
				</BadgeNew>,
			);
			const badge = screen.getByTestId(testId);
			expect(badge).toBeInTheDocument();
			expect(badge).toHaveTextContent('35');
		});

		it('should default to "neutral" appearance', () => {
			render(<BadgeNew testId={testId}>{30}</BadgeNew>);
			const badge = screen.getByTestId(testId);
			expect(badge).toBeInTheDocument();
			expect(badge).toHaveTextContent('30');
		});
	});

	describe('appearance mapping (old to new)', () => {
		it('should map "added" to "success"', () => {
			expect(appearanceMapping.added).toBe('success');
		});

		it('should map "removed" to "danger"', () => {
			expect(appearanceMapping.removed).toBe('danger');
		});

		it('should map "default" to "neutral"', () => {
			expect(appearanceMapping.default).toBe('neutral');
		});

		it('should map "primary" to "information"', () => {
			expect(appearanceMapping.primary).toBe('information');
		});

		it('should map "primaryInverted" to "inverse"', () => {
			expect(appearanceMapping.primaryInverted).toBe('inverse');
		});

		it('should map "important" to "danger"', () => {
			expect(appearanceMapping.important).toBe('danger');
		});
	});

	describe('basic functionality', () => {
		it('should render 0 by default', () => {
			render(<BadgeNew testId={testId} />);
			expect(screen.getByText('0')).toBeInTheDocument();
		});

		it('should render numeric children', () => {
			render(<BadgeNew testId={testId}>{42}</BadgeNew>);
			expect(screen.getByText('42')).toBeInTheDocument();
		});

		it('should have max=99 by default', () => {
			render(<BadgeNew testId={testId}>{100}</BadgeNew>);
			expect(screen.getByText('99+')).toBeInTheDocument();
		});

		it('should respect custom max value', () => {
			render(
				<BadgeNew testId={testId} max={999}>
					{1000}
				</BadgeNew>,
			);
			expect(screen.getByText('999+')).toBeInTheDocument();
		});

		it('should render original value when max is false', () => {
			render(
				<BadgeNew testId={testId} max={false}>
					{5000}
				</BadgeNew>,
			);
			expect(screen.getByText('5000')).toBeInTheDocument();
		});
	});

	describe('custom styles via style prop', () => {
		it('should apply custom backgroundColor from style prop', () => {
			render(
				<BadgeNew testId={testId} style={{ backgroundColor: '#FF5630' }}>
					{10}
				</BadgeNew>,
			);
			const badge = screen.getByTestId(testId);
			expect(badge).toHaveStyle({ background: '#FF5630' });
		});

		it('should apply custom color from style prop', () => {
			render(
				<BadgeNew testId={testId} style={{ color: '#FFFFFF' }}>
					{10}
				</BadgeNew>,
			);
			const badge = screen.getByTestId(testId);
			expect(badge).toHaveStyle({ color: '#FFFFFF' });
		});

		it('should apply both custom backgroundColor and color', () => {
			render(
				<BadgeNew testId={testId} style={{ backgroundColor: '#FF5630', color: '#FFFFFF' }}>
					{10}
				</BadgeNew>,
			);
			const badge = screen.getByTestId(testId);
			expect(badge).toHaveStyle({
				background: '#FF5630',
				color: '#FFFFFF',
			});
		});

		it('should override appearance styles with custom backgroundColor', () => {
			render(
				<BadgeNew
					testId={testId}
					appearance="success"
					style={{ backgroundColor: 'rgb(255, 86, 48)' }}
				>
					{10}
				</BadgeNew>,
			);
			const badge = screen.getByTestId(testId);
			expect(badge).toHaveStyle({ background: 'rgb(255, 86, 48)' });
		});

		it('should override appearance styles with custom color', () => {
			render(
				<BadgeNew testId={testId} appearance="danger" style={{ color: 'rgb(0, 0, 0)' }}>
					{10}
				</BadgeNew>,
			);
			const badge = screen.getByTestId(testId);
			expect(badge).toHaveStyle({ color: 'rgb(0, 0, 0)' });
		});
	});
});
