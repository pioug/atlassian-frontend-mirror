/**
 * @generated SignedSource<<ea87503f150f1fc7ef534e50ab7b96a5>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type rovoAgentSelector_agent$data = {
  readonly creatorType: string | null;
  readonly externalConfigReference: string | null;
  readonly id: string;
  readonly identityAccountId: string | null;
  readonly name: string | null;
  readonly " $fragmentSpreads": FragmentRefs<"agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar">;
  readonly " $fragmentType": "rovoAgentSelector_agent";
};
export type rovoAgentSelector_agent$key = {
  readonly " $data"?: rovoAgentSelector_agent$data;
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_agent">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "rovoAgentSelector_agent"
};

(node as any).hash = "d607ccdaeb49f2f3f4e81bf7bb531117";

export default node;
