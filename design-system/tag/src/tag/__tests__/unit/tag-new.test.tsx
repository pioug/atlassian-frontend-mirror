import React from 'react';

import { render as rtlRender, screen } from '@testing-library/react';

const render = (component: React.ReactNode) => {
	return rtlRender(<React.StrictMode>{component}</React.StrictMode>);
};

import { ffTest } from '@atlassian/feature-flags-test-utils';

import TagNew, { colorMapping } from '../../../tag-new';
import SimpleTag from '../../../tag/simple-tag';

describe('TagNew component (UI uplift)', () => {
	const testId = 'test-tag-new';

	describe('new color names', () => {
		it('should render with "teal" color', () => {
			render(<TagNew color="teal" text="Teal Tag" testId={testId} />);
			const tag = screen.getByTestId(testId);
			expect(tag).toBeInTheDocument();
			expect(tag).toHaveTextContent('Teal Tag');
		});

		it('should default to "gray" color', () => {
			render(<TagNew text="Default Tag" testId={testId} />);
			const tag = screen.getByTestId(testId);
			expect(tag).toBeInTheDocument();
			expect(tag).toHaveTextContent('Default Tag');
		});
	});

	describe('color mapping (old to new)', () => {
		it('should map "standard" to "gray"', () => {
			expect(colorMapping.standard).toBe('gray');
		});

		it('should map "grey" to "gray"', () => {
			expect(colorMapping.grey).toBe('gray');
		});

		it('should map "blueLight" to "blue"', () => {
			expect(colorMapping.blueLight).toBe('blue');
		});
	});

	describe('slots and elements', () => {
		it('should render with elemBefore', () => {
			render(
				<TagNew
					text="Tag with before"
					elemBefore={<span data-testid="before-element">🚀</span>}
					testId={testId}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			expect(screen.getByTestId('before-element')).toBeInTheDocument();
		});
	});

	describe('removable behavior', () => {
		it('should render with remove button by default', () => {
			render(<TagNew text="Removable Tag" removeButtonLabel="Remove" testId={testId} />);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			expect(screen.getByTestId(`close-button-${testId}`)).toBeInTheDocument();
		});

		it('should not render remove button when isRemovable is false', () => {
			render(<TagNew text="Non-removable Tag" isRemovable={false} testId={testId} />);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			expect(screen.queryByTestId(`close-button-${testId}`)).not.toBeInTheDocument();
		});

		it('should render as interactive when href is provided', () => {
			render(
				<TagNew text="Link Tag" testId={testId} href="https://atlassian.com" isRemovable={false} />,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
		});
	});
});

describe('SimpleTag with feature flag', () => {
	const testId = 'test-simple-tag';

	ffTest.off(
		'platform-dst-lozenge-tag-badge-visual-uplifts',
		'uses original SimpleTag implementation when flag is off',
		() => {
			it('should render original SimpleTag component', () => {
				render(<SimpleTag color="blue" text="Original Tag" testId={testId} />);
				const tag = screen.getByTestId(testId);
				expect(tag).toBeInTheDocument();
				expect(tag).toHaveTextContent('Original Tag');
			});
		},
	);

	ffTest.on(
		'platform-dst-lozenge-tag-badge-visual-uplifts',
		'uses TagNew implementation when flag is on',
		() => {
			it('should render TagNew component', () => {
				render(<SimpleTag color="blue" text="New Tag" testId={testId} />);
				const tag = screen.getByTestId(testId);
				expect(tag).toBeInTheDocument();
				expect(tag).toHaveTextContent('New Tag');
			});

			it('should map all color appearances correctly', () => {
				const colors: Array<'standard' | 'blue' | 'red' | 'green' | 'yellow' | 'purple'> = [
					'standard',
					'blue',
					'red',
					'green',
					'yellow',
					'purple',
				];

				colors.forEach((color) => {
					const { unmount } = render(
						<SimpleTag color={color} text={color} testId={`${testId}-${color}`} />,
					);
					expect(screen.getByTestId(`${testId}-${color}`)).toBeInTheDocument();
					unmount();
				});
			});
		},
	);
});
