/**
 * @generated SignedSource<<9e0ac1b6e5fbeae43b2b6c7f0315b8c5>>
 * @relayHash 1e5f1ac51962defa355a8e4fc5f6f0c3
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID f4510c750bb9e37fe8213079ec4ca852c4569515832605e86e6d46544ef3d6c5

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AgentStudioAgentCreatorType = "CUSTOMER" | "FORGE" | "GUIDED" | "OOTB" | "REMOTE_A2A" | "ROVO_CHAT" | "ROVO_DEV" | "%future added value";
export type AgentStudioAgentQueryInput = {
  creatorTypes?: ReadonlyArray<AgentStudioAgentCreatorType> | null;
  includeDraftAgents?: boolean | null;
  includeJiraCodingAgent?: boolean | null;
  includeRovoChatAgent?: boolean | null;
  name?: string | null;
  onlyEditableAgents?: boolean | null;
  onlyFavouriteAgents?: boolean | null;
  onlyMyAgents?: boolean | null;
  onlyPublishedEditableAgents?: boolean | null;
  onlyPublishedEditableAgentsWithForge?: boolean | null;
  onlyTemplateAgents?: boolean | null;
  onlyUnpublishedAgents?: boolean | null;
  onlyVerifiedAgents?: boolean | null;
};
export type rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery$variables = {
  after?: string | null;
  cloudIdString: string;
  enableAgentCreationFix: boolean;
  first?: number | null;
  input?: AgentStudioAgentQueryInput | null;
};
export type rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector">;
};
export type rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery = {
  response: rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery$data;
  variables: rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery$variables;
};
({
  "enableAgentCreationFix": enableAgentCreationFix_provider,
  "__relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider": enableAgentCreationFix_provider,
  "__relay_internal__pv__migrateagentavatarcomponenttoadsrelayprovidertsx": migrateAgentAvatar_provider
} as {
  readonly __relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider: {
    readonly get: () => boolean;
  };
  readonly __relay_internal__pv__migrateagentavatarcomponenttoadsrelayprovidertsx: {
    readonly get: () => boolean;
  };
  readonly enableAgentCreationFix: {
    readonly get: () => boolean;
  };
});

import migrateAgentAvatar_provider from '../migrate-agent-avatar-component-to-ads.relayprovider';
import enableAgentCreationFix_provider from '@atlaskit/rovo-agent-selector/hubs-management-rovo-agent-creation-fix.relayprovider';

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "cloudIdString"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "enableAgentCreationFix"
},
v3 = {
  "defaultValue": 30,
  "kind": "LocalArgument",
  "name": "first"
},
v4 = {
  "defaultValue": {
    "onlyEditableAgents": true
  },
  "kind": "LocalArgument",
  "name": "input"
},
v5 = {
  "kind": "Variable",
  "name": "after",
  "variableName": "after"
},
v6 = {
  "kind": "Variable",
  "name": "first",
  "variableName": "first"
},
v7 = {
  "kind": "Variable",
  "name": "input",
  "variableName": "input"
},
v8 = [
  (v5/*: any*/),
  {
    "kind": "Variable",
    "name": "cloudId",
    "variableName": "cloudIdString"
  },
  (v6/*: any*/),
  (v7/*: any*/)
],
v9 = {
  "kind": "ScalarField",
  "name": "id"
},
v10 = {
  "kind": "ScalarField",
  "name": "__typename"
},
v11 = [
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
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "name": "rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery",
    "selections": [
      {
        "args": [
          (v5/*: any*/),
          {
            "kind": "Variable",
            "name": "cloudIdString",
            "variableName": "cloudIdString"
          },
          (v6/*: any*/),
          (v7/*: any*/)
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
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
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
    "name": "rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery",
    "selections": [
      {
        "args": (v8/*: any*/),
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
                  (v9/*: any*/),
                  (v10/*: any*/),
                  {
                    "condition": "__relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider",
                    "kind": "Condition",
                    "passingValue": false,
                    "selections": (v11/*: any*/)
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
                          (v10/*: any*/),
                          {
                            "kind": "ScalarField",
                            "name": "picture"
                          },
                          (v9/*: any*/)
                        ]
                      }
                    ]
                  },
                  {
                    "condition": "__relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider",
                    "kind": "Condition",
                    "passingValue": true,
                    "selections": (v11/*: any*/)
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
        "args": (v8/*: any*/),
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
    "id": "f4510c750bb9e37fe8213079ec4ca852c4569515832605e86e6d46544ef3d6c5",
    "metadata": {},
    "name": "rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery",
    "operationKind": "query",
    "text": null,
    "providedVariables": {
      "enableAgentCreationFix": enableAgentCreationFix_provider,
      "__relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider": enableAgentCreationFix_provider,
      "__relay_internal__pv__migrateagentavatarcomponenttoadsrelayprovidertsx": migrateAgentAvatar_provider
    }
  }
};
})();

(node as any).hash = "8898283636f551cbf95680664a804dcc";

export default node;
