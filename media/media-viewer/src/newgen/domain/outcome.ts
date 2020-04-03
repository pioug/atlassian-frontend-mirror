export type PendingState = {
  status: 'PENDING';
};

export type SuccessfulState<Data> = {
  status: 'SUCCESSFUL';
  data: Data;
};

export type FailedState<Err> = {
  status: 'FAILED';
  err: Err;
};

export type State<Data, Err> =
  | PendingState
  | SuccessfulState<Data>
  | FailedState<Err>;

export class Outcome<Data, Err = Error> {
  private constructor(private readonly state: State<Data, Err>) {}

  static successful<Data, Err>(data: Data): Outcome<Data, Err> {
    return new Outcome({ status: 'SUCCESSFUL', data });
  }

  static pending<Data, Err>(): Outcome<Data, Err> {
    return new Outcome({ status: 'PENDING' });
  }

  static failed<Data, Err>(err: Err): Outcome<Data, Err> {
    return new Outcome({ status: 'FAILED', err });
  }

  get status(): 'PENDING' | 'SUCCESSFUL' | 'FAILED' {
    return this.state.status;
  }

  get data(): Data | undefined {
    if (this.state.status === 'SUCCESSFUL') {
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
    failed: (err: Err) => Result;
  }): Result {
    switch (this.state.status) {
      case 'SUCCESSFUL':
        return successful(this.state.data);
      case 'PENDING':
        return pending();
      case 'FAILED':
        return failed(this.state.err);
    }
  }

  mapSuccessful<MappedData>(
    map: (data: Data) => MappedData,
  ): Outcome<MappedData, Err> {
    if (this.state.status === 'SUCCESSFUL') {
      return Outcome.successful(map(this.state.data));
    } else {
      return new Outcome<MappedData, Err>(this.state);
    }
  }

  mapFailed<MappedErr>(map: (err: Err) => MappedErr): Outcome<Data, MappedErr> {
    if (this.state.status === 'FAILED') {
      return Outcome.failed(map(this.state.err));
    } else {
      return new Outcome(this.state);
    }
  }
}
