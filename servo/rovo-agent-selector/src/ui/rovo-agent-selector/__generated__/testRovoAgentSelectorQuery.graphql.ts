/**
 * @generated SignedSource<<8e3e941b141c6e112e373c7e7ce21153>>
 * @relayHash 590a9caebabdbdf00ce9390cf00c68e0
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 4e1430ebccae56212590a169f9caa58aa5e4e2365b6b58d8e5e3c77ccf8b7257

import type { ConcreteRequest, Query } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type testRovoAgentSelectorQuery$variables = {
  cloudId: string;
  cloudIdString: string;
};
export type testRovoAgentSelectorQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference">;
};
export type testRovoAgentSelectorQuery = {
  response: testRovoAgentSelectorQuery$data;
  variables: testRovoAgentSelectorQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "cloudId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "cloudIdString"
  }
],
v1 = {
  "kind": "Variable",
  "name": "cloudId",
  "variableName": "cloudId"
},
v2 = {
  "kind": "ScalarField",
  "name": "__typename"
},
v3 = [
  {
    "kind": "Variable",
    "name": "cloudId",
    "variableName": "cloudIdString"
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 30
  },
  {
    "kind": "Literal",
    "name": "input",
    "value": {
      "onlyEditableAgents": true
    }
  }
],
v4 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v5 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "name": "testRovoAgentSelectorQuery",
    "selections": [
      {
        "args": [
          (v1/*: any*/),
          {
            "kind": "Variable",
            "name": "cloudIdString",
            "variableName": "cloudIdString"
          }
        ],
        "kind": "FragmentSpread",
        "name": "rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference"
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "testRovoAgentSelectorQuery",
    "selections": [
      {
        "args": [
          (v1/*: any*/)
        ],
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
                    "name": "isAbleToCreateAgents"
                  }
                ]
              }
            ],
            "type": "AtlassianStudioUserSiteContextOutput"
          }
        ]
      },
      {
        "args": (v3/*: any*/),
        "concreteType": "AgentStudioAgentsConnection",
        "kind": "LinkedField",
        "name": "agentStudio_getAgents",
        "plural": false,
        "selections": [
          {
            "concreteType": "PageInfo",
            "kind": "LinkedField",
            "name": "pageInfo",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "name": "hasNextPage"
              },
              {
                "kind": "ScalarField",
                "name": "endCursor"
              }
            ]
          },
          {
            "concreteType": "AgentStudioAgentEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "concreteType": "AgentStudioAssistant",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "name": "id"
                  },
                  {
                    "kind": "ScalarField",
                    "name": "name"
                  },
                  {
                    "kind": "ScalarField",
                    "name": "externalConfigReference"
                  },
                  {
                    "kind": "ScalarField",
                    "name": "identityAccountId"
                  },
                  {
                    "kind": "ScalarField",
                    "name": "creatorType"
                  },
                  (v2/*: any*/)
                ]
              },
              {
                "kind": "ScalarField",
                "name": "cursor"
              }
            ]
          }
        ]
      },
      {
        "args": (v3/*: any*/),
        "filters": [
          "cloudId",
          "input"
        ],
        "handle": "connection",
        "key": "RovoAgent_agentStudio_getAgents",
        "kind": "LinkedHandle",
        "name": "agentStudio_getAgents"
      }
    ]
  },
  "params": {
    "id": "4e1430ebccae56212590a169f9caa58aa5e4e2365b6b58d8e5e3c77ccf8b7257",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "agentStudio_getAgents": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AgentStudioAgentsConnection"
        },
        "agentStudio_getAgents.edges": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "AgentStudioAgentEdge"
        },
        "agentStudio_getAgents.edges.cursor": (v4/*: any*/),
        "agentStudio_getAgents.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AgentStudioAssistant"
        },
        "agentStudio_getAgents.edges.node.__typename": (v5/*: any*/),
        "agentStudio_getAgents.edges.node.creatorType": (v4/*: any*/),
        "agentStudio_getAgents.edges.node.externalConfigReference": (v4/*: any*/),
        "agentStudio_getAgents.edges.node.id": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ID"
        },
        "agentStudio_getAgents.edges.node.identityAccountId": (v4/*: any*/),
        "agentStudio_getAgents.edges.node.name": (v4/*: any*/),
        "agentStudio_getAgents.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "agentStudio_getAgents.pageInfo.endCursor": (v4/*: any*/),
        "agentStudio_getAgents.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "atlassianStudio_userSiteContext": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AtlassianStudioUserSiteContextResult"
        },
        "atlassianStudio_userSiteContext.__typename": (v5/*: any*/),
        "atlassianStudio_userSiteContext.userPermissions": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AtlassianStudioUserProductPermissions"
        },
        "atlassianStudio_userSiteContext.userPermissions.isAbleToCreateAgents": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Boolean"
        }
      }
    },
    "name": "testRovoAgentSelectorQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "4e210e15f585c0d75bd6cf95bcfb0d6d";

export default node;
