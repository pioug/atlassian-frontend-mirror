import React from 'react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { LinkPickerProps } from '@atlaskit/link-picker';

import { INPUT_METHOD } from '../../../analytics';
import type { ProviderFactory } from '../../../provider-factory';
import { WithProviders } from '../../../provider-factory';
import type { Command, EditorAppearance, LinkInputType, LinkPickerOptions } from '../../../types';
import type { EditorLinkPickerProps } from '../EditorLinkPicker';
import { EditorLinkPicker } from '../EditorLinkPicker';

import HyperlinkAddToolbarComp from './HyperlinkAddToolbar';

export interface HyperlinkAddToolbarProps
	extends Pick<EditorLinkPickerProps, 'onCancel' | 'invokeMethod' | 'onClose'> {
	view: EditorView;
	providerFactory: ProviderFactory;
	onSubmit: (
		href: string,
		title: string | undefined,
		displayText: string | undefined,
		inputMethod: LinkInputType,
		analytic?: UIAnalyticsEvent | null | undefined,
	) => void;
	lpLinkPicker: boolean;
	linkPickerOptions?: LinkPickerOptions;
	displayText?: string;
	displayUrl?: string;
	onEscapeCallback?: Command;
	onClickAwayCallback?: Command;
	editorAppearance?: EditorAppearance;
	inputMethod?: string;
	searchSessionId?: string;
	timesViewed?: number;
}

/**
 * Wraps around the editor's onSubmit handler so that the plugin can interface with the link picker
 */
const onSubmitInterface =
	(onSubmit: HyperlinkAddToolbarProps['onSubmit']): LinkPickerProps['onSubmit'] =>
	({ url, title, displayText, rawUrl, meta }, analytic) => {
		onSubmit(
			url,
			title ?? rawUrl,
			displayText || undefined,
			meta.inputMethod === 'manual' ? INPUT_METHOD.MANUAL : INPUT_METHOD.TYPEAHEAD,
			analytic,
		);
	};

export function HyperlinkAddToolbar({
	linkPickerOptions = {},
	onSubmit,
	displayText,
	displayUrl,
	providerFactory,
	view,
	onCancel,
	invokeMethod,
	lpLinkPicker,
	onClose,
	onEscapeCallback,
	onClickAwayCallback,
	editorAppearance,
	inputMethod,
	searchSessionId,
	timesViewed,
}: HyperlinkAddToolbarProps) {
	return (
		<WithProviders
			providers={['activityProvider', 'searchProvider']}
			providerFactory={providerFactory}
			renderNode={({ activityProvider, searchProvider }) => {
				if (lpLinkPicker) {
					return (
						<EditorLinkPicker
							view={view}
							invokeMethod={
								// Provide `invokeMethod` prop as preferred value (card plugin passes as prop) otherwise assume this
								// is being used from inside the hyperlink plugin and use inputMethod from plugin state
								invokeMethod ?? inputMethod
							}
							editorAppearance={editorAppearance}
							{...linkPickerOptions}
							url={displayUrl}
							displayText={displayText}
							onSubmit={onSubmitInterface(onSubmit)}
							onCancel={onCancel}
							onClose={onClose}
							onEscapeCallback={onEscapeCallback}
							onClickAwayCallback={onClickAwayCallback}
						/>
					);
				}

				return (
					<HyperlinkAddToolbarComp
						activityProvider={activityProvider}
						searchProvider={searchProvider}
						onSubmit={onSubmit}
						displayText={displayText}
						displayUrl={displayUrl}
						view={view}
						onEscapeCallback={onEscapeCallback}
						onClickAwayCallback={onClickAwayCallback}
						inputMethod={inputMethod}
						searchSessionId={searchSessionId}
						timesViewed={timesViewed}
					/>
				);
			}}
		/>
	);
}
