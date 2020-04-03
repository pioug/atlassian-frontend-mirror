import { document } from './_fixtures';
import { createTestsForDocument } from './_createTestsForDocument';
import { extractPropsFromDocument } from '../../extractPropsFromDocument';

describe('extractPropsFromDocument()', () => {
  createTestsForDocument('document', document, extractPropsFromDocument);
});
