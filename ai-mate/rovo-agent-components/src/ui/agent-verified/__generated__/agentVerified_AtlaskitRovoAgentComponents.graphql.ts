/**
 * @generated SignedSource<<6f994eb6cfc0b034529be90d45643687>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
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
