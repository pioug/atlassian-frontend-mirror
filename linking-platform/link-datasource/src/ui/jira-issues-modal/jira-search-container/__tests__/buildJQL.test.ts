import { buildJQL } from '../buildJQL';

describe('buildJQL', () => {
  it('outputs JQL with the default order keys', () => {
    const jql = buildJQL({
      rawSearch: 'testing',
      orderDirection: 'DESC',
      orderKey: 'created',
    });

    expect(jql).toEqual(
      'text ~ "testing*" or summary ~ "testing*" ORDER BY created DESC',
    );
  });

  it('outputs JQL with the provided order keys', () => {
    const jql = buildJQL({
      rawSearch: 'testing',
      orderDirection: 'ASC',
      orderKey: 'status',
    });

    expect(jql).toEqual(
      'text ~ "testing*" or summary ~ "testing*" ORDER BY status ASC',
    );
  });

  it('returns default query when raw search is empty', () => {
    const jql = buildJQL({
      rawSearch: ' ',
    });
    expect(jql).toEqual('created >= -30d ORDER BY created DESC');
  });

  it('omits fuzzy search search term with quotations', () => {
    const jql = buildJQL({
      rawSearch: '"testing"',
    });

    expect(jql).toEqual(
      'text ~ testing or summary ~ testing ORDER BY created DESC',
    );
  });

  it('parses a jira issue key as expected', () => {
    const jql = buildJQL({
      rawSearch: 'EDM-6023',
    });

    expect(jql).toEqual(
      'text ~ "EDM-6023*" or summary ~ "EDM-6023*" or key = EDM-6023 ORDER BY created DESC',
    );
  });

  it('removes quotations and question marks', () => {
    const jql = buildJQL({
      rawSearch: '"?',
    });

    expect(jql).toEqual('text ~ "*" or summary ~ "*" ORDER BY created DESC');
  });
});
