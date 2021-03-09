import { getColumnWidth } from '../../internal/GridColumnElement';

describe('@atlaskit/page', () => {
  it('gridColumns should have an auto flex-basis', () => {
    const props = {};
    const result = getColumnWidth(props);

    expect(result).toBe('auto');
  });

  it('gridColumns should have a calculated flex-basis if medium < columns', () => {
    const props = {
      medium: 8,
      theme: {
        columns: 12,
        spacing: 'cosy',
      },
    };
    const result = getColumnWidth(props);

    expect(result).toBe('calc(99.9999% / 12 * 8 - 16px)');
  });

  it('gridColumns should have a 100% calculated flex-basis if medium === columns', () => {
    const props = {
      medium: 12,
      theme: {
        columns: 12,
        spacing: 'cosy',
      },
    };
    const result = getColumnWidth(props);

    expect(result).toBe('calc(100% - 16px)');
  });
});
