/**
 * @generated SignedSource<<3bfb9487e57255dc0512f225894a058b>>
 * @relayHash 676631e44ffd7d0d16b3a7e96ba02def
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 68a651ca7e5a5c9b5a075954ed948672c451b0f8c255f4edbd3219fe4947484d

import type { ConcreteRequest, Mutation } from 'relay-runtime';
export type AccessType = "EDIT" | "VIEW" | "%future added value";
export type RequestPageAccessInput = {
  accessType: AccessType;
  pageId: string;
};
export type SyncedBlockPermissionDeniedRequestAccessMutation$variables = {
  requestPageAccessInput: RequestPageAccessInput;
};
export type SyncedBlockPermissionDeniedRequestAccessMutation$data = {
  readonly requestPageAccess: {
    readonly displayName: string;
  } | null | undefined;
};
export type SyncedBlockPermissionDeniedRequestAccessMutation = {
  response: SyncedBlockPermissionDeniedRequestAccessMutation$data;
  variables: SyncedBlockPermissionDeniedRequestAccessMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "requestPageAccessInput"
  }
],
v1 = [
  {
    "args": [
      {
        "kind": "Variable",
        "name": "requestPageAccessInput",
        "variableName": "requestPageAccessInput"
      }
    ],
    "concreteType": "RequestPageAccessPayload",
    "kind": "LinkedField",
    "name": "requestPageAccess",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "name": "displayName"
      }
    ]
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "name": "SyncedBlockPermissionDeniedRequestAccessMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SyncedBlockPermissionDeniedRequestAccessMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "68a651ca7e5a5c9b5a075954ed948672c451b0f8c255f4edbd3219fe4947484d",
    "metadata": {},
    "name": "SyncedBlockPermissionDeniedRequestAccessMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "d0d4982ad805583380d2436a8e21ee6a";

export default node;
