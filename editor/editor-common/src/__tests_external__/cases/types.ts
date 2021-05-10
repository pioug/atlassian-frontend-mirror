export interface TestCaseOpts {
  ui?: {
    /* DOM selector of the publish button */
    publishButton?: string;
  };

  auth?: {
    cookie: string;
  };

  runOnly?: string[];
}
