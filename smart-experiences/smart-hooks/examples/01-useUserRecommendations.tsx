import React, { useState } from 'react';

import { IntlProvider, useIntl } from 'react-intl-next';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import Textfield from '@atlaskit/textfield';
import UserPicker, { ActionTypes, Value } from '@atlaskit/user-picker';

import { useEndpointMocks } from '../example-helpers/use-endpoint-mocks';
import {
  transformRecommendationsToOptions,
  useUserRecommendations,
} from '../src';

const JIRA_CLOUD_ID = '49d8b9d6-ee7d-4931-a0ca-7fcae7d1c3b5';

type State = {
  baseUrl?: string;
  userId: string;
  tenantId: string;
  includeUsers: boolean;
  includeGroups: boolean;
  includeTeams: boolean;
  isMulti: boolean;
  isPreloadOn: boolean;
  fieldId: string;
  childObjectId?: string;
  objectId?: string;
  containerId?: string;
};

const UserPickerExample = () => {
  useEndpointMocks();

  let [state, setState] = useState<State>({
    baseUrl: undefined,
    userId: 'Context',
    tenantId: JIRA_CLOUD_ID,
    fieldId: 'storybook',
    includeUsers: true,
    includeGroups: false,
    includeTeams: true,
    isMulti: true,
    isPreloadOn: false,
    childObjectId: undefined,
    objectId: undefined,
    containerId: undefined,
  });

  const {
    recommendations,
    onChange: onChangeFactory,
    onInputChange: onInputChangeFactory,
  } = useUserRecommendations({
    baseUrl: state.baseUrl,
    fieldId: 'fieldId',
    objectId: state.objectId,
    containerId: state.containerId,
    includeGroups: state.includeGroups,
    includeTeams: state.includeTeams,
    includeUsers: state.includeUsers,
    productKey: 'jira',
    tenantId: state.tenantId,
    preload: state.isPreloadOn,
  });
  const onChange = onChangeFactory();
  const onInputChange = onInputChangeFactory();
  const intl = useIntl();
  const options = transformRecommendationsToOptions(recommendations, intl);

  const createBoolean = (
    id:
      | 'includeUsers'
      | 'includeGroups'
      | 'includeTeams'
      | 'isMulti'
      | 'isPreloadOn',
    label: string,
  ) => {
    return (
      <div>
        <input
          checked={Boolean(state[id] as boolean)}
          id={id}
          onChange={() =>
            // @ts-ignore
            setState({
              ...state,
              [id]: !state[id],
            })
          }
          type="checkbox"
        />
        <label htmlFor={id}>{label}</label>
      </div>
    );
  };

  const createText = (
    id:
      | 'baseUrl'
      | 'userId'
      | 'tenantId'
      | 'objectId'
      | 'childObjectId'
      | 'fieldId'
      | 'containerId',
    width: 'large' | 'medium',
  ) => {
    return (
      <Textfield
        width={width}
        name={id}
        value={(state[id] as string) || ''}
        onChange={(e) => {
          // @ts-ignore
          setState({
            ...state,
            [id]: e.currentTarget.value,
          });
        }}
      />
    );
  };

  const handleChange = (value: Value, action: ActionTypes) => {
    console.log(value);
    onChange(value, action);
  };

  return (
    <div>
      <h5>Smart Picker props</h5>
      <label htmlFor="userId">User Id (userId)</label>
      {createText('userId', 'large')}
      <label htmlFor="tenantId">Tenant ID (tenantId)</label>
      {createText('tenantId', 'large')}
      <label htmlFor="fieldId">Context Id (fieldId)</label>
      {createText('fieldId', 'large')}
      <label htmlFor="containerId">Container Id [Optional] (containerId)</label>
      {createText('containerId', 'large')}
      <label htmlFor="objectId">Object Id [Optional] (objectId)</label>
      {createText('objectId', 'large')}
      <label htmlFor="childObjectId">
        Child Object Id [Optional] (childObjectId)
      </label>
      {createText('childObjectId', 'large')}
      <label htmlFor="baseUrl">baseUrl</label>
      {createText('baseUrl', 'large')}
      {createBoolean('includeUsers', 'includeUsers')}
      {createBoolean('includeTeams', 'includeTeams')}
      {createBoolean('includeGroups', 'includeGroups')}
      {createBoolean('isPreloadOn', 'preload')}
      {createBoolean('isMulti', 'isMulti')}
      <hr />
      <label htmlFor="user-picker">User Picker</label>
      <UserPicker
        maxOptions={10}
        isMulti={state.isMulti}
        onFocus={() => onInputChange('')}
        onInputChange={onInputChange}
        onChange={handleChange}
        fieldId={state.fieldId}
        options={options}
      />
    </div>
  );
};

export default () => {
  let onEvent = (e: UIAnalyticsEvent) => {
    console.log(
      `Analytics ${e.payload.attributes.sessionId} ${e.payload.actionSubject} ${e.payload.action} `,
      e.payload,
    );
  };

  return (
    <AnalyticsListener onEvent={onEvent} channel="fabric-elements">
      <IntlProvider locale="en-US">
        <UserPickerExample />
      </IntlProvider>
    </AnalyticsListener>
  );
};
