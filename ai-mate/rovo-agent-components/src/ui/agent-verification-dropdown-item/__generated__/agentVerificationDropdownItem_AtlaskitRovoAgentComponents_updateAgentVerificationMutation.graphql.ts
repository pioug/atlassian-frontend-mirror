/**
 * @generated SignedSource<<e119306497999ac48bfef5821a96f2eb>>
 * @relayHash 426410e11638597e4a12069dd5a8be16
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID e3ee432c0fc33e7c2f8bfeac0ba4eaedbab44694541de64c5219ab207398f3c0

import type { ConcreteRequest, Mutation } from 'relay-runtime';
export type agentVerificationDropdownItem_AtlaskitRovoAgentComponents_updateAgentVerificationMutation$variables = {
  id: string;
  verified: boolean;
};
export type agentVerificationDropdownItem_AtlaskitRovoAgentComponents_updateAgentVerificationMutation$data = {
  readonly agentStudio_updateAgentVerification: {
    readonly agent: {
      readonly id?: string;
      readonly isVerified?: boolean | null | undefined;
    } | null | undefined;
    readonly errors: ReadonlyArray<{
      readonly message: string | null | undefined;
    }> | null | undefined;
    readonly success: boolean;
  } | null | undefined;
};
export type agentVerificationDropdownItem_AtlaskitRovoAgentComponents_updateAgentVerificationMutation = {
  response: agentVerificationDropdownItem_AtlaskitRovoAgentComponents_updateAgentVerificationMutation$data;
  variables: agentVerificationDropdownItem_AtlaskitRovoAgentComponents_updateAgentVerificationMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "verified"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  },
  {
    "kind": "Variable",
    "name": "verified",
    "variableName": "verified"
  }
],
v2 = {
  "kind": "ScalarField",
  "name": "success"
},
v3 = {
  "concreteType": "MutationError",
  "kind": "LinkedField",
  "name": "errors",
  "plural": true,
  "selections": [
    {
      "kind": "ScalarField",
      "name": "message"
    }
  ]
},
v4 = {
  "kind": "ScalarField",
  "name": "id"
},
v5 = {
  "kind": "ScalarField",
  "name": "isVerified"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "name": "agentVerificationDropdownItem_AtlaskitRovoAgentComponents_updateAgentVerificationMutation",
    "selections": [
      {
        "args": (v1/*: any*/),
        "concreteType": "AgentStudioUpdateAgentVerificationPayload",
        "kind": "LinkedField",
        "name": "agentStudio_updateAgentVerification",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "LinkedField",
            "name": "agent",
            "plural": false,
            "selections": [
              {
                "kind": "InlineFragment",
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/)
                ],
                "type": "AgentStudioAssistant"
              }
            ]
          }
        ]
      }
    ],
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "agentVerificationDropdownItem_AtlaskitRovoAgentComponents_updateAgentVerificationMutation",
    "selections": [
      {
        "args": (v1/*: any*/),
        "concreteType": "AgentStudioUpdateAgentVerificationPayload",
        "kind": "LinkedField",
        "name": "agentStudio_updateAgentVerification",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "LinkedField",
            "name": "agent",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "name": "__typename"
              },
              (v4/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  (v5/*: any*/)
                ],
                "type": "AgentStudioAssistant"
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "id": "e3ee432c0fc33e7c2f8bfeac0ba4eaedbab44694541de64c5219ab207398f3c0",
    "metadata": {},
    "name": "agentVerificationDropdownItem_AtlaskitRovoAgentComponents_updateAgentVerificationMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "215d57ba82c69595cbed5235ec1fec93";

export default node;
