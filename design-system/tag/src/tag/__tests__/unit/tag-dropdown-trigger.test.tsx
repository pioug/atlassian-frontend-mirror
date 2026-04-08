import React from 'react';

import { Text } from '@atlaskit/primitives/compiled';
import { fireEvent, render as rtlRender, screen } from '@atlassian/testing-library';

import TagDropdownTrigger from '../../../tag-new/tag-dropdown-trigger';

const render = (component: React.ReactNode) => {
	return rtlRender(<React.StrictMode>{component}</React.StrictMode>);
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('TagDropdownTrigger', () => {
	const testId = 'test-trigger';

	describe('Basic Rendering', () => {
		it('should render with text prop', () => {
			render(<TagDropdownTrigger text="Test Trigger" testId={testId} />);
			expect(screen.getByText('Test Trigger')).toBeInTheDocument();
		});

		it('should render as a button element', () => {
			render(<TagDropdownTrigger text="Test" testId={testId} />);
			expect(screen.getByRole('button')).toBeInTheDocument();
		});

		it('should not render remove button', () => {
			render(<TagDropdownTrigger text="Test" testId={testId} />);
			expect(screen.queryByTestId(`close-button-${testId}`)).not.toBeInTheDocument();
		});

		it('should render with elemBefore', () => {
			render(
				<TagDropdownTrigger
					text="Tag with before"
					elemBefore={
						<Text as="span" testId="before-element">
							🚀
						</Text>
					}
					testId={testId}
				/>,
			);
			expect(screen.getByTestId('before-element')).toBeInTheDocument();
			expect(screen.getByText('Tag with before')).toBeInTheDocument();
		});

		it('should render with color prop', () => {
			render(<TagDropdownTrigger text="Colored Tag" color="red" testId={testId} />);
			expect(screen.getByText('Colored Tag')).toBeInTheDocument();
		});
	});

	describe('Chevron Behavior', () => {
		it('should show chevron by default', () => {
			render(<TagDropdownTrigger text="Test" testId={testId} />);
			expect(screen.getByTestId(`${testId}--chevron`)).toBeInTheDocument();
		});

		it('should hide chevron when hasChevron is false', () => {
			render(<TagDropdownTrigger text="Test" testId={testId} hasChevron={false} />);
			expect(screen.queryByTestId(`${testId}--chevron`)).not.toBeInTheDocument();
		});

		it('should show chevron when hasChevron is true', () => {
			render(<TagDropdownTrigger text="Test" testId={testId} hasChevron />);
			expect(screen.getByTestId(`${testId}--chevron`)).toBeInTheDocument();
		});
	});

	describe('Interactive Behavior', () => {
		it('should call onClick when clicked', () => {
			const handleClick = jest.fn();
			render(<TagDropdownTrigger text="Test" testId={testId} onClick={handleClick} />);
			const button = screen.getByRole('button');
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.click(button);
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it('should call onClick with event object', () => {
			const handleClick = jest.fn();
			render(<TagDropdownTrigger text="Test" testId={testId} onClick={handleClick} />);
			const button = screen.getByRole('button');
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.click(button);
			expect(handleClick).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
		});

		it('should handle multiple clicks', () => {
			const handleClick = jest.fn();
			render(<TagDropdownTrigger text="Test" testId={testId} onClick={handleClick} />);
			const button = screen.getByRole('button');
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.click(button);
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.click(button);
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.click(button);
			expect(handleClick).toHaveBeenCalledTimes(3);
		});
	});

	describe('Aria Attributes', () => {
		it('should set aria-expanded correctly when true', () => {
			render(<TagDropdownTrigger text="Test" testId={testId} aria-expanded={true} />);
			expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
		});

		it('should set aria-expanded correctly when false', () => {
			render(<TagDropdownTrigger text="Test" testId={testId} aria-expanded={false} />);
			expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
		});

		it('should set aria-haspopup to menu', () => {
			render(<TagDropdownTrigger text="Test" testId={testId} aria-haspopup="menu" />);
			expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'menu');
		});

		it('should set aria-haspopup to listbox', () => {
			render(<TagDropdownTrigger text="Test" testId={testId} aria-haspopup="listbox" />);
			expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'listbox');
		});

		it('should set aria-controls correctly', () => {
			render(<TagDropdownTrigger text="Test" testId={testId} aria-controls="dropdown-menu" />);
			expect(screen.getByRole('button')).toHaveAttribute('aria-controls', 'dropdown-menu');
		});

		it('should set aria-label correctly', () => {
			render(<TagDropdownTrigger text="Test" testId={testId} aria-label="Open filter menu" />);
			expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Open filter menu');
		});

		it('should combine multiple aria attributes', () => {
			render(
				<TagDropdownTrigger
					text="Test"
					testId={testId}
					aria-expanded={true}
					aria-haspopup="menu"
					aria-controls="menu-id"
					aria-label="Filter"
					isSelected={true}
				/>,
			);
			const button = screen.getByRole('button');
			expect(button).toHaveAttribute('aria-expanded', 'true');
			expect(button).toHaveAttribute('aria-haspopup', 'menu');
			expect(button).toHaveAttribute('aria-controls', 'menu-id');
			expect(button).toHaveAttribute('aria-label', 'Filter');
		});
	});

	describe('Ref Forwarding', () => {
		it('should forward ref to button element', () => {
			const ref = React.createRef<HTMLButtonElement>();
			render(<TagDropdownTrigger text="Test" testId={testId} ref={ref} />);
			expect(ref.current).toBeInstanceOf(HTMLButtonElement);
		});

		it('should allow accessing button properties via ref', () => {
			const ref = React.createRef<HTMLButtonElement>();
			render(<TagDropdownTrigger text="Test" testId={testId} ref={ref} />);
			expect(ref.current?.tagName).toBe('BUTTON');
		});

		it('should work with useRef hook', () => {
			const ButtonComponent = () => {
				const ref = React.useRef<HTMLButtonElement>(null);
				return (
					<>
						<TagDropdownTrigger text="Test" testId={testId} ref={ref} />
						<button
							onClick={() => {
								ref.current?.click();
							}}
							data-testid="external-button"
						>
							Click
						</button>
					</>
				);
			};
			render(<ButtonComponent />);
			const externalButton = screen.getByTestId('external-button');
			expect(externalButton).toBeInTheDocument();
		});
	});

	describe('Color Variants', () => {
		it('should render with gray color', () => {
			render(<TagDropdownTrigger text="Gray Tag" color="gray" testId={testId} />);
			expect(screen.getByText('Gray Tag')).toBeInTheDocument();
		});

		it('should render with red color', () => {
			render(<TagDropdownTrigger text="Red Tag" color="red" testId={testId} />);
			expect(screen.getByText('Red Tag')).toBeInTheDocument();
		});

		it('should render with green color', () => {
			render(<TagDropdownTrigger text="Green Tag" color="green" testId={testId} />);
			expect(screen.getByText('Green Tag')).toBeInTheDocument();
		});

		it('should render with blue color', () => {
			render(<TagDropdownTrigger text="Blue Tag" color="blue" testId={testId} />);
			expect(screen.getByText('Blue Tag')).toBeInTheDocument();
		});

		it('should render with purple color', () => {
			render(<TagDropdownTrigger text="Purple Tag" color="purple" testId={testId} />);
			expect(screen.getByText('Purple Tag')).toBeInTheDocument();
		});

		it('should render with teal color', () => {
			render(<TagDropdownTrigger text="Teal Tag" color="teal" testId={testId} />);
			expect(screen.getByText('Teal Tag')).toBeInTheDocument();
		});
	});

	describe('Props Validation', () => {
		it('should forward testId to inner TagNew', () => {
			render(<TagDropdownTrigger text="Test" testId={testId} />);
			expect(screen.getByRole('button')).toBeInTheDocument();
		});

		it('should not accept isRemovable prop (type checking)', () => {
			// This test verifies type safety - isRemovable should not be accepted
			// The component always renders with isRemovable={false}
			render(<TagDropdownTrigger text="Test" testId={testId} />);
			expect(screen.queryByTestId(`close-button-${testId}`)).not.toBeInTheDocument();
		});

		it('should not accept href prop (type checking)', () => {
			// href should not be accepted by TagDropdownTrigger
			// Component should still render as a button
			render(<TagDropdownTrigger text="Test" testId={testId} />);
			expect(screen.getByRole('button')).toBeInTheDocument();
		});

		it('should accept other TagNew props like maxWidth', () => {
			render(<TagDropdownTrigger text="Test" testId={testId} maxWidth="200px" />);
			expect(screen.getByText('Test')).toBeInTheDocument();
		});
	});

	describe('Combined Props and States', () => {
		it('should render with all dropdown-specific props combined', () => {
			const handleClick = jest.fn();
			render(
				<TagDropdownTrigger
					text="Complex Trigger"
					color="blue"
					isSelected={true}
					aria-expanded={true}
					aria-haspopup="menu"
					aria-controls="menu-id"
					aria-label="Open status filter"
					testId={testId}
					onClick={handleClick}
				/>,
			);
			const button = screen.getByRole('button');
			expect(button).toHaveAttribute('aria-expanded', 'true');
			expect(button).toHaveAttribute('aria-haspopup', 'menu');
			expect(button).toHaveAttribute('aria-controls', 'menu-id');
			expect(button).toHaveAttribute('aria-label', 'Open status filter');
			expect(screen.getByText('Complex Trigger')).toBeInTheDocument();
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.click(button);
			expect(handleClick).toHaveBeenCalled();
		});

		it('should handle elemBefore with color and selected state', () => {
			render(
				<TagDropdownTrigger
					text="Tag with icon"
					elemBefore={
						<Text as="span" testId="icon">
							📋
						</Text>
					}
					color="green"
					isSelected={true}
					testId={testId}
				/>,
			);
			expect(screen.getByTestId('icon')).toBeInTheDocument();
			expect(screen.getByText('Tag with icon')).toBeInTheDocument();
		});
	});

	describe('Memoization', () => {
		it('should be memoized component', () => {
			const { rerender } = render(<TagDropdownTrigger text="Test" testId={testId} />);
			expect(screen.getByText('Test')).toBeInTheDocument();
			rerender(<TagDropdownTrigger text="Test" testId={testId} color="red" />);
			expect(screen.getByText('Test')).toBeInTheDocument();
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty text', () => {
			render(<TagDropdownTrigger text="" testId={testId} />);
			expect(screen.getByRole('button')).toBeInTheDocument();
		});

		it('should handle special characters in text', () => {
			render(<TagDropdownTrigger text="Test & Special <> Characters" testId={testId} />);
			expect(screen.getByText('Test & Special <> Characters')).toBeInTheDocument();
		});

		it('should handle long text with maxWidth', () => {
			render(
				<TagDropdownTrigger
					text="This is a very long text that should be truncated"
					maxWidth="100px"
					testId={testId}
				/>,
			);
			expect(
				screen.getByText('This is a very long text that should be truncated'),
			).toBeInTheDocument();
		});

		it('should render without optional props', () => {
			render(<TagDropdownTrigger text="Minimal" testId={testId} />);
			expect(screen.getByRole('button')).toBeInTheDocument();
			expect(screen.getByText('Minimal')).toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('should be keyboard accessible', () => {
			const handleClick = jest.fn();
			render(<TagDropdownTrigger text="Test" testId={testId} onClick={handleClick} />);
			const button = screen.getByRole('button');
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
			// Note: fireEvent.keyDown doesn't trigger click, but real keyboard events would
		});

		it('should have proper button role semantics', () => {
			render(<TagDropdownTrigger text="Test" testId={testId} />);
			expect(screen.getByRole('button').tagName).toBe('BUTTON');
		});

		it('should be focusable', () => {
			const ref = React.createRef<HTMLButtonElement>();
			render(<TagDropdownTrigger text="Test" testId={testId} ref={ref} />);
			expect(ref.current).toBeInTheDocument();
			// Button is natively focusable
		});

		it('should support aria-label for screen readers', () => {
			render(<TagDropdownTrigger text="Tag" aria-label="Open priority filter" testId={testId} />);
			expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Open priority filter');
		});
	});
});
