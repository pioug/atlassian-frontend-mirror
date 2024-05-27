import fetchMock from 'jest-fetch-mock';
import type StatsigType from 'statsig-js-lite';

import type FeatureGates from '../client';
// eslint-disable-next-line no-duplicate-imports
import type {
  FeatureGateEnvironment as FeatureGateEnvironmentType,
  Identifiers,
  PerimeterType as PerimeterTypeType,
} from '../client';
import {
  DEV_BASE_URL,
  FEDM_PROD_BASE_URL,
  GATEWAY_BASE_URL,
} from '../client/fetcher/Fetcher';
import { type ClientOptions } from '../client/types';

describe('FeatureGate client Statsig integration test', () => {
  const MOCK_CLIENT_SDK_KEY = 'client-mockSdkKey';
  const INVALID_SDK_KEY = 'invalid-sdkKey';
  const CLIENT_SDK_KEY = 'client-sdkKey';
  const TARGET_APP = 'jira_web';
  const API_KEY = 'apiKey-123';

  const TEST_IDENTIFIERS = { atlassianAccountId: 'abc-123' };

  const TEST_INITIALIZE_VALUES = { test: '123' };

  const TEST_STATSIG_OPTIONS = {
    environment: {
      tier: 'development',
    },
    initializeValues: {},
    eventLoggingApi: 'https://xp.atlassian.com/v1/',
    disableCurrentPageLogging: true,
    targetApp: 'jira_web',
  };

  const TEST_STATSIG_USER = {
    userID: 'abc-123',
    customIDs: TEST_IDENTIFIERS,
  };

  let FeatureGatesClass: typeof FeatureGates;
  let FeatureGateEnvironment: typeof FeatureGateEnvironmentType;
  let PerimeterType: typeof PerimeterTypeType;
  let StatsigClass: typeof StatsigType;
  let statsigInitSpy: jest.SpyInstance;

  /* eslint-disable no-console */

  beforeEach(() => {
    console.error = jest.fn();
    console.warn = jest.fn();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Remove globally saved reference to FeatureGates client between tests
    window.__FEATUREGATES_JS__ = undefined;

    jest.isolateModules(() => {
      const FG_API = jest.requireActual('../client/index');
      FeatureGatesClass = FG_API.default;
      FeatureGateEnvironment = FG_API.FeatureGateEnvironment;
      PerimeterType = FG_API.PerimeterType;
      const S_API = jest.requireActual('statsig-js-lite');
      StatsigClass = S_API.default;
    });

    statsigInitSpy = jest.spyOn(StatsigClass, 'initialize');
  });

  describe('initialize client', function () {
    beforeEach(() => {
      fetchMock.enableMocks();
      fetchMock
        .mockResponseOnce(
          JSON.stringify({
            clientSdkKey: MOCK_CLIENT_SDK_KEY,
          }),
          { status: 200 },
        )
        .mockResponseOnce(
          JSON.stringify({
            experimentValues: TEST_INITIALIZE_VALUES,
          }),
          { status: 200 },
        );
    });

    afterEach(() => {
      fetchMock.resetMocks();
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    test('initialize successfully', async () => {
      await initializeFeatureGates(TEST_IDENTIFIERS);

      expect(statsigInitSpy).toHaveBeenCalledTimes(1);
      expect(statsigInitSpy).toHaveBeenCalledWith(
        MOCK_CLIENT_SDK_KEY,
        TEST_STATSIG_USER,
        {
          ...TEST_STATSIG_OPTIONS,
          initializeValues: TEST_INITIALIZE_VALUES, // with initializeValues
          apiKey: API_KEY, // apiKey added
        },
      );

      expect(fetchMock).toHaveBeenCalledWith(
        `${DEV_BASE_URL}/api/v2/frontend/clientSdkKey/jira_web`, // commercial base url for environment
        expect.objectContaining({}),
      );

      expectTestCohortNotEnrolled();
    });

    test('initialize successfully with commercial perimeter specified', async () => {
      await initializeFeatureGates(TEST_IDENTIFIERS, {
        perimeter: PerimeterType.COMMERCIAL,
      });

      expect(fetchMock).toHaveBeenCalledWith(
        `${DEV_BASE_URL}/api/v2/frontend/clientSdkKey/jira_web`, // commercial base url for environment
        expect.objectContaining({}),
      );
    });

    test('initialize successfully with default key because invalid key was provided', async () => {
      fetchMock.resetMocks();

      fetchMock
        .mockResponseOnce(
          JSON.stringify({
            clientSdkKey: INVALID_SDK_KEY,
          }),
          { status: 200 },
        )
        .mockResponseOnce(
          JSON.stringify({
            experimentValues: TEST_INITIALIZE_VALUES,
          }),
          { status: 200 },
        );

      await expect(initializeFeatureGates(TEST_IDENTIFIERS)).rejects.toThrow(
        'Invalid key provided.  You must use a Client SDK Key from the Statsig console to initialize the sdk',
      );

      expect(statsigInitSpy).toHaveBeenCalledTimes(2);
      expect(statsigInitSpy).toHaveBeenNthCalledWith(
        1,
        INVALID_SDK_KEY,
        TEST_STATSIG_USER,
        {
          ...TEST_STATSIG_OPTIONS,
          initializeValues: TEST_INITIALIZE_VALUES, // with initializeValues
          apiKey: API_KEY, // apiKey added
        },
      );

      expect(statsigInitSpy).toHaveBeenNthCalledWith(
        2,
        'client-default-key',
        TEST_STATSIG_USER,
        {
          ...TEST_STATSIG_OPTIONS,
          apiKey: API_KEY, // apiKey added
        },
      );

      expect(console.warn).toHaveBeenCalledWith(
        'Initialising Statsig client with default sdk key and without values',
      );
      expect(console.error).toHaveBeenCalledWith(
        'Error occurred when trying to initialise the Statsig client, error: Invalid key provided.  ' +
          'You must use a Client SDK Key from the Statsig console to initialize the sdk',
      );

      expectTestCohortNotEnrolled();
    });

    test('initialize should initialize with defaults when no identifiers provided', async () => {
      fetchMock.resetMocks();
      fetchMock
        .mockResponseOnce(
          JSON.stringify({
            clientSdkKey: MOCK_CLIENT_SDK_KEY,
          }),
          { status: 200 },
        )
        .mockResponseOnce('something went wrong', {
          status: 500,
        });

      await expect(initializeFeatureGates({})).rejects.toThrow(
        'Non 2xx response status received, status: 500, body: "something went wrong"',
      );

      expect(statsigInitSpy).toHaveBeenCalledTimes(1);
      expect(statsigInitSpy).toHaveBeenCalledWith(
        MOCK_CLIENT_SDK_KEY,
        {
          customIDs: {},
        },
        {
          ...TEST_STATSIG_OPTIONS,
          apiKey: API_KEY, // apiKey added
        },
      );

      expectTestCohortNotEnrolled();
    });
  });

  describe('initializeFromValues client', function () {
    test('initializeFromValues successfully', async () => {
      await FeatureGatesClass.initializeFromValues(
        {
          sdkKey: CLIENT_SDK_KEY,
          environment: FeatureGateEnvironment.Development,
          targetApp: TARGET_APP,
        },
        TEST_IDENTIFIERS,
        undefined,
        TEST_INITIALIZE_VALUES,
      );

      expect(statsigInitSpy).toHaveBeenCalledTimes(1);
      expect(statsigInitSpy).toHaveBeenCalledWith(
        CLIENT_SDK_KEY,
        TEST_STATSIG_USER,
        {
          ...TEST_STATSIG_OPTIONS,
          initializeValues: TEST_INITIALIZE_VALUES, // with initializeValues
        },
      );

      expectTestCohortNotEnrolled();
    });

    test('initialize successfully with default key because invalid key was provided', async () => {
      await expect(
        FeatureGatesClass.initializeFromValues(
          {
            sdkKey: INVALID_SDK_KEY,
            environment: FeatureGateEnvironment.Development,
            targetApp: TARGET_APP,
          },
          TEST_IDENTIFIERS,
          undefined,
          TEST_INITIALIZE_VALUES,
        ),
      ).rejects.toThrow(
        'Invalid key provided.  You must use a Client SDK Key from the Statsig console to initialize the sdk',
      );

      expect(statsigInitSpy).toHaveBeenCalledTimes(2);
      expect(statsigInitSpy).toHaveBeenNthCalledWith(
        1,
        INVALID_SDK_KEY,
        TEST_STATSIG_USER,
        {
          ...TEST_STATSIG_OPTIONS,
          initializeValues: TEST_INITIALIZE_VALUES, // with initializeValues
        },
      );

      expect(statsigInitSpy).toHaveBeenNthCalledWith(
        2,
        'client-default-key',
        TEST_STATSIG_USER,
        TEST_STATSIG_OPTIONS,
      );

      expect(console.warn).toHaveBeenCalledWith(
        'Initialising Statsig client with default sdk key and without values',
      );
      expect(console.error).toHaveBeenCalledWith(
        'Error occurred when trying to initialise the Statsig client, error: Invalid key provided.  ' +
          'You must use a Client SDK Key from the Statsig console to initialize the sdk',
      );

      expectTestCohortNotEnrolled();
    });

    test('initializeFromValues should initialize when no identifiers are provided', async () => {
      await FeatureGatesClass.initializeFromValues(
        {
          sdkKey: CLIENT_SDK_KEY,
          environment: FeatureGateEnvironment.Development,
          targetApp: TARGET_APP,
        },
        {},
        undefined,
        TEST_INITIALIZE_VALUES,
      );

      expect(statsigInitSpy).toHaveBeenCalledTimes(1);
      expect(statsigInitSpy).toHaveBeenCalledWith(
        CLIENT_SDK_KEY,
        {
          customIDs: {},
        },
        {
          ...TEST_STATSIG_OPTIONS,
          initializeValues: TEST_INITIALIZE_VALUES, // with initializeValues
        },
      );

      expectTestCohortNotEnrolled();
    });

    describe('initialize in fedramp-moderate perimeter', function () {
      beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock
          .mockResponseOnce(
            JSON.stringify({
              clientSdkKey: MOCK_CLIENT_SDK_KEY,
            }),
            { status: 200 },
          )
          .mockResponseOnce(
            JSON.stringify({
              experimentValues: TEST_INITIALIZE_VALUES,
            }),
            { status: 200 },
          );
      });

      test('initialize fails for fedramp-moderate perimeter and FeatureGateEnvironment.Development', async () => {
        await expect(
          initializeFeatureGates(TEST_IDENTIFIERS, {
            environment: FeatureGateEnvironment.Development, // not valid for fedramp-moderate perimeter
            perimeter: PerimeterType.FEDRAMP_MODERATE,
          }),
        ).rejects.toThrow(
          'Invalid environment "development" for "fedramp-moderate" perimeter',
        );
        expect(fetchMock).not.toHaveBeenCalled();
      });

      test('initialize succeeds for fedramp-moderate perimeter and FeatureGateEnvironment.Production', async () => {
        await initializeFeatureGates(TEST_IDENTIFIERS, {
          environment: FeatureGateEnvironment.Production,
          perimeter: PerimeterType.FEDRAMP_MODERATE,
        });
        expect(statsigInitSpy).toHaveBeenCalledTimes(1);
        expect(statsigInitSpy).toHaveBeenCalledWith(
          MOCK_CLIENT_SDK_KEY,
          TEST_STATSIG_USER,
          {
            ...TEST_STATSIG_OPTIONS,
            environment: {
              tier: 'production',
            },
            disableAllLogging: true, // disableAllLogging in FedRAMP
            initializeValues: TEST_INITIALIZE_VALUES, // with initializeValues
            apiKey: API_KEY, // apiKey added
          },
        );

        // call FFS with base url for environment and perimeter
        expect(fetchMock).toHaveBeenCalledWith(
          `${FEDM_PROD_BASE_URL}/api/v2/frontend/clientSdkKey/jira_web`,
          expect.objectContaining({}),
        );
        expect(fetchMock).toHaveBeenCalledWith(
          `${FEDM_PROD_BASE_URL}/api/v2/frontend/experimentValues`,
          expect.objectContaining({}),
        );
      });

      test('useGatewayUrl takes precedence over perimeter and environment to build FFS base url', async () => {
        await initializeFeatureGates(TEST_IDENTIFIERS, {
          environment: FeatureGateEnvironment.Production,
          useGatewayURL: true,
          perimeter: PerimeterType.FEDRAMP_MODERATE,
        });

        // call FFS using gateway base url
        expect(fetchMock).toHaveBeenCalledWith(
          `${GATEWAY_BASE_URL}/api/v2/frontend/clientSdkKey/jira_web`,
          expect.objectContaining({}),
        );
        expect(fetchMock).toHaveBeenCalledWith(
          `${GATEWAY_BASE_URL}/api/v2/frontend/experimentValues`,
          expect.objectContaining({}),
        );
      });
    });
  });

  function initializeFeatureGates(
    identifiers: Identifiers,
    clientOptions: Partial<ClientOptions> = {},
  ) {
    return FeatureGatesClass.initialize(
      {
        apiKey: API_KEY,
        environment: FeatureGateEnvironment.Development,
        targetApp: TARGET_APP,
        ...clientOptions,
      },
      identifiers,
      undefined,
    );
  }

  function expectTestCohortNotEnrolled() {
    expect(
      FeatureGatesClass.getExperimentValue('test', 'cohort', 'not-enrolled'),
    ).toEqual('not-enrolled');
  }
});
