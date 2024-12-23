import React from 'react';

import { ReactEditorViewContext } from '../../ui-react';

import { ColorPaletteArrowKeyNavigationProvider } from './ColorPaletteArrowKeyNavigationProvider';
import { MenuArrowKeyNavigationProvider } from './MenuArrowKeyNavigationProvider';
import type { ArrowKeyNavigationProviderProps } from './types';
import { ArrowKeyNavigationType } from './types';

export const ArrowKeyNavigationProvider = (
	props: React.PropsWithChildren<ArrowKeyNavigationProviderProps>,
) => {
	const { children, type, ...restProps } = props;

	if (type === ArrowKeyNavigationType.COLOR) {
		return (
			<ReactEditorViewContext.Consumer>
				{({ popupsMountPoint, editorView, editorRef }) =>
					editorRef && (
						<ColorPaletteArrowKeyNavigationProvider
							selectedRowIndex={props.selectedRowIndex}
							selectedColumnIndex={props.selectedColumnIndex}
							isOpenedByKeyboard={props.isOpenedByKeyboard}
							isPopupPositioned={props.isPopupPositioned}
							editorRef={editorRef}
							popupsMountPoint={popupsMountPoint}
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...restProps}
						>
							{children}
						</ColorPaletteArrowKeyNavigationProvider>
					)
				}
			</ReactEditorViewContext.Consumer>
		);
	}
	return (
		<ReactEditorViewContext.Consumer>
			{({ popupsMountPoint, editorView, editorRef }) =>
				editorRef && (
					<MenuArrowKeyNavigationProvider
						editorRef={editorRef}
						popupsMountPoint={popupsMountPoint}
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...restProps}
					>
						{children}
					</MenuArrowKeyNavigationProvider>
				)
			}
		</ReactEditorViewContext.Consumer>
	);
};
