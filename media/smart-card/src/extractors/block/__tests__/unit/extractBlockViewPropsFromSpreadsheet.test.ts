import { spreadsheet } from './_fixtures';
import { createTestsForSpreadsheet } from './_createTestsForSpreadsheet';
import { extractPropsFromSpreadsheet } from '../../extractPropsFromSpreadsheet';

describe('extractPropsFromSpreadsheet()', () => {
  createTestsForSpreadsheet(
    'spreadsheet',
    spreadsheet,
    extractPropsFromSpreadsheet,
  );
});
