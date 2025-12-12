/**
 * @generated SignedSource<<59a50d77649c9a818869844c7a9e066e>>
 * @relayHash c930928c98753ac978e9d47dff1db27d
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID ae4126215a436b52f1594afc4d5fa2165fefda5e0d029cc96c255c1278f7e8ca

import type { ConcreteRequest, Query } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type testRovoAgentSelectorOnChangeQuery$variables = {
  cloudId: string;
};
export type testRovoAgentSelectorOnChangeQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector">;
};
export type testRovoAgentSelectorOnChangeQuery = {
  response: testRovoAgentSelectorOnChangeQuery$data;
  variables: testRovoAgentSelectorOnChangeQuery$variables;
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
    "name": "testRovoAgentSelectorOnChangeQuery",
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
    "name": "testRovoAgentSelectorOnChangeQuery",
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
    "id": "ae4126215a436b52f1594afc4d5fa2165fefda5e0d029cc96c255c1278f7e8ca",
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
    "name": "testRovoAgentSelectorOnChangeQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "0d0f3fe885fbdba98e4222e7e5dc75cb";

export default node;
