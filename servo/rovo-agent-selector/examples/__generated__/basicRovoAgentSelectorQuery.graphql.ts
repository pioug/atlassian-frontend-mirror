/**
 * @generated SignedSource<<70a5b27aab2dfa0571e6cb3a15e06131>>
 * @relayHash ceb1114c7aa6ea006d89620e7513d9c3
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID cac513f03736672df11898e6825227d424cc38166c4a0213ad91076d53a3d897

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type basicRovoAgentSelectorQuery$variables = {
  cloudIdString: string;
};
export type basicRovoAgentSelectorQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector">;
};
export type basicRovoAgentSelectorQuery = {
  response: basicRovoAgentSelectorQuery$data;
  variables: basicRovoAgentSelectorQuery$variables;
};
({
  "__relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider": enableAgentCreationFix_provider,
  "__relay_internal__pv__migrateagentavatarcomponenttoadsrelayprovidertsx": migrateAgentAvatar_provider
} as {
  readonly __relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider: {
    readonly get: () => boolean;
  };
  readonly __relay_internal__pv__migrateagentavatarcomponenttoadsrelayprovidertsx: {
    readonly get: () => boolean;
  };
});

import migrateAgentAvatar_provider from '../../src/ui/rovo-agent-selector/migrate-agent-avatar-component-to-ads.relayprovider';
import enableAgentCreationFix_provider from '@atlaskit/rovo-agent-selector/hubs-management-rovo-agent-creation-fix.relayprovider';

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
v4 = [
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
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/)
    ],
    "kind": "Fragment",
    "name": "basicRovoAgentSelectorQuery",
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
        "name": "__relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider"
      },
      {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "__relay_internal__pv__migrateagentavatarcomponenttoadsrelayprovidertsx"
      }
    ],
    "kind": "Operation",
    "name": "basicRovoAgentSelectorQuery",
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
                  (v3/*: any*/),
                  {
                    "condition": "__relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider",
                    "kind": "Condition",
                    "passingValue": false,
                    "selections": (v4/*: any*/)
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
                  {
                    "condition": "__relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider",
                    "kind": "Condition",
                    "passingValue": true,
                    "selections": (v4/*: any*/)
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
    "id": "cac513f03736672df11898e6825227d424cc38166c4a0213ad91076d53a3d897",
    "metadata": {},
    "name": "basicRovoAgentSelectorQuery",
    "operationKind": "query",
    "text": null,
    "providedVariables": {
      "__relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider": enableAgentCreationFix_provider,
      "__relay_internal__pv__migrateagentavatarcomponenttoadsrelayprovidertsx": migrateAgentAvatar_provider
    }
  }
};
})();

(node as any).hash = "3826dcf1ed718d5287414727f1222fa9";

export default node;
