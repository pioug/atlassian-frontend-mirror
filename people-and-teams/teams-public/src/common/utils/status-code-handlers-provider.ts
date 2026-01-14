/**
 * Our REST clients are initialised when their module loads which makes it tricky for them to consume the `statusCodeHandlers` prop passed to App from the host application.
 * This is a temporary measure to enable the clients to consume `statusCodeHandlers`.
 * The long term solution is to replace our REST clients with Apollo client custom resolvers
 * This will unify all remote data handling under the apollo-client module which is able to easily receive `statusCodeHandlers` as it is initialised within the React portion of our app.
 */

type StatusCodeHandler = (response: Response) => void;
export interface StatusCodeHandlerMap {
	[statusCode: number]: StatusCodeHandler;
}

export const statusCodeHandlersProvider = {
	handlers: {} as StatusCodeHandlerMap,

	get(): StatusCodeHandlerMap {
		return statusCodeHandlersProvider.handlers;
	},

	setHandlers(handlers: StatusCodeHandlerMap): void {
		statusCodeHandlersProvider.handlers = handlers;
	},
};

export function handleResponse(response: Response): void {
	const { status } = response;
	const handler = statusCodeHandlersProvider.get()[status];
	if (typeof handler === 'function') {
		handler(response);
	}
}
