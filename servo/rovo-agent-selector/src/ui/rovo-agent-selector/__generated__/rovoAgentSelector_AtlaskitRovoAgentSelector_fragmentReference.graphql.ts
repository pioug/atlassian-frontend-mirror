/**
 * @generated SignedSource<<1f4f32857f85d387b5c83de3ccb41965>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference$data = {
  readonly atlassianStudio_userSiteContext: {
    readonly isCustomAgentsAvailable?: boolean | null | undefined;
    readonly userPermissions?: {
      readonly isAbleToCreateAgents: boolean | null | undefined;
    } | null | undefined;
  } | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector_RovoAgentSelectorInternal_fragmentReference">;
  readonly " $fragmentType": "rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference";
};
export type rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference$key = {
  readonly " $data"?: rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference$data;
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
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
  "kind": "Fragment",
  "name": "rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference",
  "selections": [
    {
      "args": [
        {
          "kind": "Variable",
          "name": "cloudId",
          "variableName": "cloudId"
        }
      ],
      "kind": "LinkedField",
      "name": "atlassianStudio_userSiteContext",
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "kind": "ScalarField",
              "name": "isCustomAgentsAvailable"
            },
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
      "args": [
        {
          "kind": "Variable",
          "name": "cloudIdString",
          "variableName": "cloudIdString"
        }
      ],
      "kind": "FragmentSpread",
      "name": "rovoAgentSelector_AtlaskitRovoAgentSelector_RovoAgentSelectorInternal_fragmentReference"
    }
  ],
  "type": "Query"
};

(node as any).hash = "8142c244d3311e8ac714f20dff658129";

export default node;
