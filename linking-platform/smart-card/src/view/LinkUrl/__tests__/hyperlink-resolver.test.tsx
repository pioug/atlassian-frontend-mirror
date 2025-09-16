import React from 'react';

import { render } from '@testing-library/react';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import AKLink from '@atlaskit/link';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import * as UseAnalyticsEventsExports from '../../../common/analytics/generated/use-analytics-events';
import * as UseSmartCardActionsExports from '../../../state/actions';
import * as stateHelpers from '../../../state/helpers';
import * as useScheduledRegisterExports from '../../../state/hooks/use-resolve-hyperlink/useScheduledRegister';
import * as measureModule from '../../../utils/performance';
import LinkUrl from '../index';
import type { LinkUrlProps } from '../types';

jest.mock('@atlaskit/link', () => ({
	__esModule: true,
	default: jest
		.fn()
		.mockImplementation((props) => jest.requireActual('@atlaskit/link').default.render(props)),
}));

jest.mock('@atlaskit/link-provider', () => ({
	...jest.requireActual('@atlaskit/link-provider'),
	CardClient: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('@atlaskit/feature-gate-js-client', () => ({
	getExperimentValue: jest.fn(),
	checkGate: jest.fn(),
}));

jest.mock('../../../state/helpers', () => ({
	...jest.requireActual('../../../state/helpers'),
	getExtensionKey: jest.fn(),
}));

const spyOnAtlaskitLink = jest.mocked(AKLink);
const useExperimentGateMock = jest.spyOn(FeatureGates, 'getExperimentValue');
const checkGateMock = jest.spyOn(FeatureGates, 'checkGate');
const useSmartCardActionsMock = jest.spyOn(UseSmartCardActionsExports, 'useSmartCardActions');
const useAnalyticsEventsMock = jest.spyOn(UseAnalyticsEventsExports, 'useAnalyticsEvents');
const getMeasureMock = jest.spyOn(measureModule, 'getMeasure');
const getExtensionKeyMock = jest.spyOn(stateHelpers, 'getExtensionKey');
const batchedRegisterMock = jest.fn().mockResolvedValue(undefined);
const useScheduledRegisterMock = jest.spyOn(useScheduledRegisterExports, 'useScheduledRegister');
const useSmartCardStateMock = jest.spyOn(require('../../../state/store'), 'useSmartCardState');
const mockRegister = jest.fn();

describe('LinkUrl', () => {
	const TestComponent = (props: Partial<LinkUrlProps>) => (
		<LinkUrl href="https://atlassian.com" {...props}>
			My Link
		</LinkUrl>
	);

	beforeEach(() => {
		spyOnAtlaskitLink.mockClear();
		jest.clearAllMocks();
		checkGateMock.mockReturnValue(true);
	});

	ffTest.both('navx-1834-refactor-resolved-hyperlink', 'with fg', () => {
		describe('resolve hyperlink', () => {
			it('should not attempt to resolve a hyperlink if there is no SmartCardProvider context', () => {
				useSmartCardActionsMock.mockReturnValue({
					register: jest.fn(),
				} as unknown as ReturnType<typeof UseSmartCardActionsExports.useSmartCardActions>);

				render(
					<TestComponent
						enableResolve={true}
						href="https://atlassianmpsa-my.sharepoint.com/personal/test"
					/>,
				);
				expect(useSmartCardActionsMock).not.toHaveBeenCalled();
			});

			it('should attempt to resolve a sharepoint hyperlink if there is a SmartCardProvider context', () => {
				// sharepoint enabled, google disabled
				useExperimentGateMock.mockImplementation((experimentName) => {
					if (
						experimentName === 'platform_editor_resolve_hyperlinks_confluence' ||
						experimentName === 'platform_editor_resolve_hyperlinks_jira'
					) {
						return true;
					}
					if (experimentName === 'platform_editor_resolve_google_hyperlinks') {
						return false;
					}
					return false;
				});

				useSmartCardActionsMock.mockReturnValue({
					register: jest.fn(),
				} as unknown as ReturnType<typeof UseSmartCardActionsExports.useSmartCardActions>);

				const batchedRegisterMock = jest.fn().mockResolvedValue(undefined);
				const useScheduledRegisterMock = jest.spyOn(
					useScheduledRegisterExports,
					'useScheduledRegister',
				);
				useScheduledRegisterMock.mockReturnValue(batchedRegisterMock);

				render(
					<SmartCardProvider client={new CardClient()}>
						<TestComponent
							enableResolve={true}
							href="https://atlassianmpsa-my.sharepoint.com/personal/test"
						/>
					</SmartCardProvider>,
				);
				expect(useSmartCardActionsMock).toHaveBeenCalled();
				expect(useScheduledRegisterMock).toHaveBeenCalled();
			});

			it('should not attempt to resolve a hyperlink if the domain is not sharepoint/onedrive related when only SharePoint gates are enabled', () => {
				// sharepoint enabled, google disabled
				useExperimentGateMock.mockImplementation((experimentName) => {
					if (
						experimentName === 'platform_editor_resolve_hyperlinks_confluence' ||
						experimentName === 'platform_editor_resolve_hyperlinks_jira'
					) {
						return true;
					}
					if (experimentName === 'platform_editor_resolve_google_hyperlinks') {
						return false;
					}
					return false;
				});

				useSmartCardActionsMock.mockReturnValue({
					register: jest.fn(),
				} as unknown as ReturnType<typeof UseSmartCardActionsExports.useSmartCardActions>);

				render(
					<SmartCardProvider client={new CardClient()}>
						<TestComponent enableResolve={true} href="https://docs.google.com/document/1" />
					</SmartCardProvider>,
				);
				expect(useSmartCardActionsMock).not.toHaveBeenCalled();
			});

			it('should not attempt to resolve a sharepoint hyperlink when experiment gate is disabled', () => {
				useExperimentGateMock.mockReturnValue(false);
				useSmartCardActionsMock.mockReturnValue({
					register: jest.fn(),
				} as unknown as ReturnType<typeof UseSmartCardActionsExports.useSmartCardActions>);

				render(
					<SmartCardProvider client={new CardClient()}>
						<TestComponent
							enableResolve={true}
							href="https://atlassianmpsa-my.sharepoint.com/personal/test"
						/>
					</SmartCardProvider>,
				);
				expect(useSmartCardActionsMock).not.toHaveBeenCalled();
			});

			it('should attempt to resolve a google hyperlink if there is a SmartCardProvider context and feature gate is enabled', () => {
				// sharepoint disabled, google enabled
				useExperimentGateMock.mockImplementation((experimentName) => {
					if (experimentName === 'platform_editor_resolve_google_hyperlinks') {
						return true;
					}
					if (
						experimentName === 'platform_editor_resolve_hyperlinks_confluence' ||
						experimentName === 'platform_editor_resolve_hyperlinks_jira'
					) {
						return false;
					}
					return false;
				});

				useSmartCardActionsMock.mockReturnValue({
					register: jest.fn(),
				} as unknown as ReturnType<typeof UseSmartCardActionsExports.useSmartCardActions>);

				const batchedRegisterMock = jest.fn().mockResolvedValue(undefined);
				const useScheduledRegisterMock = jest.spyOn(
					useScheduledRegisterExports,
					'useScheduledRegister',
				);
				useScheduledRegisterMock.mockReturnValue(batchedRegisterMock);

				render(
					<SmartCardProvider client={new CardClient()}>
						<TestComponent
							enableResolve={true}
							href="https://docs.google.com/document/d/123/edit"
						/>
						<TestComponent
							enableResolve={true}
							href="https://drive.google.com/document/d/123/edit"
						/>
					</SmartCardProvider>,
				);
				expect(useSmartCardActionsMock).toHaveBeenCalledTimes(2);
				expect(useScheduledRegisterMock).toHaveBeenCalledTimes(2);
			});

			it('should not attempt to resolve a google hyperlink when experiment gate is disabled', () => {
				useExperimentGateMock.mockReturnValue(false);
				useSmartCardActionsMock.mockReturnValue({
					register: jest.fn(),
				} as unknown as ReturnType<typeof UseSmartCardActionsExports.useSmartCardActions>);

				render(
					<SmartCardProvider client={new CardClient()}>
						<TestComponent
							enableResolve={true}
							href="https://docs.google.com/document/d/123/edit"
						/>
					</SmartCardProvider>,
				);
				expect(useSmartCardActionsMock).not.toHaveBeenCalled();
			});

			it('should not attempt to resolve a hyperlink if the domain is not google related when only Google gate is enabled', () => {
				// sharepoint disabled, google enabled
				useExperimentGateMock.mockImplementation((experimentName) => {
					if (experimentName === 'platform_editor_resolve_google_hyperlinks') {
						return true;
					}
					if (
						experimentName === 'platform_editor_resolve_hyperlinks_confluence' ||
						experimentName === 'platform_editor_resolve_hyperlinks_jira'
					) {
						return false;
					}
					return false;
				});

				useSmartCardActionsMock.mockReturnValue({
					register: jest.fn(),
				} as unknown as ReturnType<typeof UseSmartCardActionsExports.useSmartCardActions>);

				render(
					<SmartCardProvider client={new CardClient()}>
						<TestComponent enableResolve={true} href="https://sharepoint.com/document/1" />
					</SmartCardProvider>,
				);
				expect(useSmartCardActionsMock).not.toHaveBeenCalled();
			});

			it('should handle both sharepoint and google feature gates being enabled', () => {
				useExperimentGateMock.mockImplementation((experimentName) => {
					if (
						experimentName === 'platform_editor_resolve_google_hyperlinks' ||
						experimentName === 'platform_editor_resolve_hyperlinks_confluence' ||
						experimentName === 'platform_editor_resolve_hyperlinks_jira'
					) {
						return true;
					}
					return false;
				});

				useSmartCardActionsMock.mockReturnValue({
					register: jest.fn(),
				} as unknown as ReturnType<typeof UseSmartCardActionsExports.useSmartCardActions>);

				const batchedRegisterMock = jest.fn().mockResolvedValue(undefined);
				const useScheduledRegisterMock = jest.spyOn(
					useScheduledRegisterExports,
					'useScheduledRegister',
				);
				useScheduledRegisterMock.mockReturnValue(batchedRegisterMock);

				render(
					<SmartCardProvider client={new CardClient()}>
						<TestComponent
							enableResolve={true}
							href="https://docs.google.com/document/d/123/edit"
						/>
						<TestComponent
							enableResolve={true}
							href="https://atlassianmpsa-my.sharepoint.com/personal/test"
						/>
					</SmartCardProvider>,
				);
				expect(useSmartCardActionsMock).toHaveBeenCalledTimes(2);
				expect(useScheduledRegisterMock).toHaveBeenCalledTimes(2);
			});

			describe('analytics events', () => {
				let fireEventMock: jest.Mock;

				beforeEach(() => {
					fireEventMock = jest.fn();
					useAnalyticsEventsMock.mockReturnValue({
						fireEvent: fireEventMock,
					});

					getMeasureMock.mockReturnValue({
						duration: 123.45,
						name: 'test-measure',
						entryType: 'measure',
						startTime: 100,
						toJSON: () => ({}),
					} as PerformanceEntry);
				});

				it('should fire operational.hyperlink.resolved analytics event when hyperlink resolves successfully', async () => {
					useExperimentGateMock.mockReturnValue(true);
					getExtensionKeyMock.mockReturnValue('onedrive-object-provider');

					useSmartCardActionsMock.mockReturnValue({
						register: mockRegister,
					} as unknown as ReturnType<typeof UseSmartCardActionsExports.useSmartCardActions>);

					useScheduledRegisterMock.mockReturnValue(batchedRegisterMock);

					useSmartCardStateMock.mockReturnValue({
						status: 'resolved',
						details: {
							meta: {
								resourceType: 'sharepointFile',
								definitionId: 'test-definition-id',
							},
						},
						error: null,
					});

					render(
						<SmartCardProvider client={new CardClient()}>
							<TestComponent
								enableResolve={true}
								href="https://atlassianmpsa-my.sharepoint.com/personal/test"
							/>
						</SmartCardProvider>,
					);

					expect(fireEventMock).toHaveBeenCalledWith('operational.hyperlink.resolved', {
						definitionId: 'test-definition-id',
						extensionKey: 'onedrive-object-provider',
						resourceType: 'sharepointFile',
						duration: expect.any(Number),
					});
				});

				it('should fire operational.hyperlink.unresolved analytics event when hyperlink fails to resolve', async () => {
					useExperimentGateMock.mockReturnValue(true);
					getExtensionKeyMock.mockReturnValue(undefined);

					const mockRegister = jest.fn();
					useSmartCardActionsMock.mockReturnValue({
						register: mockRegister,
					} as unknown as ReturnType<typeof UseSmartCardActionsExports.useSmartCardActions>);

					useScheduledRegisterMock.mockReturnValue(batchedRegisterMock);

					useSmartCardStateMock.mockReturnValue({
						status: 'errored',
						details: {
							meta: {
								definitionId: 'test-definition-id',
							},
						},
						error: {
							name: 'TestError',
							kind: 'error',
							type: 'TestError',
						},
					});

					render(
						<SmartCardProvider client={new CardClient()}>
							<TestComponent
								enableResolve={true}
								href="https://atlassianmpsa-my.sharepoint.com/personal/test"
							/>
						</SmartCardProvider>,
					);

					expect(fireEventMock).toHaveBeenCalledWith('operational.hyperlink.unresolved', {
						definitionId: 'test-definition-id',
						extensionKey: null,
						resourceType: null,
						reason: 'errored',
						error: {
							name: 'TestError',
							kind: 'error',
							type: 'TestError',
						},
					});
				});

				it('should not fire analytics event for ResolveUnsupportedError', async () => {
					useExperimentGateMock.mockReturnValue(true);

					useSmartCardActionsMock.mockReturnValue({
						register: mockRegister,
					} as unknown as ReturnType<typeof UseSmartCardActionsExports.useSmartCardActions>);

					useScheduledRegisterMock.mockReturnValue(batchedRegisterMock);
					useSmartCardStateMock.mockReturnValue({
						status: 'errored',
						details: {
							meta: {
								definitionId: 'test-definition-id',
							},
						},
						error: {
							name: 'ResolveUnsupportedError',
							kind: 'error',
							type: 'ResolveUnsupportedError',
						},
					});

					render(
						<SmartCardProvider client={new CardClient()}>
							<TestComponent
								enableResolve={true}
								href="https://atlassianmpsa-my.sharepoint.com/personal/test"
							/>
						</SmartCardProvider>,
					);

					expect(fireEventMock).not.toHaveBeenCalledWith(
						'operational.hyperlink.unresolved',
						expect.any(Object),
					);
				});

				it('should not fire analytics event for UnsupportedError', async () => {
					useExperimentGateMock.mockReturnValue(true);

					useSmartCardActionsMock.mockReturnValue({
						register: mockRegister,
					} as unknown as ReturnType<typeof UseSmartCardActionsExports.useSmartCardActions>);

					useScheduledRegisterMock.mockReturnValue(batchedRegisterMock);

					useSmartCardStateMock.mockReturnValue({
						status: 'errored',
						details: {
							meta: {
								definitionId: 'test-definition-id',
							},
						},
						error: {
							name: 'UnsupportedError',
							kind: 'error',
							type: 'UnsupportedError',
						},
					});

					render(
						<SmartCardProvider client={new CardClient()}>
							<TestComponent
								enableResolve={true}
								href="https://atlassianmpsa-my.sharepoint.com/personal/test"
							/>
						</SmartCardProvider>,
					);

					expect(fireEventMock).not.toHaveBeenCalledWith(
						'operational.hyperlink.unresolved',
						expect.any(Object),
					);
				});
			});
		});
	});
});
