/**
 * @generated SignedSource<<08d9111dc6d7eaf1681eef60568f779d>>
 * @relayHash cade2a7b0ba151d626865c141ec036cb
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 42893a5fd94d781cbced44b67c09dfe30cd4c455a6287a36c83298f21dfe7a25

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
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "cloudIdString"
},
v2 = {
  "defaultValue": 30,
  "kind": "LocalArgument",
  "name": "first"
},
v3 = {
  "defaultValue": {
    "onlyEditableAgents": true
  },
  "kind": "LocalArgument",
  "name": "input"
},
v4 = {
  "kind": "Variable",
  "name": "after",
  "variableName": "after"
},
v5 = {
  "kind": "Variable",
  "name": "first",
  "variableName": "first"
},
v6 = {
  "kind": "Variable",
  "name": "input",
  "variableName": "input"
},
v7 = [
  (v4/*: any*/),
  {
    "kind": "Variable",
    "name": "cloudId",
    "variableName": "cloudIdString"
  },
  (v5/*: any*/),
  (v6/*: any*/)
],
v8 = {
  "kind": "ScalarField",
  "name": "id"
},
v9 = {
  "kind": "ScalarField",
  "name": "__typename"
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "name": "rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery",
    "selections": [
      {
        "args": [
          (v4/*: any*/),
          {
            "kind": "Variable",
            "name": "cloudIdString",
            "variableName": "cloudIdString"
          },
          (v5/*: any*/),
          (v6/*: any*/)
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
        "args": (v7/*: any*/),
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
                  (v8/*: any*/),
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
                          (v9/*: any*/),
                          {
                            "kind": "ScalarField",
                            "name": "picture"
                          },
                          (v8/*: any*/)
                        ]
                      }
                    ]
                  },
                  (v9/*: any*/)
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
        "args": (v7/*: any*/),
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
    "id": "42893a5fd94d781cbced44b67c09dfe30cd4c455a6287a36c83298f21dfe7a25",
    "metadata": {},
    "name": "rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery",
    "operationKind": "query",
    "text": null,
    "providedVariables": {
      "__relay_internal__pv__migrateagentavatarcomponenttoadsrelayprovidertsx": migrateAgentAvatar_provider
    }
  }
};
})();

(node as any).hash = "fdde85142cfb9d4acca9413a6e844dc2";

export default node;
