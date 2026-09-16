/**
 * @generated SignedSource<<765322731b31afdb0584c134ed53e12a>>
 * @relayHash 07c2f9612a7a8401a21c6ad1a0936b2d
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID aa69c7a83a201b1f2a5cdca116d15f149410a79d7ce49e3fafb7ce1e4a4e38d5

import type { ConcreteRequest } from 'relay-runtime';
export type ResolvedAgentAvatarQuery$variables = {
  accountId: string;
};
export type ResolvedAgentAvatarQuery$data = {
  readonly user: {
    readonly name: string;
    readonly picture: AGG$URL;
  } | null;
};
export type ResolvedAgentAvatarQuery = {
  response: ResolvedAgentAvatarQuery$data;
  variables: ResolvedAgentAvatarQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "accountId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "accountId",
    "variableName": "accountId"
  }
],
v2 = {
  "kind": "ScalarField",
  "name": "name"
},
v3 = {
  "kind": "ScalarField",
  "name": "picture"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "name": "ResolvedAgentAvatarQuery",
    "selections": [
      {
        "args": (v1/*: any*/),
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/)
        ]
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ResolvedAgentAvatarQuery",
    "selections": [
      {
        "args": (v1/*: any*/),
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "name": "__typename"
          },
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "ScalarField",
            "name": "id"
          }
        ]
      }
    ]
  },
  "params": {
    "id": "aa69c7a83a201b1f2a5cdca116d15f149410a79d7ce49e3fafb7ce1e4a4e38d5",
    "metadata": {},
    "name": "ResolvedAgentAvatarQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "a2c97e7ac7feca789629a3b50c6150aa";

export default node;
