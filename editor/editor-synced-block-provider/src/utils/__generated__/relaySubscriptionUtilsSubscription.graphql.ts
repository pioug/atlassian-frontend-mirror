/**
 * @generated SignedSource<<559b4fb25d0e5bc72be383427a939e2d>>
 * @relayHash 38684212c43376e58fea2d6095011652
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID c84045a1f05bd1e73ade0a9d8b18462cc3dad5dcae1ebabab76b13135411c530

import type { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type relaySubscriptionUtilsSubscription$variables = {
  resourceId: string;
};
export type relaySubscriptionUtilsSubscription$data = {
  readonly blockService_onBlockUpdated: {
    readonly blockAri: string;
    readonly blockInstanceId: string;
    readonly content: string;
    readonly contentUpdatedAt: number | null | undefined;
    readonly createdAt: number;
    readonly createdBy: string;
    readonly deletionReason: string | null | undefined;
    readonly product: string;
    readonly sourceAri: string;
    readonly status: string;
  } | null | undefined;
};
export type relaySubscriptionUtilsSubscription = {
  response: relaySubscriptionUtilsSubscription$data;
  variables: relaySubscriptionUtilsSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "resourceId"
  }
],
v1 = [
  {
    "args": [
      {
        "kind": "Variable",
        "name": "resourceId",
        "variableName": "resourceId"
      }
    ],
    "concreteType": "BlockServiceBlockPayload",
    "kind": "LinkedField",
    "name": "blockService_onBlockUpdated",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "name": "blockAri"
      },
      {
        "kind": "ScalarField",
        "name": "blockInstanceId"
      },
      {
        "kind": "ScalarField",
        "name": "content"
      },
      {
        "kind": "ScalarField",
        "name": "contentUpdatedAt"
      },
      {
        "kind": "ScalarField",
        "name": "createdAt"
      },
      {
        "kind": "ScalarField",
        "name": "createdBy"
      },
      {
        "kind": "ScalarField",
        "name": "deletionReason"
      },
      {
        "kind": "ScalarField",
        "name": "product"
      },
      {
        "kind": "ScalarField",
        "name": "sourceAri"
      },
      {
        "kind": "ScalarField",
        "name": "status"
      }
    ]
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "name": "relaySubscriptionUtilsSubscription",
    "selections": (v1/*: any*/),
    "type": "Subscription"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "relaySubscriptionUtilsSubscription",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "c84045a1f05bd1e73ade0a9d8b18462cc3dad5dcae1ebabab76b13135411c530",
    "metadata": {},
    "name": "relaySubscriptionUtilsSubscription",
    "operationKind": "subscription",
    "text": null
  }
};
})();

(node as any).hash = "6f3ebc87921555436cad753ec1aead2e";

export default node;
