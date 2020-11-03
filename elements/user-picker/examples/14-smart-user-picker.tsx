import React, { Fragment } from 'react';
import { ActionTypes, OnChange, OnInputChange, Value } from '../src/index';
import Textfield from '@atlaskit/textfield';
import Select from '@atlaskit/select';
import Button from '@atlaskit/button/standard-button';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import {
  SupportedProduct,
  SmartUserPicker,
} from '../src/components/smart-user-picker/index';
import { setEnv } from '../src/components/smart-user-picker/config';
import { BitbucketAttributes } from '../src/components/smart-user-picker/components';
setEnv('local');

const products = [
  { label: 'Jira', value: 'jira' },
  { label: 'Confluence', value: 'confluence' },
  { label: 'People', value: 'people' },
  { label: 'Bitbucket', value: 'bitbucket' },
];

interface State {
  userId: string;
  tenantId: string;
  product: SupportedProduct;
  includeUsers: boolean;
  includeGroups: boolean;
  includeTeams: boolean;
  fieldId: string;
  childObjectId?: string;
  objectId?: string;
  containerId?: string;
  productAttributes: BitbucketAttributes;
}
const productsMap = products
  .map(p => ({ [p.value]: p }))
  .reduce((acc, val) => ({ ...acc, ...val }), {});

export default class SmartUserPickerCustomizableExample extends React.Component<
  {},
  State
> {
  state: State = {
    userId: 'Context',
    tenantId: '497ea592-beb4-43c3-9137-a6e5fa301088',
    fieldId: 'storybook',
    product: 'jira',
    includeUsers: true,
    includeGroups: false,
    includeTeams: true,
    childObjectId: undefined,
    objectId: undefined,
    containerId: undefined,
    productAttributes: {
      workspaceIds: ['workspace-1', 'workspace-2'],
      emailDomain: 'atlassian.com',
      isPublicRepo: true,
    },
  };

  onInputChange: OnInputChange = (query?: string, sessionId?: string) => {
    console.log(`onInputChange query=${query} sessionId=${sessionId}`);
  };

  onEvent = (e: UIAnalyticsEvent) => {
    console.log(
      `Analytics ${e.payload.attributes.sessionId} ${e.payload.actionSubject} ${e.payload.action} `,
      e.payload,
    );
  };

  onChange: OnChange = (value: Value, action: ActionTypes) => {
    console.log(value, action);
  };

  createBoolean(
    id: 'includeUsers' | 'includeGroups' | 'includeTeams',
    label: string,
  ) {
    return (
      <div>
        <input
          checked={Boolean(this.state[id] as boolean)}
          id={id}
          onChange={() =>
            // @ts-ignore
            this.setState({ [id]: !this.state[id] })
          }
          type="checkbox"
        />
        <label htmlFor={id}>{label}</label>
      </div>
    );
  }
  createText = (
    id:
      | 'userId'
      | 'tenantId'
      | 'objectId'
      | 'childObjectId'
      | 'fieldId'
      | 'containerId',
    width: 'large' | 'medium',
  ) => (
    <Textfield
      width={width}
      name={id}
      value={(this.state[id] as string) || ''}
      onChange={e => {
        // @ts-ignore
        this.setState({ [id]: e.currentTarget.value });
      }}
    />
  );

  render() {
    return (
      <div>
        <label htmlFor="product">Product</label>
        <Select
          width="medium"
          onChange={selectedValue => {
            if (selectedValue) {
              // @ts-ignore
              this.setState({ product: selectedValue.value });
            }
          }}
          value={productsMap[this.state.product]}
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
              this.setState({
                tenantId: '497ea592-beb4-43c3-9137-a6e5fa301088',
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
              this.setState({
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
              this.setState({
                tenantId: 'bitbucket',
                product: 'bitbucket',
              });
            }}
          >
            Bitbucket
          </Button>
        </label>
        {this.createText('tenantId', 'large')}
        <label htmlFor="userId">User Id (userId)</label>
        {this.createText('userId', 'large')}
        <label htmlFor="fieldId">Context Id (fieldId)</label>
        {this.createText('fieldId', 'large')}
        {this.state.product === 'bitbucket' && (
          <label htmlFor="containerId">
            Repository Id [Optional] (containerId)
          </label>
        )}
        {this.state.product !== 'bitbucket' && (
          <label htmlFor="containerId">
            Container Id [Optional] (containerId)
          </label>
        )}
        {this.createText('containerId', 'large')}
        <label htmlFor="objectId">Object Id [Optional] (objectId)</label>
        {this.createText('objectId', 'large')}
        <label htmlFor="childObjectId">
          Child Object Id [Optional] (childObjectId)
        </label>
        {this.createText('childObjectId', 'large')}
        {this.state.product === 'confluence' &&
          this.createBoolean('includeGroups', 'include Groups (includeGroups)')}

        {this.createBoolean('includeUsers', 'include Users (includeUsers)')}
        {this.createBoolean('includeTeams', 'include Teams (includeTeams)')}

        {this.state.product === 'bitbucket' && (
          <Fragment>
            <h5>Bitbucket props</h5>
            <label htmlFor="workspaceIds">Workspace Ids (workspaceIds)</label>
            <Textfield
              name="workspaceIds"
              value={this.state.productAttributes.workspaceIds || ''}
              onChange={e => {
                this.setState({
                  productAttributes: {
                    ...this.state.productAttributes,
                    // @ts-ignore
                    workspaceIds: e.currentTarget.value,
                  },
                });
              }}
            />
            <label htmlFor="emailDomain">Email domain (emailDomain)</label>
            <Textfield
              name="emailDomain"
              value={this.state.productAttributes.emailDomain || ''}
              onChange={e => {
                // @ts-ignore
                this.setState({
                  productAttributes: {
                    ...this.state.productAttributes,
                    emailDomain: e.currentTarget.value,
                  },
                });
              }}
            />
            <div>
              <input
                checked={Boolean(this.state.productAttributes.isPublicRepo)}
                id="isPublicRepo"
                onChange={e => {
                  // @ts-ignore
                  this.setState({
                    productAttributes: {
                      ...this.state.productAttributes,
                      isPublicRepo: !this.state.productAttributes.isPublicRepo,
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
        <AnalyticsListener onEvent={this.onEvent} channel="fabric-elements">
          <SmartUserPicker
            maxOptions={10}
            isMulti
            includeUsers={this.state.includeUsers}
            includeGroups={this.state.includeGroups}
            includeTeams={this.state.includeTeams}
            fieldId={this.state.fieldId}
            onChange={this.onChange}
            onInputChange={this.onInputChange}
            principalId={this.state.userId}
            siteId={this.state.tenantId}
            productKey={this.state.product}
            objectId={this.state.objectId}
            containerId={this.state.containerId}
            childObjectId={this.state.childObjectId}
            debounceTime={400}
            prefetch={true}
            productAttributes={{
              emailDomain: this.state.productAttributes.emailDomain,
              isPublicRepo: this.state.productAttributes.isPublicRepo,
              workspaceIds: this.state.productAttributes.workspaceIds,
            }}
            onError={e => {
              console.error(e);
            }}
          />
        </AnalyticsListener>
      </div>
    );
  }
}
