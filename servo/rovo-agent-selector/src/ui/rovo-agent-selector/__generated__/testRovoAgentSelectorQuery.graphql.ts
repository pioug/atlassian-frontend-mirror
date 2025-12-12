/**
 * @generated SignedSource<<bb6a4009749a1e66dc659d703f002b11>>
 * @relayHash 4c899bd93f28362592f84caca67e0430
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 76593c8c595064568c6b14b9d08a00e762c8436420a9cdd674814465906b7721

import type { ConcreteRequest, Query } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type testRovoAgentSelectorQuery$variables = {
  cloudId: string;
};
export type testRovoAgentSelectorQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector">;
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
  }
],
v1 = {
  "kind": "Variable",
  "name": "cloudId",
  "variableName": "cloudId"
},
v2 = [
  (v1/*: any*/),
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
v3 = {
  "enumValues": null,
  "nullable": true,
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
          (v1/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "rovoAgentSelector_AtlaskitRovoAgentSelector"
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
        "args": (v2/*: any*/),
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
                  {
                    "kind": "ScalarField",
                    "name": "__typename"
                  }
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
        "args": (v2/*: any*/),
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
    "id": "76593c8c595064568c6b14b9d08a00e762c8436420a9cdd674814465906b7721",
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
        "agentStudio_getAgents.edges.cursor": (v3/*: any*/),
        "agentStudio_getAgents.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AgentStudioAssistant"
        },
        "agentStudio_getAgents.edges.node.__typename": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "String"
        },
        "agentStudio_getAgents.edges.node.creatorType": (v3/*: any*/),
        "agentStudio_getAgents.edges.node.externalConfigReference": (v3/*: any*/),
        "agentStudio_getAgents.edges.node.id": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ID"
        },
        "agentStudio_getAgents.edges.node.identityAccountId": (v3/*: any*/),
        "agentStudio_getAgents.edges.node.name": (v3/*: any*/),
        "agentStudio_getAgents.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "agentStudio_getAgents.pageInfo.endCursor": (v3/*: any*/),
        "agentStudio_getAgents.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
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

(node as any).hash = "b6b34bf9b0c27f8042e08b3e7de8cf06";

export default node;
