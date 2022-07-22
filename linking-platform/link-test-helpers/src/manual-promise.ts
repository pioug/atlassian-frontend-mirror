let tmpResolve: (value: any) => void;
let tmpReject: (reason?: any) => void;

/**
 * Creates a promise where resolve can be manually executed
 */
class ManualPromise<T> extends Promise<T> {
  private _resolve: (value: T) => void = () => {};
  private _reject: (reason?: any) => void = () => {};

  constructor(private value: T) {
    super((resolve, reject) => {
      tmpResolve = resolve;
      tmpReject = reject;
    });

    this._resolve = tmpResolve;
    this._reject = tmpReject;
  }

  resolve(value?: T) {
    this._resolve(value ?? this.value);
    return this;
  }

  reject(err?: unknown) {
    this._reject(err ?? new Error('Manually rejected'));
    return this;
  }

  static get [Symbol.species]() {
    return Promise;
  }

  get [Symbol.toStringTag]() {
    return 'ManualPromise';
  }
}

export default ManualPromise;
