import React from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { EditorAppearance, ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';
import type { MediaPluginState } from '../../pm-plugins/types';

import { BrowserWrapper } from './BrowserWrapper';
import { ClipboardWrapper } from './ClipboardWrapper';
import { DropzoneWrapper } from './DropzoneWrapper';

type Props = {
	mediaState: MediaPluginState;
	editorDomElement: Element;
	appearance: EditorAppearance;
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
};

type State = {
	isPopupOpened: boolean;
};

type MediaPickerProps = {
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	mediaState: MediaPluginState;
	appearance: EditorAppearance;
	isPopupOpened: boolean;
	editorDomElement: Element;
	onBrowseFn: (nativeBrowseFn: () => void) => void;
};
const MediaPicker = ({
	api,
	isPopupOpened,
	appearance,
	mediaState,
	onBrowseFn,
	editorDomElement,
}: MediaPickerProps) => {
	const { focusState } = useSharedPluginState(api, ['focus']);
	const featureFlags = mediaState.mediaOptions && mediaState.mediaOptions.featureFlags;

	const editorDom = editorDomElement as HTMLElement;
	const editorParent = editorDom.parentElement ?? undefined;

	/**
	 * https://product-fabric.atlassian.net/browse/ED-21993
	 * Avoid attach paste event to same dom element,
	 * so editor-paste-plugin can use stopPropagation,
	 * as stopImmediatePropagation could cause race condition issues
	 */
	const container = editorParent;

	const clipboard = focusState?.hasFocus ? (
		<ClipboardWrapper mediaState={mediaState} featureFlags={featureFlags} container={container} />
	) : null;

	return (
		<>
			{clipboard}
			<DropzoneWrapper
				mediaState={mediaState}
				isActive={!isPopupOpened}
				featureFlags={featureFlags}
				editorDomElement={editorDomElement}
				appearance={appearance}
			/>
			<BrowserWrapper onBrowseFn={onBrowseFn} mediaState={mediaState} featureFlags={featureFlags} />
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
		const { mediaState } = this.props;
		mediaState.onPopupToggle((isPopupOpened) => {
			this.setState({
				isPopupOpened,
			});
		});
	}

	onBrowseFn = (nativeBrowseFn: () => void) => {
		const { mediaState } = this.props;
		mediaState && mediaState.setBrowseFn(nativeBrowseFn);
	};

	render() {
		const { api, mediaState, editorDomElement, appearance } = this.props;
		const { isPopupOpened } = this.state;

		return (
			<MediaPicker
				mediaState={mediaState}
				editorDomElement={editorDomElement}
				appearance={appearance}
				isPopupOpened={isPopupOpened}
				onBrowseFn={this.onBrowseFn}
				api={api}
			/>
		);
	}
}
