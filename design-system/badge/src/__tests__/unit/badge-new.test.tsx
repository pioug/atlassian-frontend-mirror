/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
import React from 'react';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { render as rtlRender, screen } from '@atlassian/testing-library';

import BadgeNew, { appearanceMapping } from '../../badge-new';
import Badge from '../../index';

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

describe('Badge with feature flag', () => {
	const testId = 'test-badge';

	ffTest.off(
		'platform-dst-lozenge-tag-badge-visual-uplifts',
		'uses original Badge implementation when flag is off',
		() => {
			it('should render original Badge component', () => {
				render(
					<Badge appearance="added" testId={testId}>
						{5}
					</Badge>,
				);
				const badge = screen.getByTestId(testId);
				expect(badge).toBeInTheDocument();
				expect(badge).toHaveTextContent('5');
			});

			it('should use Text component wrapper (original)', () => {
				render(
					<Badge appearance="primary" testId={testId}>
						{10}
					</Badge>,
				);
				expect(screen.getByText('10')).toBeInTheDocument();
			});
		},
	);

	ffTest.on(
		'platform-dst-lozenge-tag-badge-visual-uplifts',
		'uses BadgeNew implementation when flag is on',
		() => {
			it('should render BadgeNew component', () => {
				render(
					<Badge appearance="added" testId={testId}>
						{5}
					</Badge>,
				);
				const badge = screen.getByTestId(testId);
				expect(badge).toBeInTheDocument();
				expect(badge).toHaveTextContent('5');
			});

			it('should map all appearances correctly', () => {
				const appearances: Array<
					'added' | 'removed' | 'default' | 'primary' | 'primaryInverted' | 'important'
				> = ['added', 'removed', 'default', 'primary', 'primaryInverted', 'important'];

				appearances.forEach((appearance) => {
					const { unmount } = render(
						<Badge appearance={appearance} testId={`${testId}-${appearance}`}>
							{5}
						</Badge>,
					);
					expect(screen.getByTestId(`${testId}-${appearance}`)).toBeInTheDocument();
					unmount();
				});
			});

			it('should respect max value', () => {
				render(
					<Badge testId={testId} max={50}>
						{100}
					</Badge>,
				);
				expect(screen.getByText('50+')).toBeInTheDocument();
			});
		},
	);
});
