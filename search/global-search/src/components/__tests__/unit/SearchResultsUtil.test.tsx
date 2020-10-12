import {
  handlePromiseError,
  getJiraAdvancedSearchUrl,
  JiraEntityTypes,
  redirectToJiraAdvancedSearch,
} from '../../SearchResultsUtil';

describe('handlePromiseError', () => {
  it('should do nothing when promise is resolved', () => {
    const promiseValue = 10;
    const promise = Promise.resolve(promiseValue);
    const errorHandlerMock = jest.fn();
    const defaultValue = 80;

    return handlePromiseError(promise, defaultValue, errorHandlerMock).then(
      value => {
        expect(value).toBe(promiseValue);
        expect(errorHandlerMock.mock.calls.length).toBe(0);
      },
    );
  });

  it('should use default value when promise is rejected', () => {
    const promise = Promise.reject(new Error('err'));
    const errorHandlerMock = jest.fn();
    const defaultValue = 80;
    // @ts-ignore
    return handlePromiseError(promise, defaultValue, errorHandlerMock).then(
      value => {
        expect(value).toBe(defaultValue);
        expect(errorHandlerMock.mock.calls.length).toBe(1);
      },
    );
  });

  it('should not throw exception', () => {
    const promise = Promise.reject(new Error('err'));
    const errorHandlerMock = () => {
      throw new Error('new error');
    };
    const defaultValue = 80;
    // @ts-ignore
    return handlePromiseError(promise, defaultValue, errorHandlerMock)
      .then(value => {
        expect(value).toBe(defaultValue);
      })
      .catch(error => {
        throw new Error(
          'should never throw exception and never reach the catch block',
        );
      });
  });
});

describe('JiraIssueAdvancedSearchUrl method', () => {
  it('should return quick search url', () => {
    const issueUrl = getJiraAdvancedSearchUrl({
      entityType: JiraEntityTypes.Issues,
      query: '',
    });
    expect(issueUrl).toBe('/secure/QuickSearch.jspa?searchString=');
  });

  it('should return quick search url', () => {
    const issueUrl = getJiraAdvancedSearchUrl({
      entityType: JiraEntityTypes.Issues,
      query: 'abc',
    });
    expect(issueUrl).toBe('/secure/QuickSearch.jspa?searchString=abc');
  });

  it('should return correct people search url', () => {
    const url = getJiraAdvancedSearchUrl({
      entityType: JiraEntityTypes.People,
      query: 'PK',
      isJiraPeopleProfilesEnabled: true,
    });
    expect(url).toBe('/jira/people/search?q=PK');
  });

  ['12', ' 33 '].forEach(query => {
    it('should return GIN url with numeric queries', () => {
      const issueUrl = getJiraAdvancedSearchUrl({
        entityType: JiraEntityTypes.Issues,
        query,
      });
      expect(issueUrl).toBe('/issues/?jql=order+by+created+DESC');
    });
  });
});

describe('redirectToJiraIssueAdvancedSearch', () => {
  let originalWindowLocation = window.location;
  let assignSpy: jest.SpyInstance<() => {}>;
  beforeEach(() => {
    delete window.location;
    assignSpy = jest.fn();
    window.location = Object.assign({}, window.location, {
      assign: assignSpy,
    });
  });

  afterEach(() => {
    window.location = originalWindowLocation;
  });

  ['', '88', 'query'].forEach(query => {
    it('should always use quick search url', () => {
      redirectToJiraAdvancedSearch(JiraEntityTypes.Issues, query);
      expect(assignSpy).toBeCalledTimes(1);
      expect(assignSpy.mock.calls[0][0]).toBe(
        `/secure/QuickSearch.jspa?searchString=${query}`,
      );
    });
  });
});
