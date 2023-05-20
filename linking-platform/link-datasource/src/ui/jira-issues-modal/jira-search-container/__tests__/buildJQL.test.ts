import { buildJQL } from '../buildJQL';

describe('buildJQL', () => {
  it('outputs JQL with the default order keys', () => {
    const jql = buildJQL({
      rawSearch: 'testing',
      orderDirection: 'DESC',
      orderKey: 'created',
    });

    expect(jql).toEqual(
      '(text ~ "testing*" OR summary ~ "testing*") order by created DESC',
    );
  });

  it('outputs JQL with the provided order keys', () => {
    const jql = buildJQL({
      rawSearch: 'testing',
      orderDirection: 'ASC',
      orderKey: 'status',
    });

    expect(jql).toEqual(
      '(text ~ "testing*" OR summary ~ "testing*") order by status ASC',
    );
  });

  it('omits text search on empty search value', () => {
    const jql = buildJQL({
      rawSearch: ' ',
    });

    expect(jql).toEqual('created >= -30d order by created DESC');
  });

  it('omits fuzzy search search term with quotations', () => {
    const jql = buildJQL({
      rawSearch: '"testing"',
    });

    expect(jql).toEqual(
      '(text ~ "testing" OR summary ~ "testing") order by created DESC',
    );
  });

  it('parses a jira issue key as expected', () => {
    const jql = buildJQL({
      rawSearch: 'EDM-6023',
    });

    expect(jql).toEqual(
      '(text ~ "EDM-6023*" OR summary ~ "EDM-6023*" OR key = "EDM-6023") order by created DESC',
    );
  });

  it('removes quotations and question marks', () => {
    const jql = buildJQL({
      rawSearch: '"?',
    });

    expect(jql).toEqual('(text ~ "*" OR summary ~ "*") order by created DESC');
  });
});
