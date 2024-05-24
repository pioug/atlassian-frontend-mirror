import { CloudId, DevStack, Environment, StacksResponse } from '../types';

const AUTOMATION_LOCAL_STORAGE_PREFIX = 'automationPlatform';
const AUTOMATION_LOCAL_STORAGE_STACK = 'automationStack';
const AUTOMATION_DEV_STACK_URL = 'https://localhost:8082/devStack.json';
const getAutomationProdStackUrl = (cloudId: string) =>
  `/gateway/api/automation/internal-api/jira/${cloudId}/pro/rest/environments`;

const getLatestPreProdStack = async (
  cloudId: CloudId,
): Promise<string | null> => {
  try {
    const response = await fetch(getAutomationProdStackUrl(cloudId));
    const stacksResponse = (await response.json()) as StacksResponse;
    const preProdStacks = stacksResponse.prod.otherStacks
      .filter(({ releasedSuccessfully }) => !releasedSuccessfully)
      .map(({ stack }) => stack);
    const [latestPreProdStack = null] = preProdStacks;
    return latestPreProdStack;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(
      `Failed to fetch pre-prod stack from ${getAutomationProdStackUrl(
        cloudId,
      )} with error: ${e}`,
    );
    return null;
  }
};

const _getAutomationKeyFromLocalStorage = (key: string) => {
  return window.localStorage.getItem(
    `${AUTOMATION_LOCAL_STORAGE_PREFIX}:${key}`,
  );
};

const getAutomationDevStackFromLocalServer = async () => {
  try {
    const devStackResponse = await fetch(AUTOMATION_DEV_STACK_URL);
    const devStack: DevStack = await devStackResponse.json();
    return devStack.name;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(
      `Failed to fetch dev stack from ${AUTOMATION_DEV_STACK_URL} with error: ${e}`,
    );
    return null;
  }
};

export const getAutomationStackFromLocalStorage = () =>
  _getAutomationKeyFromLocalStorage(AUTOMATION_LOCAL_STORAGE_STACK);

export const getAutomationStack = async (
  env: Environment | null,
  cloudId: CloudId,
): Promise<string> => {
  if (env === 'prod') {
    return 'pro';
  }

  if (env === 'pre-prod') {
    const stack = await getLatestPreProdStack(cloudId);
    return stack ?? 'pro';
  }

  // We fetch the dev stack name from local server (barrel webpack dev server) if it's available.
  // However, this requires that devWatch is running locally.
  // To use manual triggers without running devWatch, set the local storage value to your stack name e.g. devltan3. The full key is: automationPlatform:automationStack
  const stackOverride =
    (await getAutomationDevStackFromLocalServer()) ||
    getAutomationStackFromLocalStorage();
  return stackOverride || 'staging';
};
