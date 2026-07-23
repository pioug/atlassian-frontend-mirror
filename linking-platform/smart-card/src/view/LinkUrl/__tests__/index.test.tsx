import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { render, screen } from '@atlassian/testing-library';

import LinkUrl from '../index';
import * as UseLinkWarningModalExports from '../LinkWarningModal/hooks/use-link-warning-modal';
import type { LinkUrlProps } from '../types';

describe('LinkUrl', () => {
	const TestComponent = (props: Partial<LinkUrlProps>) => (
		<LinkUrl href="https://atlassian.com" {...props}>
			My Link
		</LinkUrl>
	);

	const wrapper = ({ children }: { children?: React.ReactNode }) => (
		<SmartCardProvider>{children}</SmartCardProvider>
	);

	const runTest = (wrapper?: React.JSXElementConstructor<{ children: React.ReactNode }>) => {
		describe('isLinkComponent', () => {
			it('should capture and report a11y violations', async () => {
				const { container } = render(<TestComponent isLinkComponent />, { wrapper });
				await expect(container).toBeAccessible();
			});
		});

		describe('checkSafety', () => {
			it('should call onClick when link is safe', async () => {
				const showSafetyWarningModalMock = jest.fn();
				const onClickMock = jest.fn();
				const useLinkWarningModalMock = jest.spyOn(
					UseLinkWarningModalExports,
					'useLinkWarningModal',
				);
				useLinkWarningModalMock.mockImplementation(
					() =>
						({
							isLinkSafe: () => true,
							showSafetyWarningModal: showSafetyWarningModalMock,
						}) as unknown as ReturnType<typeof UseLinkWarningModalExports.useLinkWarningModal>,
				);

				render(<TestComponent isLinkComponent onClick={onClickMock} />, { wrapper });

				screen.getByText('My Link').click();

				expect(onClickMock).toHaveBeenCalled();
				expect(showSafetyWarningModalMock).not.toHaveBeenCalled();
			});

			it('should not call onClick when link is not safe', async () => {
				const showSafetyWarningModalMock = jest.fn();
				const onClickMock = jest.fn();
				const useLinkWarningModalMock = jest.spyOn(
					UseLinkWarningModalExports,
					'useLinkWarningModal',
				);
				useLinkWarningModalMock.mockReturnValue({
					isLinkSafe: () => false,
					showSafetyWarningModal: showSafetyWarningModalMock,
				} as unknown as ReturnType<typeof UseLinkWarningModalExports.useLinkWarningModal>);

				render(<TestComponent isLinkComponent onClick={onClickMock} />, { wrapper });

				screen.getByText('My Link').click();

				expect(onClickMock).not.toHaveBeenCalled();
				expect(showSafetyWarningModalMock).toHaveBeenCalled();
			});

			it('should ignore safety check', async () => {
				const showSafetyWarningModalMock = jest.fn();
				const onClickMock = jest.fn();
				const useLinkWarningModalMock = jest.spyOn(
					UseLinkWarningModalExports,
					'useLinkWarningModal',
				);
				useLinkWarningModalMock.mockReturnValue({
					isLinkSafe: () => false,
					showSafetyWarningModal: showSafetyWarningModalMock,
				} as unknown as ReturnType<typeof UseLinkWarningModalExports.useLinkWarningModal>);

				render(<TestComponent isLinkComponent onClick={onClickMock} checkSafety={false} />, {
					wrapper,
				});

				screen.getByText('My Link').click();

				expect(onClickMock).toHaveBeenCalled();
				expect(showSafetyWarningModalMock).not.toHaveBeenCalled();
			});
		});

		it('should have empty href', () => {
			render(<TestComponent href={undefined} />, { wrapper });

			const link = screen.getByText('My Link');
			expect(link).toHaveAttribute('href', '');
		});
	};

	runTest();

	describe('with SmartLinkProvider', () => {
		runTest(wrapper);
	});
});
