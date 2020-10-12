import { collaborationGraphClient } from './collaboratioGraphClient';
import { getSearchClient } from './searchClient';
import {
  SearchContext,
  CollaborationGraphContext,
  ProductType,
} from '../types';

export const client = (
  product: ProductType,
  context: SearchContext,
  contextType: string,
  maxRequestOptions: number,
  query?: string,
) => {
  if (!query) {
    const collabGraphContext: CollaborationGraphContext = {
      ...context,
      contextType,
    };
    return collaborationGraphClient(
      collabGraphContext,
      product,
      maxRequestOptions,
    );
  }

  const searchClient = getSearchClient(product);
  return searchClient(query, context, maxRequestOptions);
};
