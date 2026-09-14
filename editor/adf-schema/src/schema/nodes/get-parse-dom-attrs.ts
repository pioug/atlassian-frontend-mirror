import { uuid } from '../../utils/uuid';
import { PanelType } from './panel';

type ParseDOMAttrs = {
	localId?: string;
	panelColor?: string;
	panelIcon?: string;
	panelIconId?: string;
	panelIconText?: string;
	panelType: string;
};

export const getParseDOMAttrs = (
	allowCustomPanel: boolean,
	dom: string | globalThis.Node,
	generateLocalId?: boolean,
): ParseDOMAttrs => {
	let parseDOMAttrs: ParseDOMAttrs = {
		// eslint-disable-next-line @atlaskit/editor/no-as-casting, @typescript-eslint/no-non-null-assertion
		panelType: (dom as HTMLElement).getAttribute('data-panel-type')!,
	};

	if (generateLocalId) {
		parseDOMAttrs.localId = uuid.generate();
	}

	if (allowCustomPanel) {
		parseDOMAttrs = {
			...parseDOMAttrs,
			// eslint-disable-next-line @atlaskit/editor/no-as-casting, @typescript-eslint/no-non-null-assertion
			panelIcon: (dom as HTMLElement).getAttribute('data-panel-icon')!,
			// eslint-disable-next-line @atlaskit/editor/no-as-casting, @typescript-eslint/no-non-null-assertion
			panelIconId: (dom as HTMLElement).getAttribute('data-panel-icon-id')!,
			// eslint-disable-next-line @atlaskit/editor/no-as-casting, @typescript-eslint/no-non-null-assertion
			panelIconText: (dom as HTMLElement).getAttribute('data-panel-icon-text')!,
			// eslint-disable-next-line @atlaskit/editor/no-as-casting, @typescript-eslint/no-non-null-assertion
			panelColor: (dom as HTMLElement).getAttribute('data-panel-color')!,
		};
	} else {
		parseDOMAttrs.panelType =
			parseDOMAttrs.panelType === PanelType.CUSTOM ? PanelType.INFO : parseDOMAttrs.panelType;
	}

	return parseDOMAttrs;
};
