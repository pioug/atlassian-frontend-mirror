/**
 * @generated SignedSource<<e63e308972bf7598a41dace931a97e79>>
 * @relayHash f6ac233ad22f499446178b33637cf907
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 9dcccaf7e968d6f664a63cc233103225bda52375ae0bcd0713a625cdfd0c67eb

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type storiesRovoAgentSelectorQuery$variables = {
  cloudIdString: string;
};
export type storiesRovoAgentSelectorQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector">;
};
export type storiesRovoAgentSelectorQuery = {
  response: storiesRovoAgentSelectorQuery$data;
  variables: storiesRovoAgentSelectorQuery$variables;
};
({
  "__relay_internal__pv__migrateagentavatarcomponenttoadsrelayprovidertsx": migrateAgentAvatar_provider
} as {
  readonly __relay_internal__pv__migrateagentavatarcomponenttoadsrelayprovidertsx: {
    readonly get: () => boolean;
  };
});

import migrateAgentAvatar_provider from '../../src/ui/rovo-agent-selector/migrate-agent-avatar-component-to-ads.relayprovider';

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
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/)
    ],
    "kind": "Fragment",
    "name": "storiesRovoAgentSelectorQuery",
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
    "name": "storiesRovoAgentSelectorQuery",
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
    "id": "9dcccaf7e968d6f664a63cc233103225bda52375ae0bcd0713a625cdfd0c67eb",
    "metadata": {},
    "name": "storiesRovoAgentSelectorQuery",
    "operationKind": "query",
    "text": null,
    "providedVariables": {
      "__relay_internal__pv__migrateagentavatarcomponenttoadsrelayprovidertsx": migrateAgentAvatar_provider
    }
  }
};
})();

(node as any).hash = "2bd071f5b7f8de8a8a6330f3fec2021e";

export default node;
