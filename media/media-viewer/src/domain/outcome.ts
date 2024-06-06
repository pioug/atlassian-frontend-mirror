export type PendingState = {
	status: 'PENDING';
};

export type SuccessfulState<Data> = {
	status: 'SUCCESSFUL';
	data: Data;
};

export type FailedState<Err, Data> = {
	status: 'FAILED';
	err: Err;
	data?: Data;
};

export type State<Data, Err> = PendingState | SuccessfulState<Data> | FailedState<Err, Data>;

export class Outcome<Data, Err = Error> {
	private constructor(private readonly state: State<Data, Err>) {}

	static successful<Data, Err>(data: Data): Outcome<Data, Err> {
		return new Outcome({ status: 'SUCCESSFUL', data });
	}

	static pending<Data, Err>(): Outcome<Data, Err> {
		return new Outcome({ status: 'PENDING' });
	}

	static failed<Data, Err>(err: Err, data?: Data): Outcome<Data, Err> {
		return new Outcome({ status: 'FAILED', err, data });
	}

	get status(): 'PENDING' | 'SUCCESSFUL' | 'FAILED' {
		return this.state.status;
	}

	get data(): Data | undefined {
		if (this.state.status === 'SUCCESSFUL' || this.state.status === 'FAILED') {
			return this.state.data;
		} else {
			return;
		}
	}

	get err(): Err | undefined {
		if (this.state.status === 'FAILED') {
			return this.state.err;
		} else {
			return;
		}
	}

	whenSuccessful(successful: (data: Data) => void): void {
		if (this.state.status === 'SUCCESSFUL') {
			successful(this.state.data);
		}
	}

	whenPending(pending: () => void): void {
		if (this.state.status === 'PENDING') {
			pending();
		}
	}

	whenFailed(failed: (err: Err) => void): void {
		if (this.state.status === 'FAILED') {
			failed(this.state.err);
		}
	}

	match<Result>({
		successful,
		pending,
		failed,
	}: {
		successful: (data: Data) => Result;
		pending: () => Result;
		failed: (err: Err, data?: Data) => Result;
	}): Result {
		switch (this.state.status) {
			case 'SUCCESSFUL':
				return successful(this.state.data);
			case 'PENDING':
				return pending();
			case 'FAILED':
				return failed(this.state.err, this.state.data);
		}
	}
}
