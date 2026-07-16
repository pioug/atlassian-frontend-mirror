import React from 'react';

import { Text } from '@atlaskit/primitives/compiled';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { screen } from '@atlassian/testing-library/screen';
import { render as rtlRender } from '@atlassian/testing-library/testing-library/react';

import TagNew, { colorMapping } from '../../../tag-new';
import SimpleTag from '../../../tag/simple-tag';

const render = (component: React.ReactNode) => {
	return rtlRender(<React.StrictMode>{component}</React.StrictMode>);
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
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

		it('should normalize string arrays into a single rendered string', () => {
			render(<TagNew text={['hello', ' ', 'world']} testId={testId} isRemovable={false} />);
			const tag = screen.getByTestId(testId);
			expect(tag).toHaveTextContent('hello world');
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
					elemBefore={<Text testId="before-element">🚀</Text>}
					testId={testId}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			expect(screen.getByTestId('before-element')).toBeInTheDocument();
		});
	});

	describe('maxWidth prop', () => {
		it('should apply custom maxWidth as string', () => {
			render(<TagNew text="Custom width tag" maxWidth="200px" testId={testId} />);
			const tag = screen.getByTestId(testId);
			expect(tag).toHaveStyle({ maxWidth: '200px' });
		});

		it('should apply custom maxWidth as number', () => {
			render(<TagNew text="Custom width tag" maxWidth={300} testId={testId} />);
			const tag = screen.getByTestId(testId);
			expect(tag).toHaveStyle({ maxWidth: '300px' });
		});

		it('should not apply inline style when maxWidth is not provided', () => {
			render(<TagNew text="Default width tag" testId={testId} isRemovable={false} />);
			const tag = screen.getByTestId(testId);
			expect(tag).not.toHaveAttribute('style');
		});
	});

	describe('trailingMetric', () => {
		it('should render a badge when trailingMetric is provided', () => {
			render(<TagNew text="Comments" trailingMetric={24} testId={testId} isRemovable={false} />);
			expect(screen.getByTestId(`${testId}--metric`)).toBeInTheDocument();
			expect(screen.getByText('24')).toBeInTheDocument();
		});

		it('should render a badge with string trailingMetric', () => {
			render(<TagNew text="Updates" trailingMetric="99+" testId={testId} isRemovable={false} />);
			expect(screen.getByTestId(`${testId}--metric`)).toBeInTheDocument();
			expect(screen.getByText('99+')).toBeInTheDocument();
		});

		it('should not render a badge when trailingMetric is undefined', () => {
			render(
				<TagNew text="No Metric" trailingMetric={undefined} testId={testId} isRemovable={false} />,
			);
			expect(screen.queryByTestId(`${testId}--metric`)).not.toBeInTheDocument();
		});

		it('should not render a badge when trailingMetric is an empty string', () => {
			render(<TagNew text="No Metric" trailingMetric="" testId={testId} isRemovable={false} />);
			expect(screen.queryByTestId(`${testId}--metric`)).not.toBeInTheDocument();
		});

		it('should render a badge alongside the remove button when removable', () => {
			render(
				<TagNew
					text="Removable with metric"
					trailingMetric={5}
					testId={testId}
					removeButtonLabel="Remove"
				/>,
			);
			expect(screen.getByTestId(`${testId}--metric`)).toBeInTheDocument();
			expect(screen.getByText('5')).toBeInTheDocument();
			expect(screen.getByTestId(`close-button-${testId}`)).toBeInTheDocument();
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

describe('swatch a11y attributes', () => {
	const testId = 'test-tag-swatch';

	ffTest.on(
		'parent-field-switcher-missing-info-image-text',
		'applies aria-label and role to swatch when feature gate is on',
		() => {
			it('should set aria-label and role on the swatch span', () => {
				render(
					<TagNew
						aria-label="Epic"
						color="purple"
						isRemovable={false}
						swatchBefore
						swatchBeforeLabel="Epic"
						swatchBeforeRole="img"
						testId={testId}
						text="Epic Tag"
					/>,
				);
				const swatch = screen.getByRole('img', { name: 'Epic' });
				expect(swatch).toBeInTheDocument();
			});
		},
	);
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
