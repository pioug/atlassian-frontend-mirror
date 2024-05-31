/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import type { AnnotationProviders as EditorAnnotationProviders } from '@atlaskit/editor-plugins/annotation';

import type EditorActions from '../../src/actions';
import type { EditorAppearance, EditorPlugin, EditorProps } from '../../src/types';

import { PopUps, popupWrapper } from './kitchen-sink-styles';
import { KitchenSinkToolbar } from './kitchen-sink-toolbar';
import { ValidatingKitchenSinkEditor } from './validating-kitchen-sink-editor';

type Theme = 'light' | 'dark';

export interface KitchenSinkEditorProps {
	locale: string;
	theme: Theme;
	actions: EditorActions;
	adf: any;
	disabled: boolean;
	sanitizePrivateContent: boolean;
	appearance: EditorAppearance;
	extensionProviders: EditorProps['extensionProviders'];
	popupMountPoint: HTMLElement | null | undefined;
	setPopupRef(ref: HTMLDivElement): void;
	onDocumentChanged(adf: any): void;
	onDocumentValidated(): void;
	loadLocale(locale: string): void;
	featureFlags: EditorProps['featureFlags'];
	editorPlugins?: EditorPlugin[];
	editorAnnotationProviders: EditorAnnotationProviders;
}

export const KitchenSinkEditor = React.memo((props: KitchenSinkEditorProps) => {
	const { actions, locale, loadLocale } = props;

	const primaryToolbarComponents = React.useMemo(
		() => <KitchenSinkToolbar actions={actions} locale={locale} loadLocale={loadLocale} />,
		[actions, locale, loadLocale],
	);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		<div css={popupWrapper} className="popups-wrapper">
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<PopUps ref={props.setPopupRef} className="popups" />
			<ValidatingKitchenSinkEditor
				actions={props.actions}
				adf={props.adf}
				disabled={props.disabled}
				appearance={props.appearance}
				sanitizePrivateContent={props.sanitizePrivateContent}
				popupMountPoint={props.popupMountPoint || undefined}
				onDocumentChanged={props.onDocumentChanged}
				onDocumentValidated={props.onDocumentValidated}
				extensionProviders={props.extensionProviders}
				primaryToolbarComponents={primaryToolbarComponents}
				featureFlags={props.featureFlags}
				editorPlugins={props.editorPlugins}
				editorAnnotationProviders={props.editorAnnotationProviders}
			/>
		</div>
	);
});
