/**
 * @generated SignedSource<<606ed41708dab3fb8b2d22415219a139>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar$data = {
  readonly identityAccount: {
    readonly picture: AGG$URL;
  } | null;
  readonly " $fragmentType": "agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar";
};
export type agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar$key = {
  readonly " $data"?: agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar$data;
  readonly " $fragmentSpreads": FragmentRefs<"agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "name": "agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar",
  "selections": [
    {
      "kind": "LinkedField",
      "name": "identityAccount",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "name": "picture"
        }
      ]
    }
  ],
  "type": "AgentStudioAssistant"
};

(node as any).hash = "900601355da11affdb15202f56190301";

export default node;
