import React, { Fragment, useState } from 'react';
import { ActionTypes, OnChange, OnInputChange, Value } from '../src/index';
import Textfield from '@atlaskit/textfield';
import Select from '@atlaskit/select';
import Button from '@atlaskit/button/standard-button';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { exampleOptions } from '../example-helpers';
import {
  SupportedProduct,
  SmartUserPicker,
} from '../src/components/smart-user-picker/index';
import {
  setSmartUserPickerEnv,
  JDOG_CLOUD_ID,
} from '../src/components/smart-user-picker/config';
import {
  BitbucketAttributes,
  ConfluenceAttributes,
} from '../src/components/smart-user-picker/components';
import { IntlProvider } from 'react-intl';
setSmartUserPickerEnv('local');

const products = [
  { label: 'Jira', value: 'jira' },
  { label: 'Confluence', value: 'confluence' },
  { label: 'People', value: 'people' },
  { label: 'Bitbucket', value: 'bitbucket' },
];

type State = {
  userId: string;
  tenantId: string;
  product: SupportedProduct;
  includeUsers: boolean;
  includeGroups: boolean;
  includeTeams: boolean;
  isPrefetchOn: boolean;
  fieldId: string;
  childObjectId?: string;
  objectId?: string;
  containerId?: string;
  bootstrapOptions: boolean;
  bitbucketAttributes: BitbucketAttributes;
  confluenceAttributes: ConfluenceAttributes;
};
const productsMap = products
  .map(p => ({ [p.value]: p }))
  .reduce((acc, val) => ({ ...acc, ...val }), {});

