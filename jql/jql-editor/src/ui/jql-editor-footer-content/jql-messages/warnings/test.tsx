import React, { type ReactNode } from 'react';

import { render } from '@testing-library/react';
import { type IntlShape } from 'react-intl-next';
import { DiProvider, injectable } from 'react-magnetic-di';

import { mockIntl } from '../../../../../mocks';
import { useExternalMessages, useHydratedDeprecations, useIntl } from '../../../../state';
import { type ExternalMessagesNormalized } from '../../../../state/types';
import { type HydratedDeprecatedField } from '../../../jql-editor/types';

import { useFormattedWarningMessage, WarningMessages } from './index';

const useFormattedWarningMessageMock = jest.fn<ReactNode, []>(() => null);

describe('WarningMessages', () => {
	const deps = [injectable(useFormattedWarningMessage, useFormattedWarningMessageMock)];

	const renderWarningMessages = () => {
		return render(<WarningMessages />, {
			wrapper: (p) => <DiProvider use={deps} {...p} />,
		});
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should not render warnings if the useFormattedWarningMessage returns null', () => {
		useFormattedWarningMessageMock.mockReturnValue(null);
		const { container } = renderWarningMessages();
		expect(container.firstChild).toBeNull();
	});

	it('should not render warnings if the useFormattedWarningMessage returns a non null result', () => {
		useFormattedWarningMessageMock.mockReturnValue(<>warnings</>);
		const { getByText } = renderWarningMessages();
		expect(getByText('warnings')).toBeInTheDocument();
	});
	it('should capture and report a11y violations', async () => {
		const { container } = render(<WarningMessages />, {
			wrapper: (p) => <DiProvider use={deps} {...p} />,
		});
		await expect(container).toBeAccessible();
	});
});

describe('useFormattedWarningMessage', () => {
	const normalizedExternalMessagesEmpty: ExternalMessagesNormalized = {
		errors: [],
		warnings: [],
		infos: [],
	};

	const normalizedExternalMessages: ExternalMessagesNormalized = {
		errors: [],
		warnings: [{ type: 'warning', message: 'oh no' }],
		infos: [],
	};

	const useHydratedDeprecationsMock = jest.fn<[HydratedDeprecatedField[], any], []>(() => [[], {}]);

	const useExternalMessagesMock = jest.fn<[ExternalMessagesNormalized, any], []>(() => [
		normalizedExternalMessagesEmpty,
		{},
	]);

	const EpicLinkHydrationMock: HydratedDeprecatedField = {
		type: 'deprecated-field',
		id: 'Epic Link',
		deprecatedSearcherKey: 'com.pyxis.greenhopper.jira:gh-epic-link-searcher',
	};

	const ParentLinkHydrationMock: HydratedDeprecatedField = {
		type: 'deprecated-field',
		id: 'Parent Link',
		deprecatedSearcherKey: 'com.atlassian.jpo:jpo-custom-field-parent-searcher',
	};

	const FirstFieldHydrationMock: HydratedDeprecatedField = {
		type: 'deprecated-field',
		id: 'First Field',
		deprecatedSearcherKey: 'com.atlassian.jpo:jpo-first-field',
	};

	const deps = [
		injectable(useIntl, (): [IntlShape, any] => [mockIntl, {}]),
		injectable(useHydratedDeprecations, useHydratedDeprecationsMock),
		injectable(useExternalMessages, useExternalMessagesMock),
	];

	const Consumer = () => {
		return <>{useFormattedWarningMessage()}</>;
	};

	const renderConsumer = () => {
		return render(<Consumer />, {
			wrapper: (p) => <DiProvider use={deps} {...p} />,
		});
	};

	beforeEach(() => {
		jest.clearAllMocks();
		useHydratedDeprecationsMock.mockReturnValue([[], null]);
		useExternalMessagesMock.mockReturnValue([normalizedExternalMessagesEmpty, {}]);
	});

	it('should render null if no messages are present', () => {
		const { container } = renderConsumer();
		expect(container.firstChild).toBeNull();
	});

	it('should render deprecated fields only if there are no external messages present', () => {
		useHydratedDeprecationsMock.mockReturnValue([[EpicLinkHydrationMock], null]);
		useExternalMessagesMock.mockReturnValue([normalizedExternalMessagesEmpty, {}]);
		const { container, queryByText } = renderConsumer();
		expect(queryByText('oh no')).not.toBeInTheDocument();
		expect(container).toHaveTextContent(
			`Epic Link will soon be replaced with Parent. Update to Parent to prepare for these changes.`,
		);
	});

	it('should render external messages only if there are no deprecated fields present', () => {
		useHydratedDeprecationsMock.mockReturnValue([[], null]);
		useExternalMessagesMock.mockReturnValue([normalizedExternalMessages, {}]);
		const { container, getByText } = renderConsumer();
		expect(getByText('oh no')).toBeInTheDocument();
		expect(container).not.toHaveTextContent(
			`Epic Link will soon be replaced with Parent. Update to Parent to prepare for these changes.`,
		);
	});

	it('should render more than one external message if present', () => {
		useExternalMessagesMock.mockReturnValue([
			{
				...normalizedExternalMessages,
				warnings: [...normalizedExternalMessages.warnings, ...normalizedExternalMessages.warnings],
			},
			{},
		]);
		const { getAllByText } = renderConsumer();
		expect(getAllByText('oh no')).toHaveLength(2);
	});

	it('should render both deprecated fields and external messages in a proper order if they are present', () => {
		useHydratedDeprecationsMock.mockReturnValue([[EpicLinkHydrationMock], null]);
		useExternalMessagesMock.mockReturnValue([normalizedExternalMessages, {}]);
		const { container } = renderConsumer();
		expect(container).toHaveTextContent(
			`Epic Link will soon be replaced with Parent. Update to Parent to prepare for these changes.oh no`,
		);
	});

	it('should render joint warning if epic link and parent link are present', () => {
		useHydratedDeprecationsMock.mockReturnValue([
			[EpicLinkHydrationMock, ParentLinkHydrationMock],
			null,
		]);
		const { container } = renderConsumer();
		expect(container).toHaveTextContent(
			'Epic Link and Parent Link will soon be replaced with Parent.',
		);
	});

	it('should render epic link warning if a deprecated field is present', () => {
		useHydratedDeprecationsMock.mockReturnValue([[EpicLinkHydrationMock], null]);
		const { container } = renderConsumer();
		expect(container).toHaveTextContent('Epic Link will soon be replaced with Parent.');
	});

	it('should render parent link warning if a deprecated field is present', () => {
		useHydratedDeprecationsMock.mockReturnValue([[ParentLinkHydrationMock], null]);
		const { container } = renderConsumer();
		expect(container).toHaveTextContent('Parent Link will soon be replaced with Parent.');
	});

	it('should render default warning if one does not exist', () => {
		useHydratedDeprecationsMock.mockReturnValue([[FirstFieldHydrationMock], null]);
		const { container } = renderConsumer();
		expect(container).toHaveTextContent(
			'First Field has been deprecated and may stop working in the future.',
		);
	});
	it('should capture and report a11y violations', async () => {
		const { container } = render(<Consumer />, {
			wrapper: (p) => <DiProvider use={deps} {...p} />,
		});
		await expect(container).toBeAccessible();
	});
});
