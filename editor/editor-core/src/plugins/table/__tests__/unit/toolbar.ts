import { getToolbarMenuConfig } from '../../toolbar';

const formatMessage: (t: unknown) => string = id => 'Lorem ipsum';
const ctx = { formatMessage };

describe('getToolbarConfig', () => {
  it('hidden by default', () => {
    const menu = getToolbarMenuConfig({}, {}, ctx);
    expect(menu.hidden).toBe(true);
  });

  it('visible for allowHeaderRow', () => {
    const menu = getToolbarMenuConfig({ allowHeaderRow: true }, {}, ctx);
    expect(menu.hidden).toBe(false);
  });

  it('visible for allowHeaderColumn', () => {
    const menu = getToolbarMenuConfig({ allowHeaderColumn: true }, {}, ctx);
    expect(menu.hidden).toBe(false);
  });

  it('visible for allowNumberColumn', () => {
    const menu = getToolbarMenuConfig({ allowNumberColumn: true }, {}, ctx);
    expect(menu.hidden).toBe(false);
  });
});
