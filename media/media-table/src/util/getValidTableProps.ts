// eslint-disable-next-line import/no-extraneous-dependencies
import memoizeOne from 'memoize-one';
import { ValidatedProps } from '../types';

const DEFAULT_ITEMS_PER_PAGE = 6;

const getValidTableProps = (
  itemsCount: number,
  itemsPerPage?: number,
  pageNumber?: number,
  totalItems?: number,
): ValidatedProps => {
  let validItemsPerPage = itemsPerPage || DEFAULT_ITEMS_PER_PAGE;
  let validTotalItems = totalItems || itemsCount;
  let validPageNumber = pageNumber || 1;

  if (validItemsPerPage < 0) {
    validItemsPerPage = DEFAULT_ITEMS_PER_PAGE;
    // eslint-disable-next-line no-console
    console.warn(
      'Invalid itemsPerPage prop provided to MediaTable. Setting value to default.',
    );
  }

  if (validTotalItems < 0) {
    validTotalItems = itemsCount;
    // eslint-disable-next-line no-console
    console.warn(
      'Invalid totalItems prop provided to MediaTable. Defaulting to length of items array.',
    );
  }

  if (validPageNumber < 0) {
    validPageNumber = 1;
    // eslint-disable-next-line no-console
    console.warn(
      'Invalid pageNumber prop provided to MediaTable. Defaulting to first page.',
    );
  } else {
    const totalPages = Math.ceil(validTotalItems / validItemsPerPage);

    if (validPageNumber > totalPages) {
      validPageNumber = totalPages;
      // eslint-disable-next-line no-console
      console.warn(
        'Invalid pageNumber prop provided to MediaTable. Defaulting to last page.',
      );
    }
  }

  return {
    validPageNumber,
    validTotalItems,
    validItemsPerPage,
  };
};

export default memoizeOne(getValidTableProps);
