/**
 * @generated SignedSource<<1aba12c2a84c7142fe9bb6cb185f8858>>
 * @relayHash 12880e14b0fefb818d1fe436550a007e
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 0c9c836fc51b7899a32beec408e08896c09fa2b7db495d9fecc9ecf35fd5ac5b

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type testRovoAgentSelectorQuery$variables = {
  cloudIdString: string;
};
export type testRovoAgentSelectorQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector">;
};
export type testRovoAgentSelectorQuery = {
  response: testRovoAgentSelectorQuery$data;
  variables: testRovoAgentSelectorQuery$variables;
};
({
  "__relay_internal__pv__migrateagentavatarcomponenttoadsrelayprovidertsx": migrateAgentAvatar_provider
} as {
  readonly __relay_internal__pv__migrateagentavatarcomponenttoadsrelayprovidertsx: {
    readonly get: () => boolean;
  };
});

import migrateAgentAvatar_provider from '../migrate-agent-avatar-component-to-ads.relayprovider';

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "cloudIdString"
},
v1 = [
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
v2 = {
  "kind": "ScalarField",
  "name": "id"
},
v3 = {
  "kind": "ScalarField",
  "name": "__typename"
},
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
},
v6 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/)
    ],
    "kind": "Fragment",
    "name": "testRovoAgentSelectorQuery",
    "selections": [
      {
        "args": [
          {
            "kind": "Variable",
            "name": "cloudIdString",
            "variableName": "cloudIdString"
          }
        ],
        "kind": "FragmentSpread",
        "name": "rovoAgentSelector_AtlaskitRovoAgentSelector"
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "__relay_internal__pv__migrateagentavatarcomponenttoadsrelayprovidertsx"
      }
    ],
    "kind": "Operation",
    "name": "testRovoAgentSelectorQuery",
    "selections": [
      {
        "args": (v1/*: any*/),
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
                  (v2/*: any*/),
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
                    "condition": "__relay_internal__pv__migrateagentavatarcomponenttoadsrelayprovidertsx",
                    "kind": "Condition",
                    "passingValue": true,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "name": "identityAccount",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          {
                            "kind": "ScalarField",
                            "name": "picture"
                          },
                          (v2/*: any*/)
                        ]
                      }
                    ]
                  },
                  (v3/*: any*/)
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
        "args": (v1/*: any*/),
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
    "id": "0c9c836fc51b7899a32beec408e08896c09fa2b7db495d9fecc9ecf35fd5ac5b",
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
        "agentStudio_getAgents.edges.node.id": (v6/*: any*/),
        "agentStudio_getAgents.edges.node.identityAccount": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "User"
        },
        "agentStudio_getAgents.edges.node.identityAccount.__typename": (v5/*: any*/),
        "agentStudio_getAgents.edges.node.identityAccount.id": (v6/*: any*/),
        "agentStudio_getAgents.edges.node.identityAccount.picture": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "URL"
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
        }
      }
    },
    "name": "testRovoAgentSelectorQuery",
    "operationKind": "query",
    "text": null,
    "providedVariables": {
      "__relay_internal__pv__migrateagentavatarcomponenttoadsrelayprovidertsx": migrateAgentAvatar_provider
    }
  }
};
})();

(node as any).hash = "8db3b84e2925ced54c87c578097fdbe6";

export default node;
