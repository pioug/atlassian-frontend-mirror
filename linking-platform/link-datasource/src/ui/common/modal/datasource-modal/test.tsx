import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import '@atlaskit/link-test-helpers/jest';
import { IntlProvider } from 'react-intl';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { FlagsProvider } from '@atlaskit/flag/flags-provider';
import CardClient from '@atlaskit/link-provider/client';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Text } from '@atlaskit/primitives/compiled/text';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing/skip-file-decorator';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { DatasourceExperienceIdProvider } from '../../../../contexts/datasource-experience-id/datasource-experience-id-provider';
import { InlineEdit } from '../../../issue-like-table/table-cell-content/inline-edit';
import { DatasourceModal } from './index';

const testIds = {
	readView: 'mock-read-view',
	editView: 'inline-edit-text',
};

const MockReadView = () => {
	return <Box testId={testIds.readView}>Test</Box>;
};

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

describe('DatasourceModal', () => {
	it('should capture and report a11y violations', async () => {
		const spy = jest.fn();
		const { container } = render(
			<AnalyticsListener channel="media" onEvent={spy}>
				<DatasourceModal testId="datasource-modal" onClose={jest.fn()} />
			</AnalyticsListener>,
		);

		await expect(container).toBeAccessible();
	});

	it('should fire datasourceModalDialog viewed screen event on mount', () => {
		const spy = jest.fn();

		render(
			<AnalyticsListener channel="media" onEvent={spy}>
				<DatasourceModal testId="datasource-modal" onClose={jest.fn()} />
			</AnalyticsListener>,
		);

		expect(spy).toBeFiredWithAnalyticEventOnce(
			{
				payload: {
					eventType: 'screen',
					name: 'datasourceModalDialog',
					action: 'viewed',
					attributes: {},
				},
			},
			'media',
		);
	});

	it('should close on ESC key press', () => {
		const onClose = jest.fn();
		const executeFn = jest.fn();
		const { container } = render(
			<SmartCardProvider client={new CardClient()}>
				<IntlProvider locale="en">
					<DatasourceModal onClose={onClose}>
						<FlagsProvider>
							<DatasourceExperienceIdProvider>
								<InlineEdit
									ari="fake-ari"
									columnKey="fake-column"
									columnTitle="Fake column"
									execute={executeFn}
									datasourceTypeWithValues={{ type: 'string', values: ['Test'] }}
									readView={<Text as="p">Test</Text>}
								/>
							</DatasourceExperienceIdProvider>
						</FlagsProvider>
					</DatasourceModal>
				</IntlProvider>
			</SmartCardProvider>,
		);

		fireEvent.keyDown(container, {
			key: 'Escape',
			code: 'Escape',
			keyCode: 27,
			charCode: 27,
		});

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('when triggering inline-edit, pressing Escape, should cancel editing and keep the modal open', () => {
		const onModalCloseFn = jest.fn();
		const executeFn = jest.fn();
		render(
			<SmartCardProvider client={new CardClient()}>
				<IntlProvider locale="en">
					<DatasourceModal onClose={onModalCloseFn}>
						<FlagsProvider>
							<DatasourceExperienceIdProvider>
								<InlineEdit
									ari="fake-ari"
									columnKey="fake-column"
									columnTitle="Fake column"
									execute={executeFn}
									datasourceTypeWithValues={{ type: 'string', values: ['Test'] }}
									readView={<MockReadView />}
								/>
							</DatasourceExperienceIdProvider>
						</FlagsProvider>
					</DatasourceModal>
				</IntlProvider>
			</SmartCardProvider>,
		);
		fireEvent.click(screen.getByTestId(testIds.readView));

		expect(screen.getByTestId(testIds.editView)).toBeInTheDocument();
		fireEvent.keyDown(screen.getByTestId(testIds.editView), {
			key: 'Escape',
			code: 'Escape',
			keyCode: 27,
			charCode: 27,
		});

		expect(screen.getByTestId(testIds.readView)).toBeInTheDocument();

		expect(onModalCloseFn).toHaveBeenCalledTimes(0);
	});

	it('when triggering inline-edit dropdowns, pressing Escape, should keep editing and keep the modal open', async () => {
		const onModalCloseFn = jest.fn();
		const executeFn = jest.fn();
		render(
			<SmartCardProvider client={new CardClient()}>
				<IntlProvider locale="en">
					<DatasourceModal onClose={onModalCloseFn}>
						<FlagsProvider>
							<DatasourceExperienceIdProvider>
								<InlineEdit
									ari="fake-ari"
									columnKey="status"
									columnTitle="Status"
									execute={executeFn}
									datasourceTypeWithValues={{
										type: 'status',
										values: [
											{
												text: 'Test',
												style: {
													appearance: 'inprogress',
												},
											},
										],
									}}
									readView={<MockReadView />}
								/>
							</DatasourceExperienceIdProvider>
						</FlagsProvider>
					</DatasourceModal>
				</IntlProvider>
			</SmartCardProvider>,
		);
		fireEvent.click(screen.getByTestId(testIds.readView));

		expect(screen.getByRole('combobox')).toBeInTheDocument();
		fireEvent.keyDown(screen.getByRole('combobox'), {
			key: 'Escape',
			code: 'Escape',
			keyCode: 27,
			charCode: 27,
		});

		expect(screen.getByTestId('inline-edit-status-select--container')).toBeInTheDocument();
		expect(screen.queryByTestId(testIds.readView)).not.toBeInTheDocument();

		expect(onModalCloseFn).toHaveBeenCalledTimes(0);
	});

	describe('with the top-layer gate on', () => {
		beforeEach(() => {
			passGate('platform-dst-top-layer');
		});

		const renderInlineEditInModal = ({
			columnKey,
			datasourceTypeWithValues,
		}: Pick<React.ComponentProps<typeof InlineEdit>, 'columnKey' | 'datasourceTypeWithValues'>) => {
			const onModalCloseFn = jest.fn();
			render(
				<SmartCardProvider client={new CardClient()}>
					<IntlProvider locale="en">
						<DatasourceModal onClose={onModalCloseFn}>
							<FlagsProvider>
								<DatasourceExperienceIdProvider>
									<InlineEdit
										ari="fake-ari"
										columnKey={columnKey}
										columnTitle="Fake column"
										execute={jest.fn()}
										datasourceTypeWithValues={datasourceTypeWithValues}
										readView={<MockReadView />}
									/>
								</DatasourceExperienceIdProvider>
							</FlagsProvider>
						</DatasourceModal>
					</IntlProvider>
				</SmartCardProvider>,
			);
			fireEvent.click(screen.getByTestId(testIds.readView));
			return { onModalCloseFn };
		};

		const pressEscape = (target: HTMLElement) =>
			fireEvent.keyDown(target, { key: 'Escape', code: 'Escape', keyCode: 27, charCode: 27 });

		it('in read view, Escape is not taken and the modal closes', () => {
			const { onModalCloseFn } = renderInlineEditInModal({
				columnKey: 'fake-column',
				datasourceTypeWithValues: { type: 'string', values: ['Test'] },
			});
			pressEscape(screen.getByTestId(testIds.editView));
			expect(screen.getByTestId(testIds.readView)).toBeInTheDocument();

			pressEscape(screen.getByTestId(testIds.readView));

			expect(onModalCloseFn).toHaveBeenCalledTimes(1);
		});

		it('Escape cancels the edit and keeps the modal open', () => {
			const { onModalCloseFn } = renderInlineEditInModal({
				columnKey: 'fake-column',
				datasourceTypeWithValues: { type: 'string', values: ['Test'] },
			});

			pressEscape(screen.getByTestId(testIds.editView));

			expect(screen.getByTestId(testIds.readView)).toBeInTheDocument();
			expect(onModalCloseFn).not.toHaveBeenCalled();
		});

		it('the first Escape closes the open menu, the second cancels the edit, and the modal stays open', async () => {
			const { onModalCloseFn } = renderInlineEditInModal({
				columnKey: 'status',
				datasourceTypeWithValues: {
					type: 'status',
					values: [{ text: 'Test', style: { appearance: 'inprogress' } }],
				},
			});
			expect(await screen.findByRole('listbox')).toBeInTheDocument();

			pressEscape(screen.getByRole('combobox'));

			await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
			expect(screen.getByRole('combobox')).toBeInTheDocument();

			pressEscape(screen.getByRole('combobox'));

			expect(screen.getByTestId(testIds.readView)).toBeInTheDocument();
			expect(onModalCloseFn).not.toHaveBeenCalled();
		});
	});
});
