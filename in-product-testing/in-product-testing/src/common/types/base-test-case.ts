import { CypressType, InProductCommonTestCaseOpts } from '../../types';

interface InProductTestCaseOpts<
  TestCaseOpts extends InProductCommonTestCaseOpts = any
> {
  id: string;
  title: string;
  assertions: (cy: CypressType) => void;
  testOptions?: TestCaseOpts;
  precondition?: () => boolean;
}

export class InProductTestCase {
  private _title: string;
  private _precondition?: () => boolean;
  private _assertions: (cy: CypressType) => void;
  private _id: string;
  private _testOptions?: InProductCommonTestCaseOpts;

  public constructor(opts: InProductTestCaseOpts) {
    this._id = opts.id;
    this._title = opts.title;
    this._assertions = opts.assertions;
    this._testOptions = opts.testOptions;
  }

  public get assertions() {
    if (this._precondition) {
      const succeeded = this._precondition();
      if (!succeeded) {
        throw new Error(
          `Test execution for ${this._id} failed. You failed a precondition! 😱`,
        );
      }
    }
    return this._assertions;
  }

  private shouldSkipTest() {
    const runOnly = this._testOptions?.runOnly;
    if (runOnly) {
      if (!Array.isArray(runOnly)) {
        throw new Error('TestOpts.runOnly should be an array of IDs 🙀.');
      }
      // Skip test if in list of IDs or do not (if it is not present).
      return runOnly.includes(this._id);
    }
    // By default, if not specified, don't skip any tests.
    return false;
  }

  public test(cy: CypressType) {
    if (!this.shouldSkipTest()) {
      it(this._title, () => {
        this._assertions(cy);
      });
    }
  }
}
