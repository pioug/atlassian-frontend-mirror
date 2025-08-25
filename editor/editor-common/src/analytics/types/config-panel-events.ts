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
		browserInfo: string;
		error: string;
		errorInfo?: {
			componentStack: string;
		};
		errorStack?: string;
		extensionKey: string;
		fields: string;
		product: string;
	},
	undefined
>;

export type ConfigPanelEventPayload = OpenAEP | CloseAEP | ConfigPanelCrashedAEP;
