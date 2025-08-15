export interface AuditLogEventData {
	id: string;
	type: string;
	message: string;
	attributes: {
		action: string;
		actor: {
			id: string | null;
			name: string | null;
			email: string | null;
			picture: string | null;
			links: {
				alt: string | null;
				self: string | null;
			} | null;
		} | null;
		location: {
			ip: string | null;
			city: string | null;
		} | null;
		time: string;
	};
}

export interface AuditLogsSidePanelProps {
	/**
	 * The audit log event data to display
	 */
	event: AuditLogEventData | undefined;
}
