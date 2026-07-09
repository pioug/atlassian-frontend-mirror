import type {
	AsyncHiddenContext,
	RegisterComponent,
} from '@atlaskit/editor-ui-control-model/types';

/** How long to wait for each `isAsyncHidden` check before treating it as hidden. */
export const ASYNC_HIDDEN_TIMEOUT_MS = 3000;

type AsyncHiddenComponent = RegisterComponent & Required<Pick<RegisterComponent, 'isAsyncHidden'>>;

type AsyncHiddenResult = {
	hidden: boolean;
	key: string;
};

export type AsyncHiddenResults = Record<string, boolean>;

const hasAsyncHidden = (component: RegisterComponent): component is AsyncHiddenComponent =>
	typeof component.isAsyncHidden === 'function';

const rejectOnTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	const timeoutPromise = new Promise<never>((_, reject) => {
		timeoutId = setTimeout(() => reject(new Error('isAsyncHidden timeout')), timeoutMs);
	});
	return Promise.race([
		promise.finally(() => {
			if (timeoutId !== undefined) {
				clearTimeout(timeoutId);
			}
		}),
		timeoutPromise,
	]);
};

const evaluateComponentAsyncHidden = async (
	component: AsyncHiddenComponent,
	context: AsyncHiddenContext,
): Promise<AsyncHiddenResult> => {
	try {
		const hidden = await rejectOnTimeout(component.isAsyncHidden(context), ASYNC_HIDDEN_TIMEOUT_MS);
		return { key: component.key, hidden };
	} catch {
		return { key: component.key, hidden: true };
	}
};

/**
 * Evaluates all `isAsyncHidden` functions in parallel.
 * Each check is raced against a timeout; timeouts and errors are hidden.
 *
 * Returns a plain object that maps each component key to its hidden state.
 * Components without `isAsyncHidden` are not present in the result.
 */
export async function evaluateAsyncHidden(
	components: RegisterComponent[],
	context: AsyncHiddenContext,
): Promise<AsyncHiddenResults> {
	const results = await Promise.all(
		components
			.filter(hasAsyncHidden)
			.map((component) => evaluateComponentAsyncHidden(component, context)),
	);

	return Object.fromEntries(results.map(({ key, hidden }) => [key, hidden]));
}
