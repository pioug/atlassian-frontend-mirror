import cardInsideInfoPanel from '../__fixtures__/card-inside-info-panel.adf.json';
import cardInsideExpand from '../__fixtures__/card-inside-expand.adf.json';
import cardInsideExpandWithText from '../__fixtures__/card-inside-expand-with-text.adf.json';
import cardInsideDecision from '../__fixtures__/card-inside-decision.adf.json';
import cardInsideQuote from '../__fixtures__/card-inside-quote.adf.json';
import cardInsideList from '../__fixtures__/card-inside-list.adf.json';
import cardInsideActionItem from '../__fixtures__/card-inside-action-item.adf.json';
import cardInsideLayout from '../__fixtures__/card-inside-layout.adf.json';
import cardInsideLayoutWithText from '../__fixtures__/card-inside-layout-with-text.adf.json';
import cardInsideTable from '../__fixtures__/card-inside-table.adf.json';

//inline and url appearances are assumed to exist in all cases
type Appearance = 'card' | 'embed';

interface Context {
  name: string;
  adf: string;
  appearances?: Appearance[];
}
export const contexts: Context[] = [
  {
    name: 'layout',
    adf: cardInsideLayout,
    appearances: ['card', 'embed'],
  },
  {
    name: 'layout',
    adf: cardInsideLayoutWithText,
    appearances: ['card', 'embed'],
  },
  { name: 'info panel', adf: cardInsideInfoPanel, appearances: ['card'] },
  { name: 'table', adf: cardInsideTable, appearances: ['card'] },
  { name: 'expand', adf: cardInsideExpand, appearances: ['card'] },
  { name: 'expand', adf: cardInsideExpandWithText, appearances: ['card'] },

  { name: 'decision', adf: cardInsideDecision },
  { name: 'quote', adf: cardInsideQuote },
  { name: 'list', adf: cardInsideList },
  { name: 'action item', adf: cardInsideActionItem },
];
