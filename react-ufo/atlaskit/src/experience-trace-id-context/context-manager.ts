import { type Context, type ContextManager, ROOT_CONTEXT } from '@opentelemetry/api';

/**
 * We need to store a reference to the Context manager so that we can get it later.
 * This is because the OTel JS API doesn't allow us to get the registered context manager,
 * and we need to get it because we need to call a function that's not available in the OTel API:
 * `setActive`. The OTel JS API design doesn't allow us to manually set the active context
 * despite the spec allowing for the capability. Sigh.
 * 
 * I imagine this situation might not be permanent if we can move to a system were we can rely
 * solely on the API, but for the purposes of the first change being React UFO API compatible,
 * we'll need to do this.
 */

let contextManager: ContextManager

export function setContextManager(ctxMgr: ContextManager): void {
    contextManager = ctxMgr;
}

export function getContextManager(): ContextManager {
    return contextManager;
}

/** 
 * The below is shamelessly borrowed from StackContextManager from @opentelemetry/sdk-trace-web
 * Using this rather than importing the entire package because this is all we need for now
 */

/**
 * UFO Context Manager for managing the state in web
 * it doesn't fully support the async calls though
 */
export class UFOContextManager implements ContextManager {
    /**
     * whether the context manager is enabled or not
     */
    private _enabled = false;

    /**
     * Keeps the reference to current context
     */
    public _currentContext = ROOT_CONTEXT;

    /**
     *
     * @param context
     * @param target Function to be executed within the context
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    private _bindFunction<T extends Function>(
        context = ROOT_CONTEXT,
        target: T
    ): T {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const manager = this;
        const contextWrapper = function (this: unknown, ...args: unknown[]) {
            return manager.with(context, () => target.apply(this, args));
        };
        Object.defineProperty(contextWrapper, 'length', {
            enumerable: false,
            configurable: true,
            writable: false,
            value: target.length,
        });
        return contextWrapper as unknown as T;
    }

    /**
     * Returns the active context
     */
    active(): Context {
        return this._currentContext;
    }

    /**
     * Binds a the certain context or the active one to the target function and then returns the target
     * @param context A context (span) to be bind to target
     * @param target a function or event emitter. When target or one of its callbacks is called,
     *  the provided context will be used as the active context for the duration of the call.
     */
    bind<T>(context: Context, target: T): T {
        // if no specific context to propagate is given, we use the current one
        if (context === undefined) {
            context = this.active();
        }
        if (typeof target === 'function') {
            return this._bindFunction(context, target);
        }
        return target;
    }

    /**
     * Disable the context manager (clears the current context)
     */
    disable(): this {
        this._currentContext = ROOT_CONTEXT;
        this._enabled = false;
        return this;
    }

    /**
     * Enables the context manager and creates a default(root) context
     */
    enable(): this {
        if (this._enabled) {
            return this;
        }
        this._enabled = true;
        this._currentContext = ROOT_CONTEXT;
        return this;
    }

    /**
     * Calls the callback function [fn] with the provided [context]. If [context] is undefined then it will use the window.
     * The context will be set as active
     * @param context
     * @param fn Callback function
     * @param thisArg optional receiver to be used for calling fn
     * @param args optional arguments forwarded to fn
     */
    with<A extends unknown[], F extends (...args: A) => ReturnType<F>>(
        context: Context | null,
        fn: F,
        thisArg?: ThisParameterType<F>,
        ...args: A
    ): ReturnType<F> {
        const previousContext = this._currentContext;
        this._currentContext = context || ROOT_CONTEXT;

        try {
            return fn.call(thisArg, ...args);
        } finally {
            this._currentContext = previousContext;
        }
    }

    /**
     * Sets the active context.
     * This function is an extension of the OTel spec, in order to facilitate the current API of React UFO trace context handling.
     * It doesn't keep track of any previously set active contexts, because it's assumed (for now) that only one trace context
     * will ever exist at a time.
     * The next step in the work to improve tracing in the FE will likely remove this function as we need to track the 
     * hierarchy of contexts (likely using the `with()` function above).
     * @param context The context to be made the globally active one 
     */
    setActive(context: Context): void {
        if (this._enabled) {
            this._currentContext = context;
        }
    }
}