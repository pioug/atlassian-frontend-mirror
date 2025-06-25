import React from 'react';

import { render } from '@testing-library/react';
import { DiProvider, injectable } from 'react-magnetic-di';

import { useEditorViewHasInfos } from '../../hooks/use-editor-view-has-infos';
import { useEditorViewHasWarnings } from '../../hooks/use-editor-view-has-warnings';
import { useEditorViewIsInvalid } from '../../hooks/use-editor-view-is-invalid';

import { JQLEditorHelp } from './jql-editor-help';
import { ErrorMessages, InfoMessages, WarningMessages } from './jql-messages';

import { JQLEditorFooterContent } from './index';

const useEditorViewIsInvalidMock = jest.fn<boolean, []>(() => false);
const useEditorViewHasWarningsMock = jest.fn<boolean, []>(() => false);
const useEditorViewHasInfosMock = jest.fn<boolean, []>(() => false);

const deps = [
	injectable(useEditorViewIsInvalid, useEditorViewIsInvalidMock),
	injectable(useEditorViewHasWarnings, useEditorViewHasWarningsMock),
	injectable(useEditorViewHasInfos, useEditorViewHasInfosMock),
	injectable(ErrorMessages, () => <>ErrorMessages</>),
	injectable(WarningMessages, () => <>WarningMessages</>),
	injectable(InfoMessages, () => <>InfoMessages</>),
	injectable(JQLEditorHelp, () => <>JQLEditorHelp</>),
];

const renderComponent = () => {
	return render(<JQLEditorFooterContent />, {
		wrapper: (props) => <DiProvider use={deps} {...props} />,
	});
};

const componentNames = [
	'ErrorMessages',
	'WarningMessages',
	'InfoMessages',
	'JQLEditorHelp',
] as const;
type ComponentName = (typeof componentNames)[number];

const assertOnlyOneIsRendered = (name: ComponentName) => {
	const { getByText, queryByText } = renderComponent();
	let hasAtLeastOneMatched = false;

	componentNames.forEach((componentName) => {
		if (componentName === name) {
			hasAtLeastOneMatched = true;
			expect(getByText(componentName)).toBeInTheDocument();
		} else {
			expect(queryByText(componentName)).not.toBeInTheDocument();
		}
	});

	expect(hasAtLeastOneMatched).toBe(true);
};

describe('basic behaviour', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		useEditorViewIsInvalidMock.mockReturnValue(false);
		useEditorViewHasWarningsMock.mockReturnValue(false);
		useEditorViewHasInfosMock.mockReturnValue(false);
	});

	it('should render only JQLEditorHelp if there are no messages to display', () => {
		assertOnlyOneIsRendered('JQLEditorHelp');
	});

	it('should render only errors if there are some to display', () => {
		useEditorViewIsInvalidMock.mockReturnValue(true);
		assertOnlyOneIsRendered('ErrorMessages');
	});

	it('should render only warnings if there are some to display', () => {
		useEditorViewHasWarningsMock.mockReturnValue(true);
		assertOnlyOneIsRendered('WarningMessages');
	});

	it('should render only warnings if there are some to display', () => {
		useEditorViewHasInfosMock.mockReturnValue(true);
		assertOnlyOneIsRendered('InfoMessages');
	});

	describe('renders only a single type of messages at once considering their priority', () => {
		it('should render only errors when there are error, warning and info messages present', () => {
			useEditorViewIsInvalidMock.mockReturnValue(true);
			useEditorViewHasWarningsMock.mockReturnValue(true);
			useEditorViewHasInfosMock.mockReturnValue(true);
			assertOnlyOneIsRendered('ErrorMessages');
		});

		it('should render only warnings when there are warning and info messages present', () => {
			useEditorViewHasWarningsMock.mockReturnValue(true);
			useEditorViewHasInfosMock.mockReturnValue(true);
			assertOnlyOneIsRendered('WarningMessages');
		});
		it('should capture and report a11y violations', async () => {
			const { container } = renderComponent();
			await expect(container).toBeAccessible();
		});
	});
});
