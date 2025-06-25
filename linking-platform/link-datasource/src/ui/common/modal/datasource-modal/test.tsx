import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import '@atlaskit/link-test-helpers/jest';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { FlagsProvider } from '@atlaskit/flag';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { Box, Text } from '@atlaskit/primitives/compiled';

import { DatasourceExperienceIdProvider } from '../../../../contexts/datasource-experience-id';
import { InlineEdit } from '../../../issue-like-table/table-cell-content/inline-edit';

import { DatasourceModal } from './index';

const testIds = {
	readView: 'mock-read-view',
	editView: 'inline-edit-text',
};

const MockReadView = () => {
	return <Box testId={testIds.readView}>Test</Box>;
};

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

	it('when triggering inline-edit dropdowns, pressing Escape, should cancel editing and keep the modal open', async () => {
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

		expect(screen.getByTestId(testIds.readView)).toBeInTheDocument();

		expect(onModalCloseFn).toHaveBeenCalledTimes(0);
	});
});
