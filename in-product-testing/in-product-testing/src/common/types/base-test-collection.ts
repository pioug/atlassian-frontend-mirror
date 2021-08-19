// eslint-disable-next-line import/no-extraneous-dependencies
import { context } from 'local-cypress';

import { CypressType } from '../../types';

import { InProductTestCase } from './base-test-case';

export interface InProductTestCollectionOpts {
  title: string;
  testCases: InProductTestCase[];
}

export class InProductTestCollection {
  private title: string;
  private testCases: InProductTestCase[];

  public constructor(opts: InProductTestCollectionOpts) {
    this.title = opts.title;
    this.testCases = opts.testCases;
  }

  public test(cy: CypressType) {
    context(this.title, () => {
      this.testCases.forEach(testCase => {
        testCase.test(cy);
      });
    });
  }
}