const SmartUserPickerCustomizableExample = () => {
  let [state, setState] = useState<State>({
    userId: 'Context',
    tenantId: JDOG_CLOUD_ID,
    fieldId: 'storybook',
    product: 'jira',
    includeUsers: true,
    includeGroups: false,
    includeTeams: true,
    isPrefetchOn: false,
    childObjectId: undefined,
    objectId: undefined,
    containerId: undefined,
    confluenceAttributes: {
      isEntitledConfluenceExternalCollaborator: false,
    },
    bitbucketAttributes: {
      workspaceIds: ['workspace-1', 'workspace-2'],
      emailDomain: 'atlassian.com',
      isPublicRepo: true,
    },
    bootstrapOptions: false,
  });

  const getProductAttributes = (product: SupportedProduct) => {
    switch (product) {
      case 'bitbucket':
        return state.bitbucketAttributes;
      case 'confluence':
        return state.confluenceAttributes;
      default:
        return undefined;
    }
  };

  let onInputChange: OnInputChange = (query?: string, sessionId?: string) => {
    console.log(`onInputChange query=${query} sessionId=${sessionId}`);
  };

  let onEvent = (e: UIAnalyticsEvent) => {
    console.log(
      `Analytics ${e.payload.attributes.sessionId} ${e.payload.actionSubject} ${e.payload.action} `,
      e.payload,
    );
  };

  let onChange: OnChange = (value: Value, action: ActionTypes) => {
    console.log(value, action);
  };

  let createBoolean = (
    id:
      | 'includeUsers'
      | 'includeGroups'
      | 'includeTeams'
      | 'bootstrapOptions'
      | 'isPrefetchOn',
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
  let createText = (
    id:
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
        onChange={e => {
          // @ts-ignore
          setState({
            ...state,
            [id]: e.currentTarget.value,
          });
        }}
      />
    );
  };
  return (
    <div>
      <label htmlFor="product">Product</label>
      <Select
        width="medium"
        onChange={selectedValue => {
          if (selectedValue) {
            setState({
              ...state,
              // @ts-ignore
              product: selectedValue.value,
            });
          }
        }}
        value={productsMap[state.product]}
        className="single-select"
        classNamePrefix="react-select"
        options={products}
        placeholder="Choose a Product"
      />

      <h5>Smart Picker props</h5>
      <label htmlFor="tenantId">
        Tenant Id
        <Button
          appearance="link"
          onClick={() => {
            setState({
              ...state,
              tenantId: JDOG_CLOUD_ID,
              product: 'jira',
              includeGroups: false,
            });
          }}
        >
          Jdog
        </Button>
        <Button
          appearance="link"
          onClick={() => {
            setState({
              ...state,
              tenantId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
              product: 'confluence',
              includeGroups: true,
            });
          }}
        >
          Pug
        </Button>
        <Button
          appearance="link"
          onClick={() => {
            setState({
              ...state,
              tenantId: 'bitbucket',
              product: 'bitbucket',
            });
          }}
        >
          Bitbucket
        </Button>
      </label>
      {createText('tenantId', 'large')}
      <label htmlFor="userId">User Id (userId)</label>
      {createText('userId', 'large')}
      <label htmlFor="fieldId">Context Id (fieldId)</label>
      {createText('fieldId', 'large')}
      {state.product === 'bitbucket' && (
        <label htmlFor="containerId">
          Repository Id [Optional] (containerId)
        </label>
      )}
      {state.product !== 'bitbucket' && (
        <label htmlFor="containerId">
          Container Id [Optional] (containerId)
        </label>
      )}
      {createText('containerId', 'large')}
      <label htmlFor="objectId">Object Id [Optional] (objectId)</label>
      {createText('objectId', 'large')}
      <label htmlFor="childObjectId">
        Child Object Id [Optional] (childObjectId)
      </label>
      {createText('childObjectId', 'large')}
      {createBoolean('includeUsers', 'include Users (includeUsers)')}
      {createBoolean('includeTeams', 'include Teams (includeTeams)')}
      {createBoolean('bootstrapOptions', 'bootstrapOptions')}
      {createBoolean('isPrefetchOn', 'prefetch')}

      {state.product === 'confluence' && (
        <Fragment>
          <h5>Confluence props</h5>
          {createBoolean('includeGroups', 'include Groups (includeGroups)')}
          <div>
            <input
              checked={Boolean(
                state.confluenceAttributes
                  .isEntitledConfluenceExternalCollaborator,
              )}
              id="includeGuests"
              onChange={e => {
                // @ts-ignore
                setState({
                  ...state,
                  confluenceAttributes: {
                    ...state.confluenceAttributes,
                    isEntitledConfluenceExternalCollaborator: !state
                      .confluenceAttributes
                      .isEntitledConfluenceExternalCollaborator,
                  },
                });
              }}
              type="checkbox"
            />
            <label htmlFor="includeGuests">include Guests</label>
          </div>
        </Fragment>
      )}

      {state.product === 'bitbucket' && (
        <Fragment>
          <h5>Bitbucket props</h5>
          <label htmlFor="workspaceIds">Workspace Ids (workspaceIds)</label>
          <Textfield
            name="workspaceIds"
            value={state.bitbucketAttributes.workspaceIds || ''}
            onChange={e => {
              setState({
                ...state,
                bitbucketAttributes: {
                  ...state.bitbucketAttributes,
                  // @ts-ignore
                  workspaceIds: e.currentTarget.value,
                },
              });
            }}
          />
          <label htmlFor="emailDomain">Email domain (emailDomain)</label>
          <Textfield
            name="emailDomain"
            value={state.bitbucketAttributes.emailDomain || ''}
            onChange={e => {
              // @ts-ignore
              setState({
                ...state,
                bitbucketAttributes: {
                  ...state.bitbucketAttributes,
                  emailDomain: e.currentTarget.value,
                },
              });
            }}
          />
          <div>
            <input
              checked={Boolean(state.bitbucketAttributes.isPublicRepo)}
              id="isPublicRepo"
              onChange={e => {
                // @ts-ignore
                setState({
                  ...state,
                  bitbucketAttributes: {
                    ...state.bitbucketAttributes,
                    isPublicRepo: !state.bitbucketAttributes.isPublicRepo,
                  },
                });
              }}
              type="checkbox"
            />
            <label htmlFor="isPublicRepo">
              is Public Repository (isPublicRepo)
            </label>
          </div>
        </Fragment>
      )}
      <hr />
      <label htmlFor="user-picker">User Picker</label>
      <AnalyticsListener onEvent={onEvent} channel="fabric-elements">
        <IntlProvider locale="en">
          <SmartUserPicker
            maxOptions={10}
            isMulti
            includeUsers={state.includeUsers}
            includeGroups={state.includeGroups}
            includeTeams={state.includeTeams}
            fieldId={state.fieldId}
            onChange={onChange}
            onInputChange={onInputChange}
            principalId={state.userId}
            siteId={state.tenantId}
            productKey={state.product}
            objectId={state.objectId}
            containerId={state.containerId}
            childObjectId={state.childObjectId}
            debounceTime={400}
            prefetch={true}
            bootstrapOptions={
              state.bootstrapOptions ? exampleOptions : undefined
            }
            productAttributes={getProductAttributes(state.product)}
            onError={e => {
              console.error(e);
            }}
          />
        </IntlProvider>
      </AnalyticsListener>
    </div>
  );
};

export default SmartUserPickerCustomizableExample;
