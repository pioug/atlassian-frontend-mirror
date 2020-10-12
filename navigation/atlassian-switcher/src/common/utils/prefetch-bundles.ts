import { Product } from '../../types';
import {
  loadAtlassianSwitcher,
  loadJiraSwitcher,
  loadConfluenceSwitcher,
  loadGenericSwitcher,
} from '../../ui/components/loaders';

export default (product?: string) => {
  loadAtlassianSwitcher();

  if (product === Product.JIRA) {
    return loadJiraSwitcher();
  }

  if (product === Product.CONFLUENCE) {
    return loadConfluenceSwitcher();
  }

  return loadGenericSwitcher();
};
