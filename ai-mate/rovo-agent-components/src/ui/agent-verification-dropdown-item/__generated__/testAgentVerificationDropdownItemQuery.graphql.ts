/**
 * @generated SignedSource<<b3f6a07649eb82e75b49c0affe972388>>
 * @relayHash c95a4b89f332b56ac41d44591442026c
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 8de69dcbcbaf21d9b6c334ea3f571232b1f22ba3798b5f801731c6faaf2bfb78

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
  "kind": "ScalarField",
  "name": "id"
},
v4 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v5 = {
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
              (v3/*: any*/),
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
              (v3/*: any*/)
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
    "id": "8de69dcbcbaf21d9b6c334ea3f571232b1f22ba3798b5f801731c6faaf2bfb78",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "agentStudio_agentById": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AgentStudioAgentResult"
        },
        "agentStudio_agentById.__isNode": (v4/*: any*/),
        "agentStudio_agentById.__typename": (v4/*: any*/),
        "agentStudio_agentById.id": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ID"
        },
        "agentStudio_agentById.isVerified": (v5/*: any*/),
        "atlassianStudio_userSiteContext": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AtlassianStudioUserSiteContextResult"
        },
        "atlassianStudio_userSiteContext.__typename": (v4/*: any*/),
        "atlassianStudio_userSiteContext.userPermissions": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AtlassianStudioUserProductPermissions"
        },
        "atlassianStudio_userSiteContext.userPermissions.isAbleToGovernAgents": (v5/*: any*/)
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
