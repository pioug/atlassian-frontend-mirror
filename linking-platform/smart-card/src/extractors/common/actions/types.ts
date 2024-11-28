import { type JsonLd } from 'json-ld-types';

import { type AnalyticsFacade } from '../../../state/analytics';
import { type AnalyticsOrigin } from '../../../utils/types';
import { type CardActionOptions, type CardInnerAppearance } from '../../../view/Card/types';

export type ExtractActionsProps = {
	response: JsonLd.Response;
	analytics: AnalyticsFacade;
	actionOptions?: CardActionOptions;
	extensionKey?: string;
	source?: CardInnerAppearance;
	origin?: AnalyticsOrigin;
};

export interface ActionProps {
	/** String identifier for the action (e.g. 'preview-content') */
	id: string;
	/** The text to be displayed in the action's button */
	text: React.ReactNode;
	/** The function to be called on clicking the action. This is a promise so the state can transition correctly after the action finishes */
	invoke: () => Promise<any>;
}
