import { MediaFilmStripListItemSelector } from './filmstripView/index';

export const mediaFilmstripItemDOMSelector = (offset: number): string => {
  return `.${MediaFilmStripListItemSelector}:nth-child(${offset})`;
};
