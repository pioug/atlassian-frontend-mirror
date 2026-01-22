/**
 * @generated SignedSource<<251e7c171e33da0a0b2e0e8041d77493>>
 * @relayHash 79a628a32ef254ccf6142a38adf8ecca
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 790e12806b8a31f23c8834d4c00327ae778a10fab62bf682c07e39e2b2349465

import type { ConcreteRequest, Query } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type testAgentVerificationDropdownItemQuery$variables = Record<PropertyKey, never>;
export type testAgentVerificationDropdownItemQuery$data = {
  readonly agentStudio_agentById: {
    readonly " $fragmentSpreads": FragmentRefs<"agentVerificationDropdownItem_AtlaskitRovoAgentComponents_agentRef">;
  };
  readonly atlassianStudio_userSiteContext: {
    readonly userPermissions?: {
      readonly " $fragmentSpreads": FragmentRefs<"agentVerificationDropdownItem_AtlaskitRovoAgentComponents_userPermissionsRef">;
    } | null | undefined;
  } | null | undefined;
};
export type testAgentVerificationDropdownItemQuery = {
  response: testAgentVerificationDropdownItemQuery$data;
  variables: testAgentVerificationDropdownItemQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "test-agent-id"
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "cloudId",
    "value": "test-cloud-id"
  }
],
v2 = {
  "kind": "ScalarField",
  "name": "__typename"
},
v3 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v4 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "name": "testAgentVerificationDropdownItemQuery",
    "selections": [
      {
        "kind": "RequiredField",
        "field": {
          "args": (v0/*: any*/),
          "kind": "LinkedField",
          "name": "agentStudio_agentById",
          "plural": false,
          "selections": [
            {
              "kind": "InlineFragment",
              "selections": [
                {
                  "kind": "FragmentSpread",
                  "name": "agentVerificationDropdownItem_AtlaskitRovoAgentComponents_agentRef"
                }
              ],
              "type": "AgentStudioAssistant"
            }
          ],
          "storageKey": "agentStudio_agentById(id:\"test-agent-id\")"
        },
        "action": "THROW",
        "path": "agentStudio_agentById"
      },
      {
        "args": (v1/*: any*/),
        "kind": "LinkedField",
        "name": "atlassianStudio_userSiteContext",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "concreteType": "AtlassianStudioUserProductPermissions",
                "kind": "LinkedField",
                "name": "userPermissions",
                "plural": false,
                "selections": [
                  {
                    "kind": "FragmentSpread",
                    "name": "agentVerificationDropdownItem_AtlaskitRovoAgentComponents_userPermissionsRef"
                  }
                ]
              }
            ],
            "type": "AtlassianStudioUserSiteContextOutput"
          }
        ],
        "storageKey": "atlassianStudio_userSiteContext(cloudId:\"test-cloud-id\")"
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "testAgentVerificationDropdownItemQuery",
    "selections": [
      {
        "args": (v0/*: any*/),
        "kind": "LinkedField",
        "name": "agentStudio_agentById",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "kind": "ScalarField",
                "name": "isVerified"
              }
            ],
            "type": "AgentStudioAssistant"
          },
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "kind": "ScalarField",
                "name": "id"
              }
            ],
            "type": "Node",
            "abstractKey": "__isNode"
          }
        ],
        "storageKey": "agentStudio_agentById(id:\"test-agent-id\")"
      },
      {
        "args": (v1/*: any*/),
        "kind": "LinkedField",
        "name": "atlassianStudio_userSiteContext",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "concreteType": "AtlassianStudioUserProductPermissions",
                "kind": "LinkedField",
                "name": "userPermissions",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "name": "isAbleToGovernAgents"
                  }
                ]
              }
            ],
            "type": "AtlassianStudioUserSiteContextOutput"
          }
        ],
        "storageKey": "atlassianStudio_userSiteContext(cloudId:\"test-cloud-id\")"
      }
    ]
  },
  "params": {
    "id": "790e12806b8a31f23c8834d4c00327ae778a10fab62bf682c07e39e2b2349465",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "agentStudio_agentById": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AgentStudioAgentResult"
        },
        "agentStudio_agentById.__isNode": (v3/*: any*/),
        "agentStudio_agentById.__typename": (v3/*: any*/),
        "agentStudio_agentById.id": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ID"
        },
        "agentStudio_agentById.isVerified": (v4/*: any*/),
        "atlassianStudio_userSiteContext": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AtlassianStudioUserSiteContextResult"
        },
        "atlassianStudio_userSiteContext.__typename": (v3/*: any*/),
        "atlassianStudio_userSiteContext.userPermissions": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AtlassianStudioUserProductPermissions"
        },
        "atlassianStudio_userSiteContext.userPermissions.isAbleToGovernAgents": (v4/*: any*/)
      }
    },
    "name": "testAgentVerificationDropdownItemQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "19dfd01b36565c5a9ddf6cfed9c3594f";

export default node;
