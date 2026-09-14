import { render, screen } from '@testing-library/react';
import React from 'react';
import { getPopupStyles } from '../../../components/styles';
import { PopupUserPickerWithoutAnalytics } from '../../../components/PopupUserPicker';
import { type PopupUserPickerProps } from '../../../types';

jest.mock('../../../components/styles', () => ({
	getPopupStyles: jest.fn(),
}));

jest.mock('../../../components/BaseUserPicker', () => ({
	BaseUserPickerWithoutAnalytics: (props: any) => {
		const modifiers = props.pickerProps.popperProps.modifiers;
		const preventOverflow = modifiers.find(
			({ name }: { name: string }) => name === 'preventOverflow',
		);
		const offset = modifiers.find(({ name }: { name: string }) => name === 'offset');
		const flip = modifiers.find(({ name }: { name: string }) => name === 'flip');

		return (
			<div
				data-testid="popup-picker-config"
				data-boundary={
					typeof preventOverflow.options.boundary === 'function'
						? 'custom'
						: preventOverflow.options.boundary
				}
				data-flip={String(flip.enabled)}
				data-has-popup-control={String(typeof props.components.Control === 'function')}
				data-offset={JSON.stringify(offset.options.offset)}
				data-popup-title={props.pickerProps.popupTitle ?? ''}
				data-root-boundary={
					typeof preventOverflow.options.rootBoundary === 'function'
						? 'custom'
						: preventOverflow.options.rootBoundary
				}
				data-target-type={typeof props.pickerProps.target}
				data-width={String(props.width)}
			/>
		);
	},
}));

const defaultProps: Partial<PopupUserPickerProps> = {
	boundariesElement: 'viewport',
	width: 300,
	isMulti: false,
	offset: [0, 0],
	placement: 'auto',
	rootBoundary: 'viewport',
	shouldFlip: true,
};

describe('PopupUserPicker', () => {
	const renderPopupUserPicker = (props: Partial<PopupUserPickerProps> = {}) =>
		render(<PopupUserPickerWithoutAnalytics fieldId="test" target={jest.fn()} {...props} />);

	const getConfig = () => screen.getByTestId('popup-picker-config');

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('uses PopupSelect styles with the default width', async () => {
		renderPopupUserPicker();

		expect(getPopupStyles).toHaveBeenCalledWith(300, false, undefined, false);
		expect(getConfig()).toHaveAttribute('data-width', '300');
		await expect(document.body).toBeAccessible();
	});

	it('passes a custom width to PopupSelect styles', () => {
		renderPopupUserPicker({ width: 500 });

		expect(getPopupStyles).toHaveBeenCalledWith(500, false, undefined, false);
		expect(getConfig()).toHaveAttribute('data-width', '500');
	});

	it('allows callers to override popup styles', () => {
		const mockStyles = {
			control: (style: Record<string, unknown>) => ({ ...style, borderRadius: 8 }),
		};
		renderPopupUserPicker({ styles: mockStyles as any });

		expect(getPopupStyles).toHaveBeenCalledWith(300, false, mockStyles, false);
	});

	it('adds a custom Control when popupTitle is supplied', () => {
		renderPopupUserPicker({ popupTitle: 'title' });

		expect(getConfig()).toHaveAttribute('data-has-popup-control', 'true');
		expect(getConfig()).toHaveAttribute('data-popup-title', 'title');
	});

	it('does not add a custom Control when popupTitle is absent', () => {
		renderPopupUserPicker();

		expect(getConfig()).toHaveAttribute('data-has-popup-control', 'false');
	});

	describe('popup picker properties', () => {
		it('passes the target into the popup picker properties', () => {
			renderPopupUserPicker({ ...defaultProps });

			expect(getConfig()).toHaveAttribute('data-target-type', 'function');
		});

		it('uses viewport boundaries by default', () => {
			renderPopupUserPicker({ ...defaultProps });

			expect(getConfig()).toHaveAttribute('data-boundary', 'viewport');
			expect(getConfig()).toHaveAttribute('data-root-boundary', 'viewport');
		});

		it('passes custom boundaries through to the popup picker', () => {
			renderPopupUserPicker({
				...defaultProps,
				boundariesElement: jest.fn() as any,
				rootBoundary: jest.fn() as any,
			});

			expect(getConfig()).toHaveAttribute('data-boundary', 'custom');
			expect(getConfig()).toHaveAttribute('data-root-boundary', 'custom');
		});

		it('uses a zero offset by default', () => {
			renderPopupUserPicker({ ...defaultProps });

			expect(getConfig()).toHaveAttribute('data-offset', '[0,0]');
		});

		it('passes a custom offset through to the popup picker', () => {
			renderPopupUserPicker({ ...defaultProps, offset: [1, 1] });

			expect(getConfig()).toHaveAttribute('data-offset', '[1,1]');
		});

		it('enables flipping by default', () => {
			renderPopupUserPicker({ ...defaultProps });

			expect(getConfig()).toHaveAttribute('data-flip', 'true');
		});

		it('disables flipping when shouldFlip is false', () => {
			renderPopupUserPicker({ ...defaultProps, shouldFlip: false });

			expect(getConfig()).toHaveAttribute('data-flip', 'false');
		});

		it('passes popupTitle into the popup picker properties', () => {
			renderPopupUserPicker({ ...defaultProps, popupTitle: 'Test' });

			expect(getConfig()).toHaveAttribute('data-popup-title', 'Test');
		});
	});
});
