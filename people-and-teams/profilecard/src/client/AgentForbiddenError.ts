export class AgentForbiddenError extends Error {
	status = 403;
	constructor() {
		super('Agent access forbidden');
		this.name = 'AgentForbiddenError';
	}
}
