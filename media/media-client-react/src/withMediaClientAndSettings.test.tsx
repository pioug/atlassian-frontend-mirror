import React from 'react';

import { render, screen } from '@testing-library/react';

import { type MediaClient, type MediaClientConfig } from '@atlaskit/media-client';

import { MediaClientProvider } from './MediaClientProvider';
import { MediaProvider } from './MediaProvider';
import type { MediaParsedSettings, MediaSettings } from './mediaSettings';
import { useMediaClient } from './useMediaClient';
import { useMediaSettings } from './useMediaSettings';
import { withMediaClientAndSettings } from './withMediaClientAndSettings';

const TestComponentBase = ({
	mediaClient,
	mediaSettings,
	otherProps,
}: {
	mediaClient: MediaClient;
	mediaSettings?: MediaParsedSettings;
	otherProps: string;
}) => {
	const mediaClientFromHook = useMediaClient();
	const mediaSettingsFromHook = useMediaSettings();

	return (
		<div>
			<div data-testid="mediaClientFromProps">{`${!!mediaClient.config.authProvider}`}</div>
			<div data-testid="mediaClientFromHook">{`${!!mediaClientFromHook.config.authProvider}`}</div>
			<div data-testid="settingsFromProps">{`${!!mediaSettings?.mediaUserPreferences}`}</div>
			<div data-testid="settingsFromHook">{`${!!mediaSettingsFromHook?.mediaUserPreferences}`}</div>
			<div data-testid="other">{otherProps}</div>
			<div data-testid="settingsFromPropsBoolean">{`${!!(mediaSettings as any)?.someBooleanSetting}`}</div>
			<div data-testid="settingsFromHookBoolean">{`${!!(mediaSettingsFromHook as any)?.someBooleanSetting}`}</div>
			<div data-testid="settingsFromPropsString">{`${(mediaSettings as any)?.someStringSetting || ''}`}</div>
			<div data-testid="settingsFromHookString">{`${(mediaSettingsFromHook as any)?.someStringSetting || ''}`}</div>
		</div>
	);
};

const WrappedTestComponentWithProps = withMediaClientAndSettings(TestComponentBase);

const TestComponent = ({
	mediaClientConfig,
	mediaSettings,
	otherProps,
}: {
	mediaClientConfig: MediaClientConfig;
	mediaSettings?: MediaSettings;
	otherProps: string;
}) => {
	return (
		<WrappedTestComponentWithProps
			mediaClientConfig={mediaClientConfig}
			mediaSettings={mediaSettings}
			otherProps={otherProps}
		/>
	);
};

const mockMediaClientConfig: MediaClientConfig = {
	authProvider: async () => ({
		clientId: 'test-client-id',
		token: 'test-token',
		baseUrl: 'test-base-url',
	}),
};

const mockMediaSettings = {
	someSetting: true,
	another: 'setting',
} as MediaSettings;

describe('withMediaClientAndSettings', () => {
	it('should render the child component with Media Client and Settings from MediaProvider', () => {
		render(
			<MediaProvider mediaClientConfig={mockMediaClientConfig} mediaSettings={mockMediaSettings}>
				<TestComponent mediaClientConfig={{} as MediaClientConfig} otherProps="other-props" />
			</MediaProvider>,
		);

		expect(screen.getByTestId('mediaClientFromProps')).toHaveTextContent('true');
		expect(screen.getByTestId('mediaClientFromHook')).toHaveTextContent('true');
		expect(screen.getByTestId('settingsFromProps')).toHaveTextContent('true');
		expect(screen.getByTestId('settingsFromHook')).toHaveTextContent('true');
		expect(screen.getByTestId('other')).toHaveTextContent('other-props');
	});

	it('should render the child component with Media Client from MediaClientProvider and Settings from props', () => {
		render(
			<MediaClientProvider clientConfig={mockMediaClientConfig}>
				<TestComponent
					mediaClientConfig={{} as MediaClientConfig}
					mediaSettings={mockMediaSettings}
					otherProps="other-props"
				/>
			</MediaClientProvider>,
		);

		expect(screen.getByTestId('mediaClientFromProps')).toHaveTextContent('true');
		expect(screen.getByTestId('mediaClientFromHook')).toHaveTextContent('true');
		expect(screen.getByTestId('settingsFromProps')).toHaveTextContent('true');
		expect(screen.getByTestId('settingsFromHook')).toHaveTextContent('true');
		expect(screen.getByTestId('other')).toHaveTextContent('other-props');
	});

	it('should render the child component with Media Client and Settings from props', () => {
		render(
			<TestComponent
				mediaClientConfig={mockMediaClientConfig}
				mediaSettings={mockMediaSettings}
				otherProps="other-props"
			/>,
		);

		expect(screen.getByTestId('mediaClientFromProps')).toHaveTextContent('true');
		expect(screen.getByTestId('mediaClientFromHook')).toHaveTextContent('true');
		expect(screen.getByTestId('settingsFromProps')).toHaveTextContent('true');
		expect(screen.getByTestId('settingsFromHook')).toHaveTextContent('true');
		expect(screen.getByTestId('other')).toHaveTextContent('other-props');
	});

	it('should combine Settings from props and MediaProvider, with priority to props', () => {
		const providerSettings: MediaSettings = {
			someBooleanSetting: false,
			someStringSetting: 'provider-value',
		} as MediaSettings;

		const propsSettings: MediaSettings = {
			someBooleanSetting: true,
			someStringSetting: 'props-value',
		} as MediaSettings;

		render(
			<MediaProvider mediaClientConfig={mockMediaClientConfig} mediaSettings={providerSettings}>
				<TestComponent
					mediaClientConfig={mockMediaClientConfig}
					mediaSettings={propsSettings}
					otherProps="other-props"
				/>
			</MediaProvider>,
		);

		expect(screen.getByTestId('settingsFromPropsBoolean')).toHaveTextContent('true');
		expect(screen.getByTestId('settingsFromHookBoolean')).toHaveTextContent('true');
		expect(screen.getByTestId('settingsFromPropsString')).toHaveTextContent('props-value');
		expect(screen.getByTestId('settingsFromHookString')).toHaveTextContent('props-value');
	});
});
