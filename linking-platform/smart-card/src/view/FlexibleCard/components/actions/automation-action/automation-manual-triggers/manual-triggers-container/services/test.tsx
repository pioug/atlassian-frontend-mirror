import { mockGetUrl, mockInvokeUrl, mockRules } from '../common/mocks';
import {
  type ManualRulesById,
  UserInputType,
  type UserInputValue,
} from '../common/types';
import { performPostRequest } from '../common/utils';

import {
  invokeManuallyTriggeredRule,
  searchManuallyTriggeredRules,
} from './index';

jest.mock('../common/utils/api', () => ({
  getSearchUrl: jest.fn().mockImplementation(() => mockGetUrl),
  getInvocationUrl: jest.fn().mockImplementation(() => mockInvokeUrl),
  performPostRequest: jest.fn().mockImplementation(() => mockRules),
}));

describe('searchManuallyTriggeredRules', () => {
  const env = 'dev';
  const site = 'ari:cloud:platform::site/123';
  const objectAri = 'ari:cloud:opsgenie::alert/123';

  test('should return manual rules formatted by id when payload is valid', async () => {
    const rulesById: ManualRulesById = await searchManuallyTriggeredRules(
      env,
      site,
      {
        objects: [objectAri],
      },
    );
    expect(rulesById).toEqual({
      0: {
        id: mockRules[0].id,
        name: mockRules[0].name,
        ruleScope: mockRules[0].ruleScope,
        userInputPrompts: mockRules[0].userInputs,
      },
      1: {
        id: mockRules[1].id,
        name: mockRules[1].name,
        ruleScope: mockRules[1].ruleScope,
        userInputPrompts: mockRules[1].userInputs,
      },
      2: {
        id: mockRules[2].id,
        name: mockRules[2].name,
        ruleScope: mockRules[2].ruleScope,
        userInputPrompts: mockRules[2].userInputs,
      },
    });
  });
});

describe('invokeManuallyTriggeredRule', () => {
  const env = 'dev';
  const cloudId = 'test:cloudId';
  const object = 'ari:cloud:opsgenie::alert/123';

  test('user inputs should not be appended to body if none were passed', async () => {
    await invokeManuallyTriggeredRule(env, cloudId, mockRules[0].id, [object]);
    expect(performPostRequest).toHaveBeenCalledWith(expect.anything(), {
      body: JSON.stringify({ objects: [object] }),
    });
  });

  test('user inputs should be appended to body if passed', async () => {
    const userInputs: Record<string, UserInputValue> = {
      someInput: { inputType: UserInputType.TEXT, value: 'someValue' },
    };
    await invokeManuallyTriggeredRule(
      env,
      cloudId,
      mockRules[0].id,
      [object],
      userInputs,
    );
    expect(performPostRequest).toHaveBeenCalledWith(expect.anything(), {
      body: JSON.stringify({ objects: [object], userInputs }),
    });
  });
});
