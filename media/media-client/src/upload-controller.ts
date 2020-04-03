export type AbortFunction = () => void;

export class UploadController {
  abortFunction?: AbortFunction;

  constructor() {}

  setAbort(abortFunction: AbortFunction) {
    this.abortFunction = abortFunction;
  }

  abort() {
    if (this.abortFunction) {
      this.abortFunction();
    }
  }
}
