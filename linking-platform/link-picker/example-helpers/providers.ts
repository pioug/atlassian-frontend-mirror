import fetchMock from 'fetch-mock/cjs/client';
import mockRecentData from './mock-data';
import MockFlightDeckManifest from './flight-deck/_manifest.json';
import MockFlightDeckResponse from './flight-deck/mockFDResponse.json';

const activityUrlRegex = /\/gateway\/api\/graphql/;
const fdUrlRegex = /\/recent-work-service/;
const fdManifestRegex = /\/recent-work-service\/_manifest\.json/;

export const mockRecentClient = (delay?: number) => {
  fetchMock.post(
    activityUrlRegex,
    (_: string, options: { body: string }) => mockRecentData.ACTIVITIES_DATA,
    { method: 'POST', overwriteRoutes: true, delay },
  );

  fetchMock.get(
    fdManifestRegex,
    (_: string, options: { body: string }) => MockFlightDeckManifest,
    { method: 'GET', overwriteRoutes: true, delay },
  );
  fetchMock.get(
    fdUrlRegex,
    (_: string, options: { body: string }) => MockFlightDeckResponse,
    { method: 'GET', overwriteRoutes: true, delay },
  );
};
