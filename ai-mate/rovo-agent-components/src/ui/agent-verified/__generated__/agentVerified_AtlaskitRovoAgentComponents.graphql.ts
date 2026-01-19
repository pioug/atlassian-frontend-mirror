/**
 * @generated SignedSource<<80d05744924cbc0bdc011e1a63323c52>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type agentVerified_AtlaskitRovoAgentComponents$data = {
  readonly isVerified: boolean | null | undefined;
  readonly " $fragmentType": "agentVerified_AtlaskitRovoAgentComponents";
};
export type agentVerified_AtlaskitRovoAgentComponents$key = {
  readonly " $data"?: agentVerified_AtlaskitRovoAgentComponents$data;
  readonly " $fragmentSpreads": FragmentRefs<"agentVerified_AtlaskitRovoAgentComponents">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "name": "agentVerified_AtlaskitRovoAgentComponents",
  "selections": [
    {
      "kind": "ScalarField",
      "name": "isVerified"
    }
  ],
  "type": "AgentStudioAssistant"
};

(node as any).hash = "7c196c0efd61b63c8a3de1c1b32e11ec";

export default node;
