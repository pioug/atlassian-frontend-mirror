import React from 'react';

import { render, screen } from '@testing-library/react';

import AKLink from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import * as UseLinkWarningModalExports from './LinkWarningModal/hooks/use-link-warning-modal';
import type { LinkUrlProps } from './types';

import LinkUrl from './index';

jest.mock('@atlaskit/link', () => ({
	__esModule: true,
	default: jest
		.fn()
		.mockImplementation((props) => jest.requireActual('@atlaskit/link').default.render(props)),
}));

const spyOnAtlaskitLink = jest.mocked(AKLink);

describe('LinkUrl', () => {
	const TestComponent = (props: Partial<LinkUrlProps>) => (
		<LinkUrl href="https://atlassian.com" {...props}>
			My Link
		</LinkUrl>
	);

	beforeEach(() => {
		spyOnAtlaskitLink.mockClear();
	});

	ffTest.both('platform_editor_hyperlink_underline', 'with a11y accessibilty gate', () => {
		it('should capture and report a11y violations', async () => {
			const { container } = render(<TestComponent isLinkComponent />);
			await expect(container).toBeAccessible();
		});

		it('should not call atlaskit Link component', () => {
			render(<TestComponent />);

			expect(spyOnAtlaskitLink).not.toHaveBeenCalled();
		});

		it('should call atlaskit Link component', () => {
			render(<TestComponent isLinkComponent />);

			if (fg('platform_editor_hyperlink_underline')) {
				expect(spyOnAtlaskitLink).toHaveBeenCalled();
			} else {
				expect(spyOnAtlaskitLink).not.toHaveBeenCalled();
			}
		});
	});

	it('should call onClick when link is safe', async () => {
		const showSafetyWarningModalMock = jest.fn();
		const onClickMock = jest.fn();
		const useLinkWarningModalMock = jest.spyOn(UseLinkWarningModalExports, 'useLinkWarningModal');
		useLinkWarningModalMock.mockImplementation(
			() =>
				({
					isLinkSafe: () => true,
					showSafetyWarningModal: showSafetyWarningModalMock,
				}) as unknown as ReturnType<typeof UseLinkWarningModalExports.useLinkWarningModal>,
		);

		render(<TestComponent isLinkComponent onClick={onClickMock} />);

		screen.getByText('My Link').click();

		expect(onClickMock).toHaveBeenCalled();
		expect(showSafetyWarningModalMock).not.toHaveBeenCalled();
	});

	it('should not call onClick when link is not safe', async () => {
		const showSafetyWarningModalMock = jest.fn();
		const onClickMock = jest.fn();
		const useLinkWarningModalMock = jest.spyOn(UseLinkWarningModalExports, 'useLinkWarningModal');
		useLinkWarningModalMock.mockReturnValue({
			isLinkSafe: () => false,
			showSafetyWarningModal: showSafetyWarningModalMock,
		} as unknown as ReturnType<typeof UseLinkWarningModalExports.useLinkWarningModal>);

		render(<TestComponent isLinkComponent onClick={onClickMock} />);

		screen.getByText('My Link').click();

		expect(onClickMock).not.toHaveBeenCalled();
		expect(showSafetyWarningModalMock).toHaveBeenCalled();
	});

	it('should ignore safety check', async () => {
		const showSafetyWarningModalMock = jest.fn();
		const onClickMock = jest.fn();
		const useLinkWarningModalMock = jest.spyOn(UseLinkWarningModalExports, 'useLinkWarningModal');
		useLinkWarningModalMock.mockReturnValue({
			isLinkSafe: () => false,
			showSafetyWarningModal: showSafetyWarningModalMock,
		} as unknown as ReturnType<typeof UseLinkWarningModalExports.useLinkWarningModal>);

		render(<TestComponent isLinkComponent onClick={onClickMock} checkSafety={false} />);

		screen.getByText('My Link').click();

		expect(onClickMock).toHaveBeenCalled();
		expect(showSafetyWarningModalMock).not.toHaveBeenCalled();
	});

	it('should have empty href', () => {
		render(<TestComponent href={undefined} />);

		const link = screen.getByText('My Link');
		expect(link).toHaveAttribute('href', '');
	});
});
