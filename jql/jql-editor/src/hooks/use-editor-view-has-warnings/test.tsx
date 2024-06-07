import React from 'react';

import { render } from '@testing-library/react';
import { DiProvider, injectable } from 'react-magnetic-di';

import { useExternalMessages, useHydratedDeprecations } from '../../state';
import { type ExternalMessagesNormalized } from '../../state/types';
import { type HydratedDeprecatedField } from '../../ui/jql-editor/types';

import { useEditorViewHasWarnings } from './index';

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

const hydratedDeprecatedFields: HydratedDeprecatedField[] = [
	{
		type: 'deprecated-field',
		id: 'id',
		deprecatedSearcherKey: 'key',
	},
];

const useHydratedDeprecationsMock = jest.fn<[HydratedDeprecatedField[], any], []>(() => [[], {}]);

const useExternalMessagesMock = jest.fn<[ExternalMessagesNormalized, any], []>(() => [
	normalizedExternalMessagesEmpty,
	{},
]);

const assertEditorViewHasWarnings = jest.fn();

const deps = [
	injectable(useHydratedDeprecations, useHydratedDeprecationsMock),
	injectable(useExternalMessages, useExternalMessagesMock),
];

const Consumer = () => {
	assertEditorViewHasWarnings(useEditorViewHasWarnings());
	return null;
};

const renderConsumer = () => {
	return render(<Consumer />, {
		wrapper: (p) => <DiProvider use={deps} {...p} />,
	});
};

describe('useEditorViewHasWarnings', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		useHydratedDeprecationsMock.mockReturnValue([[], {}]);
		useExternalMessagesMock.mockReturnValue([normalizedExternalMessagesEmpty, {}]);
	});

	it('should return true when useHydratedDeprecations are present', () => {
		useHydratedDeprecationsMock.mockReturnValue([hydratedDeprecatedFields, {}]);
		renderConsumer();
		expect(assertEditorViewHasWarnings).toHaveBeenLastCalledWith(true);
	});

	it('should return false when useHydratedDeprecations are empty', () => {
		renderConsumer();
		expect(assertEditorViewHasWarnings).toHaveBeenLastCalledWith(false);
	});

	it('should return true when externalMessages contain warning messages', () => {
		useExternalMessagesMock.mockReturnValue([normalizedExternalMessages, {}]);
		renderConsumer();
		expect(assertEditorViewHasWarnings).toHaveBeenLastCalledWith(true);
	});

	it('should return false when externalMessages does not contain info messages', () => {
		renderConsumer();
		expect(assertEditorViewHasWarnings).toHaveBeenLastCalledWith(false);
	});

	it('should return true when both useHydratedDeprecations and externalMessages are not empty', () => {
		useHydratedDeprecationsMock.mockReturnValue([hydratedDeprecatedFields, {}]);
		useExternalMessagesMock.mockReturnValue([normalizedExternalMessages, {}]);
		renderConsumer();
		expect(assertEditorViewHasWarnings).toHaveBeenLastCalledWith(true);
	});
});
