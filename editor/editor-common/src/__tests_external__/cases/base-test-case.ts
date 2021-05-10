import { TestCaseOpts } from './types';

interface EditorTestCaseOpts {
  title: string;
  assertions: (cy: Cypress.cy) => void;
  id: string;
  testOptions?: TestCaseOpts;
}

export class EditorTestCase {
  private _title: string;
  private _assertions: (cy: Cypress.cy) => void;
  private _id: string;
  private _testOptions?: TestCaseOpts;

  public constructor(opts: EditorTestCaseOpts) {
    this._title = opts.title;
    this._assertions = opts.assertions;
    this._id = opts.id;
    this._testOptions = opts.testOptions;
  }

  public get assertions() {
    return this._assertions;
  }

  private shouldSkipTest() {
    return (
      this._testOptions &&
      Array.isArray(this._testOptions.runOnly) &&
      !this._testOptions.runOnly.includes(this._id)
    );
  }

  public test(cy: Cypress.cy) {
    if (this.shouldSkipTest()) {
      return;
    }
    it(this._title, () => {
      this._assertions(cy);
    });
  }
}
