import React from 'react';

import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { EditorAppearance, ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';

import { BrowserWrapper } from './BrowserWrapper';
import { ClipboardWrapper } from './ClipboardWrapper';
import { DropzoneWrapper } from './DropzoneWrapper';

type Props = {
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	appearance: EditorAppearance;
	editorDomElement: Element;
	onPopupToggle: (onPopupToggle: (isPopupOpened: boolean) => void) => void;
	setBrowseFn: (nativeBrowseFn: () => void) => void;
};

type State = {
	isPopupOpened: boolean;
};

type MediaPickerProps = {
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	appearance: EditorAppearance;
	editorDomElement: Element;
	isPopupOpened: boolean;
	onBrowseFn: (nativeBrowseFn: () => void) => void;
};

const selector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<MediaNextEditorPluginType>,
		'focus' | 'connectivity' | 'media'
	>,
) => {
	return {
		hasFocus: states.focusState?.hasFocus,
		connectivityMode: states.connectivityState?.mode,
		mediaOptions: states.mediaState?.mediaOptions,
	};
};

const MediaPicker = ({
	api,
	isPopupOpened,
	appearance,
	onBrowseFn,
	editorDomElement,
}: MediaPickerProps) => {
	const { hasFocus, connectivityMode, mediaOptions } = useSharedPluginStateWithSelector(
		api,
		['focus', 'connectivity', 'media'],
		selector,
	);
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

	componentDidMount(): void {
		const { onPopupToggle } = this.props;
		onPopupToggle((isPopupOpened) => {
			this.setState({
				isPopupOpened,
			});
		});
	}

	onBrowseFn = (nativeBrowseFn: () => void): void => {
		const { setBrowseFn } = this.props;
		setBrowseFn(nativeBrowseFn);
	};

	render(): React.JSX.Element {
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
