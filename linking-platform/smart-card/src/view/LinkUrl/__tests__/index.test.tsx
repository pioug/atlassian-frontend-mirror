import React from 'react';

import { render, screen } from '@testing-library/react';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import AKLink from '@atlaskit/link';
import { SmartCardProvider } from '@atlaskit/link-provider';

import LinkUrl from '../index';
import * as UseLinkWarningModalExports from '../LinkWarningModal/hooks/use-link-warning-modal';
import type { LinkUrlProps } from '../types';

jest.mock('@atlaskit/link', () => ({
	__esModule: true,
	default: jest
		.fn()
		.mockImplementation((props) => jest.requireActual('@atlaskit/link').default.render(props)),
}));

jest.mock('@atlaskit/feature-gate-js-client', () => ({
	getExperimentValue: jest.fn(),
	checkGate: jest.fn(),
	initializeCompleted: jest.fn(() => true),
}));

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn().mockReturnValue(false),
}));

const spyOnAtlaskitLink = jest.mocked(AKLink);
const checkGateMock = jest.spyOn(FeatureGates, 'checkGate');

describe('LinkUrl', () => {
	const TestComponent = (props: Partial<LinkUrlProps>) => (
		<LinkUrl href="https://atlassian.com" {...props}>
			My Link
		</LinkUrl>
	);

	const wrapper = ({ children }: { children?: React.ReactNode }) => (
		<SmartCardProvider>{children}</SmartCardProvider>
	);

	beforeEach(() => {
		spyOnAtlaskitLink.mockClear();
		checkGateMock.mockReturnValue(false);
	});

	const runTest = (wrapper?: React.JSXElementConstructor<{ children: React.ReactElement }>) => {
		describe('isLinkComponent', () => {
			it('should capture and report a11y violations', async () => {
				const { container } = render(<TestComponent isLinkComponent />, { wrapper });
				await expect(container).toBeAccessible();
			});

			it('should not call atlaskit Link component', () => {
				render(<TestComponent />, { wrapper });

				expect(spyOnAtlaskitLink).not.toHaveBeenCalled();
			});

			it('should call atlaskit Link component', () => {
				render(<TestComponent isLinkComponent />, { wrapper });
				expect(spyOnAtlaskitLink).toHaveBeenCalled();
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

	describe('with platform_editor_resolve_hyperlinks_killswitch on', () => {
		beforeEach(() => {
			checkGateMock.mockReturnValue(true);
		});
		runTest();

		describe('with SmartLinkProvider', () => {
			runTest(wrapper);
		});
	});
});
