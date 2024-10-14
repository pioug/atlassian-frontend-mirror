export type ListenerFn = (args: { count: number }) => void;
export type CleanupFn = () => void;

export type OpenLayerObserverInternalAPI = {
	getCount: () => number;
	onChange: (listener: ListenerFn) => CleanupFn;
	increment: () => void;
	decrement: () => void;
};
