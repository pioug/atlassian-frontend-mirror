import { type ACTION, type ACTION_SUBJECT } from './enums';
import { type UIAEP } from './utils';

type OpenAEP = UIAEP<
	ACTION.OPENED,
	ACTION_SUBJECT.CONFIG_PANEL,
	undefined,
	{ extensionKey?: string; extensionType?: string },
	undefined
>;

type CloseAEP = UIAEP<
	ACTION.CLOSED,
	ACTION_SUBJECT.CONFIG_PANEL,
	undefined,
	{ extensionKey?: string; extensionType?: string },
	undefined
>;

type ConfigPanelCrashedAEP = UIAEP<
	ACTION.ERRORED,
	ACTION_SUBJECT.CONFIG_PANEL,
	undefined,
	{
		product: string;
		browserInfo: string;
		extensionKey: string;
		fields: string;
		error: string;
		errorInfo?: {
			componentStack: string;
		};
		errorStack?: string;
	},
	undefined
>;

export type ConfigPanelEventPayload = OpenAEP | CloseAEP | ConfigPanelCrashedAEP;
