import React from 'react';

import type { IntlShape } from 'react-intl-next';
import { IntlProvider } from 'react-intl-next';
import uuid from 'uuid';
import { keyName as keyNameNormalized } from 'w3c-keyname';

import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { redo, undo } from '@atlaskit/editor-prosemirror/history';
import type { ReadonlyTransaction, Transaction } from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { B400 } from '@atlaskit/theme/colors';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import type { TypeAheadPlugin } from '../typeAheadPluginType';
import type {
	CreateTypeAheadDecorations,
	PopupMountPointReference,
	RemoveTypeAheadDecorations,
} from '../types';
import { WrapperTypeAhead } from '../ui/WrapperTypeAhead';

import { closeTypeAhead } from './commands/close-type-ahead';
import { TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE, TYPE_AHEAD_DECORATION_KEY } from './constants';
import { StatsModifier } from './stats-modifier';
import { getTypeAheadQuery } from './utils';

type FactoryProps = {
	intl: IntlShape;
	popupMountRef: PopupMountPointReference;
	nodeViewPortalProviderAPI: PortalProviderAPI;
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined;
};

type FactoryReturn = {
	createDecorations: CreateTypeAheadDecorations;
	removeDecorations: RemoveTypeAheadDecorations;
};

export const factoryDecorations = ({
	intl,
	popupMountRef,
	nodeViewPortalProviderAPI,
	api,
}: FactoryProps): FactoryReturn => {
	const createDecorations: CreateTypeAheadDecorations = (
		tr: ReadonlyTransaction,
		{ triggerHandler, inputMethod, reopenQuery },
	) => {
		const { selection } = tr;

		if (!(selection instanceof TextSelection) || !selection.$cursor) {
			return {
				decorationSet: DecorationSet.empty,
				stats: null,
				decorationElement: null,
			};
		}

		const decorationId = `decoration_id_${TYPE_AHEAD_DECORATION_KEY}_${uuid()}`;
		const { $cursor } = selection;

		const typeaheadComponent = document.createElement('mark');
		const stats = new StatsModifier();

		let shouldFocusCursorInsideQuery = true;
		const deco = Decoration.widget(
			$cursor.pos,
			(editorView: EditorView, getDecorationPositionUnsafe: () => number | undefined) => {
				const getDecorationPosition = () => {
					try {
						return getDecorationPositionUnsafe();
					} catch (e) {
						return undefined;
					}
				};
				typeaheadComponent.setAttribute('id', decorationId);
				typeaheadComponent.setAttribute('role', 'search');

				typeaheadComponent.dataset.typeAheadQuery = 'true';
				typeaheadComponent.dataset.trigger = triggerHandler.trigger;

				// This line below seems weird,
				// we need that cuz the clickAreaHelper
				// will try to hijack any click event coming
				// from the inside of the Editor
				// packages/editor/editor-core/src/ui/Addon/click-area-helper.ts
				typeaheadComponent.dataset.editorPopup = 'true';
				typeaheadComponent.dataset.typeAhead = TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE;

				typeaheadComponent.style.color = token('color.text.accent.blue', B400);
				typeaheadComponent.style.backgroundColor = 'transparent';

				if (editorExperiment('platform_editor_insertion', 'variant1')) {
					// As part of controls work, we add placeholder `Search` to quick insert command
					// This style is to prevent `/Search` being wrapped if it's triggered at the end of the line
					typeaheadComponent.style.whiteSpace = 'nowrap';
				}

				const onUndoRedo = (inputType: 'historyUndo' | 'historyRedo'): boolean => {
					if (!['historyUndo', 'historyRedo'].includes(inputType)) {
						return false;
					}

					const hasReopenQuery = typeof reopenQuery === 'string' && reopenQuery.trim().length > 0;
					const currentQuery = getTypeAheadQuery(editorView.state);

					if (hasReopenQuery || currentQuery?.length === 0) {
						const command = inputType === 'historyUndo' ? undo : redo;
						let tr = editorView.state.tr;
						const fakeDispatch = (customTr: Transaction) => {
							tr = customTr;
						};

						const result = command(editorView.state, fakeDispatch);

						if (result) {
							closeTypeAhead(tr);
							editorView.dispatch(tr);
							editorView.focus();
						}

						return result;
					}
					return false;
				};

				nodeViewPortalProviderAPI.render(
					() => (
						<IntlProvider
							locale={intl.locale || 'en'}
							messages={intl.messages}
							formats={intl.formats}
						>
							<WrapperTypeAhead
								triggerHandler={triggerHandler}
								editorView={editorView}
								anchorElement={typeaheadComponent}
								inputMethod={inputMethod}
								getDecorationPosition={getDecorationPosition}
								shouldFocusCursorInsideQuery={shouldFocusCursorInsideQuery}
								popupsMountPoint={popupMountRef.current?.popupsMountPoint}
								popupsBoundariesElement={popupMountRef.current?.popupsBoundariesElement}
								popupsScrollableElement={popupMountRef.current?.popupsScrollableElement}
								onUndoRedo={onUndoRedo}
								reopenQuery={reopenQuery}
								api={api}
							/>
						</IntlProvider>
					),
					typeaheadComponent,
					decorationId,
				);

				shouldFocusCursorInsideQuery = false;
				return typeaheadComponent;
			},
			{
				isTypeAheadDecoration: true,
				key: decorationId,
				side: 0,
				stopEvent: (e) => {
					const key = keyNameNormalized(e);
					const sel = document.getSelection();
					if ('ArrowLeft' === key && sel?.anchorOffset === 0) {
						return false;
					}

					return true;
				},
				ignoreSelection: false,
			},
		);

		return {
			decorationSet: DecorationSet.create(tr.doc, [deco]),
			decorationElement: typeaheadComponent,
			stats,
		};
	};

	const removeDecorations: RemoveTypeAheadDecorations = (decorationSet?: DecorationSet) => {
		if (!decorationSet || decorationSet === DecorationSet.empty) {
			return false;
		}

		const typeAheadDecorations = decorationSet.find(undefined, undefined, (spec) => {
			return spec.isTypeAheadDecoration;
		});

		if (!typeAheadDecorations || typeAheadDecorations.length === 0) {
			return false;
		}

		typeAheadDecorations.forEach(({ spec }: Decoration) => {
			if (!spec.key) {
				return;
			}
			const decoElement = document.querySelector(`#${spec.key}`);

			if (!decoElement) {
				return;
			}
			nodeViewPortalProviderAPI.remove(spec.key);
		});

		return true;
	};

	return {
		createDecorations,
		removeDecorations,
	};
};
