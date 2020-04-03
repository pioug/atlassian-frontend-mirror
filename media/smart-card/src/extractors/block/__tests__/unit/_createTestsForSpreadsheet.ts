import { createTestsForDocument } from './_createTestsForDocument';

export function createTestsForSpreadsheet(
  type: string,
  fixture: any,
  extractor: Function,
) {
  createTestsForDocument(type, fixture, extractor);
}
