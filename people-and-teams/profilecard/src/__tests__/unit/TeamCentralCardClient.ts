import fetchMock from 'fetch-mock/cjs/client';

import TeamCentralCardClient from '../../client/TeamCentralCardClient';
import { ReportingLinesUser } from '../../types';

const EXAMPLE_TEAM_CENTRAL_URL = 'https://team.atlassian.com';
const EXAMPLE_REPORTING_LINE_USER: ReportingLinesUser = {
  accountIdentifier: 'abcd',
  identifierType: 'ATLASSIAN_ID',
  pii: {
    name: 'name',
    picture: 'picture',
  },
};

function mockReportingLines(promise: Promise<string>) {
  fetchMock.post(EXAMPLE_TEAM_CENTRAL_URL, () => promise, {
    method: 'POST',
    overwriteRoutes: true,
  });
}

function initClient() {
  return new TeamCentralCardClient({
    cacheSize: 10,
    cacheMaxAge: 5000,
    url: EXAMPLE_TEAM_CENTRAL_URL,
    teamCentralUrl: EXAMPLE_TEAM_CENTRAL_URL,
  });
}

describe('TeamCentralCardClient', () => {
  beforeEach(() => {
    mockReportingLines(
      Promise.resolve(
        JSON.stringify({
          data: {
            reportingLines: {
              managers: [EXAMPLE_REPORTING_LINE_USER],
              reports: [
                EXAMPLE_REPORTING_LINE_USER,
                EXAMPLE_REPORTING_LINE_USER,
              ],
            },
          },
        }),
      ),
    );
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it('can make successful request', async () => {
    const client = initClient();
    const reportingLines = await client.getReportingLines('user');
    expect(reportingLines.managers).toHaveLength(1);
    expect(reportingLines.reports).toHaveLength(2);
    expect(fetchMock.calls(EXAMPLE_TEAM_CENTRAL_URL)).toHaveLength(1);

    // Loads from cache
    await client.getReportingLines('user');
    expect(fetchMock.calls(EXAMPLE_TEAM_CENTRAL_URL)).toHaveLength(1);
  });

  it('failure should return empty data because reporting lines is not part of the critical path', async () => {
    mockReportingLines(Promise.reject());
    const client = initClient();
    const reportingLines = await client.getReportingLines('user');
    expect(reportingLines).toEqual({});
    expect(fetchMock.calls(EXAMPLE_TEAM_CENTRAL_URL)).toHaveLength(1);
  });

  it('auth failure should trip the circuit breaker', async () => {
    const authError: Error & { status?: number } = new Error();
    authError.status = 403;
    mockReportingLines(Promise.reject(authError));
    const client = initClient();
    const reportingLines = await client.getReportingLines('user');
    expect(reportingLines).toEqual({});
    expect(fetchMock.calls(EXAMPLE_TEAM_CENTRAL_URL)).toHaveLength(1);

    // Will not make any further calls
    await client.getReportingLines('user');
    expect(fetchMock.calls(EXAMPLE_TEAM_CENTRAL_URL)).toHaveLength(1);
  });
});
