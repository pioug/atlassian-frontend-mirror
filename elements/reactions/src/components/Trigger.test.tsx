import React from 'react';

import { screen, fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { mockReactDomWarningGlobal, renderWithIntl } from '../__tests__/_testing-library';
import { Trigger } from './Trigger';

const mockIcon = <div>CoolIcon</div>;

describe('@atlaskit/reactions/components/Trigger', () => {
	mockReactDomWarningGlobal();

	it('should not have accessibility violations', async () => {
		const { container } = renderWithIntl(<Trigger tooltipContent="" />);
		await expect(container).toBeAccessible();
	});

	it('should render a button', async () => {
		renderWithIntl(<Trigger tooltipContent="" />);
		const btn = await screen.findByTestId('render-trigger-button');
		expect(btn).toBeInTheDocument();
	});

	it('should render "Add a reaction" text when showAddReactionText is true', async () => {
		renderWithIntl(<Trigger tooltipContent="" showAddReactionText />);
		await screen.findByTestId('render-trigger-button');
		const addReactionText = screen.getByText('Add a reaction');
		expect(addReactionText).toBeInTheDocument();
		expect(addReactionText).toHaveCompiledCss('margin-left', 'var(--ds-space-050,4px)');
	});

	it('should not render tooltip when showAddReactionText is true', async () => {
		renderWithIntl(<Trigger tooltipContent="" showAddReactionText />);
		const trigger = await screen.findByTestId('render-trigger-button');
		fireEvent.mouseEnter(trigger);
		await screen.findByTestId('render-trigger-button');
		expect(screen.queryByTestId('render-tooltip-trigger')).not.toBeInTheDocument();
	});

	it('should render tooltip with correct content when showAddReactionText is false', async () => {
		renderWithIntl(<Trigger tooltipContent="test tooltip" />);
		const trigger = await screen.findByTestId('render-trigger-button');
		fireEvent.mouseEnter(trigger);
		const tooltip = await screen.findByTestId('render-tooltip-trigger');
		expect(tooltip).toHaveTextContent('test tooltip');
	});

	it('should render custom text when reactionPickerTriggerText is passed in', async () => {
		renderWithIntl(
			<Trigger tooltipContent="" showAddReactionText reactionPickerTriggerText="Add new" />,
		);
		await screen.findByLabelText('Add reaction');
		const customReactionText = screen.getByText('Add new');
		expect(customReactionText).toBeInTheDocument();
	});

	it('should have miniMode css when miniMode is true', async () => {
		renderWithIntl(<Trigger tooltipContent="" miniMode />);

		const button = await screen.findByTestId('render-trigger-button');
		expect(button).toBeInTheDocument();
	});

	it('should have full width styles on render trigger container when fullWidthSelectorTrayReactionPickerTrigger is true', async () => {
		renderWithIntl(<Trigger tooltipContent="" fullWidthSelectorTrayReactionPickerTrigger />);
		const button = await screen.findByTestId('render-trigger-container');
		expect(button).toBeInTheDocument();
		expect(button).toHaveCompiledCss('width', '100%');
	});

	it('should disable the button when disabled is true', async () => {
		renderWithIntl(<Trigger tooltipContent="" disabled />);
		const btn = await screen.findByRole('button');
		expect(btn).toBeInTheDocument();
		expect(btn).toHaveAttribute('disabled');
	});

	it('should call "onClick" when clicked', async () => {
		const mockOnClick = jest.fn();
		renderWithIntl(<Trigger tooltipContent="" onClick={mockOnClick} />);
		const button = await screen.findByLabelText('Add reaction');
		fireEvent.click(button);
		expect(mockOnClick).toHaveBeenCalled();
	});

	it('should disable button', async () => {
		const mockOnClick = jest.fn();
		renderWithIntl(<Trigger tooltipContent="" disabled onClick={mockOnClick} />);
		fireEvent.click(await screen.findByLabelText('Add reaction'));
		expect(mockOnClick).not.toHaveBeenCalled();
	});

	it('should have opaque css when showOpaqueBackground is true', async () => {
		renderWithIntl(<Trigger tooltipContent="" miniMode={false} showOpaqueBackground />);

		const button = await screen.findByTestId('render-trigger-button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveCompiledCss('background-color', 'var(--ds-surface,#fff)');
	});

	it('should render custom icon if reactionPickerTriggerIcon is passed in', async () => {
		renderWithIntl(<Trigger tooltipContent="" reactionPickerTriggerIcon={mockIcon} />);

		const button = await screen.findByTestId('render-trigger-button');
		expect(button).toBeInTheDocument();
		const customIcon = await screen.findByText('CoolIcon');
		expect(customIcon).toBeInTheDocument();

		const defaultIcon = screen.queryByTestId('emoji-add-icon');
		expect(defaultIcon).not.toBeInTheDocument();
	});

	it('should render default icon reactionPickerTriggerIcon is not passed in', async () => {
		renderWithIntl(<Trigger tooltipContent="" />);

		const button = await screen.findByTestId('render-trigger-button');
		expect(button).toBeInTheDocument();
		const icon = await screen.findByTestId('emoji-add-icon');
		expect(icon).toBeInTheDocument();

		const customIcon = screen.queryByText('CoolIcon');
		expect(customIcon).not.toBeInTheDocument();
	});

	it('should render subtle trigger button', async () => {
		renderWithIntl(<Trigger tooltipContent="" subtleReactionsSummaryAndPicker />);

		const button = await screen.findByTestId('render-trigger-button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveCompiledCss({
			minWidth: '24px',
			borderStyle: 'none',
		});
	});

	it('should use the localized accessible label when tef_fix_a11y_add_reaction_button_language_support is enabled', async () => {
		passGate('tef_fix_a11y_add_reaction_button_language_support');

		render(
			<IntlProvider
				locale="ja"
				messages={{ 'reaction-picker-trigger.add.reaction.message': 'リアクションを追加' }}
			>
				<Trigger tooltipContent="" />
			</IntlProvider>,
		);

		const icon = await screen.findByTestId('emoji-add-icon');
		expect(icon).toHaveAttribute('aria-label', 'リアクションを追加');
		expect(icon).not.toHaveAttribute('lang');
	});

	it('should retain the existing accessible label when tef_fix_a11y_add_reaction_button_language_support is disabled', async () => {
		failGate('tef_fix_a11y_add_reaction_button_language_support');

		renderWithIntl(<Trigger tooltipContent="" />);
		const icon = await screen.findByTestId('emoji-add-icon');
		expect(icon).toHaveAttribute('aria-label', 'Add reaction');
	});
});
