import React from 'react';

import {
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
} from '@atlaskit/editor-common/hooks';
import type { EditorAppearance, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';

import { BrowserWrapper } from './BrowserWrapper';
import { ClipboardWrapper } from './ClipboardWrapper';
import { DropzoneWrapper } from './DropzoneWrapper';

type Props = {
	editorDomElement: Element;
	appearance: EditorAppearance;
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	onPopupToggle: (onPopupToggle: (isPopupOpened: boolean) => void) => void;
	setBrowseFn: (nativeBrowseFn: () => void) => void;
};

type State = {
	isPopupOpened: boolean;
};

type MediaPickerProps = {
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	appearance: EditorAppearance;
	isPopupOpened: boolean;
	editorDomElement: Element;
	onBrowseFn: (nativeBrowseFn: () => void) => void;
};

const useMediaPickerState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined) => {
		const hasFocus = useSharedPluginStateSelector(api, 'focus.hasFocus');
		const connectivityMode = useSharedPluginStateSelector(api, 'connectivity.mode');
		const mediaOptions = useSharedPluginStateSelector(api, 'media.mediaOptions');
		return {
			hasFocus,
			connectivityMode,
			mediaOptions,
		};
	},
	(api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined) => {
		const { focusState, connectivityState, mediaState } = useSharedPluginState(api, [
			'focus',
			'connectivity',
			'media',
		]);
		return {
			hasFocus: focusState?.hasFocus,
			connectivityMode: connectivityState?.mode,
			mediaOptions: mediaState?.mediaOptions,
		};
	},
);

const MediaPicker = ({
	api,
	isPopupOpened,
	appearance,
	onBrowseFn,
	editorDomElement,
}: MediaPickerProps) => {
	const { hasFocus, connectivityMode, mediaOptions } = useMediaPickerState(api);
	const featureFlags = mediaOptions && mediaOptions.featureFlags;

	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	const editorDom = editorDomElement as HTMLElement;
	const editorParent = editorDom.parentElement ?? undefined;

	/**
	 * https://product-fabric.atlassian.net/browse/ED-21993
	 * Avoid attach paste event to same dom element,
	 * so editor-paste-plugin can use stopPropagation,
	 * as stopImmediatePropagation could cause race condition issues
	 */
	const container = editorParent;

	const clipboard = hasFocus ? (
		<ClipboardWrapper api={api} featureFlags={featureFlags} container={container} />
	) : null;

	return (
		<>
			{clipboard}
			<DropzoneWrapper
				api={api}
				isActive={
					!isPopupOpened &&
					// If we're offline don't show the dropzone
					connectivityMode !== 'offline'
				}
				featureFlags={featureFlags}
				editorDomElement={editorDomElement}
				appearance={appearance}
			/>
			<BrowserWrapper api={api} onBrowseFn={onBrowseFn} featureFlags={featureFlags} />
		</>
	);
};

// eslint-disable-next-line @repo/internal/react/no-class-components
export class MediaPickerComponents extends React.Component<Props, State> {
	static displayName = 'MediaPickerComponents';

	state = {
		isPopupOpened: false,
	};

	componentDidMount() {
		const { onPopupToggle } = this.props;
		onPopupToggle((isPopupOpened) => {
			this.setState({
				isPopupOpened,
			});
		});
	}

	onBrowseFn = (nativeBrowseFn: () => void) => {
		const { setBrowseFn } = this.props;
		setBrowseFn(nativeBrowseFn);
	};

	render() {
		const { api, editorDomElement, appearance } = this.props;
		const { isPopupOpened } = this.state;

		return (
			<MediaPicker
				editorDomElement={editorDomElement}
				appearance={appearance}
				isPopupOpened={isPopupOpened}
				onBrowseFn={this.onBrowseFn}
				api={api}
			/>
		);
	}
}
