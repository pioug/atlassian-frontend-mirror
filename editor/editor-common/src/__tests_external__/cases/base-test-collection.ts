import { EditorTestCase } from './base-test-case';

export interface EditorTestCollectionOpts {
  title: string;
  testCases: EditorTestCase[];
}

export class EditorTestCollection {
  private title: string;
  private testCases: EditorTestCase[];

  public constructor(opts: EditorTestCollectionOpts) {
    this.title = opts.title;
    this.testCases = opts.testCases;
  }

  public test(cy: Cypress.cy) {
    context(this.title, () => {
      this.testCases.forEach(testCase => {
        testCase.test(cy);
      });
    });
  }
}
