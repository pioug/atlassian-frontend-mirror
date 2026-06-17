/**
 * @generated SignedSource<<45ea233035690e4a669888cc30fd9725>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type mediaCardFragment_mediaItem$data = {
  readonly details: {
    readonly abuseClassification: {
      readonly classification: string | null;
      readonly confidence: string | null;
    } | null;
    readonly artifactsList: ReadonlyArray<{
      readonly createdAt: AGG$Long | null;
      readonly mimeType: string | null;
      readonly name: string;
      readonly processingStatus: string | null;
      readonly size: AGG$Long | null;
      readonly url: string | null;
    }> | null;
    readonly createdAt: AGG$Long | null;
    readonly failReason: string | null;
    readonly mediaMetadata: {
      readonly duration: number | null;
    } | null;
    readonly mediaType: string | null;
    readonly mimeType: string | null;
    readonly name: string | null;
    readonly preview: {
      readonly cdnUrl: string | null;
    } | null;
    readonly processingStatus: string | null;
    readonly representations: {
      readonly image: {
        readonly _empty: boolean | null;
      } | null;
    } | null;
    readonly size: AGG$Long | null;
  };
  readonly id: string;
  readonly type: string;
  readonly " $fragmentType": "mediaCardFragment_mediaItem";
};
export type mediaCardFragment_mediaItem$key = {
  readonly " $data"?: mediaCardFragment_mediaItem$data;
  readonly " $fragmentSpreads": FragmentRefs<"mediaCardFragment_mediaItem">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "name": "name"
},
v1 = {
  "kind": "ScalarField",
  "name": "size"
},
v2 = {
  "kind": "ScalarField",
  "name": "mimeType"
},
v3 = {
  "kind": "ScalarField",
  "name": "processingStatus"
},
v4 = {
  "kind": "ScalarField",
  "name": "createdAt"
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "name": "mediaCardFragment_mediaItem",
  "selections": [
    {
      "kind": "ScalarField",
      "name": "id"
    },
    {
      "kind": "ScalarField",
      "name": "type"
    },
    {
      "concreteType": "MediaFileDetails",
      "kind": "LinkedField",
      "name": "details",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/),
        {
          "kind": "ScalarField",
          "name": "mediaType"
        },
        (v3/*: any*/),
        {
          "kind": "ScalarField",
          "name": "failReason"
        },
        (v4/*: any*/),
        {
          "concreteType": "MediaFilePreview",
          "kind": "LinkedField",
          "name": "preview",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "name": "cdnUrl"
            }
          ]
        },
        {
          "concreteType": "MediaFileArtifact",
          "kind": "LinkedField",
          "name": "artifactsList",
          "plural": true,
          "selections": [
            (v4/*: any*/),
            (v2/*: any*/),
            (v0/*: any*/),
            (v3/*: any*/),
            (v1/*: any*/),
            {
              "kind": "ScalarField",
              "name": "url"
            }
          ]
        },
        {
          "concreteType": "MediaFileRepresentations",
          "kind": "LinkedField",
          "name": "representations",
          "plural": false,
          "selections": [
            {
              "concreteType": "MediaImageRepresentation",
              "kind": "LinkedField",
              "name": "image",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "name": "_empty"
                }
              ]
            }
          ]
        },
        {
          "concreteType": "MediaFileMetadata",
          "kind": "LinkedField",
          "name": "mediaMetadata",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "name": "duration"
            }
          ]
        },
        {
          "concreteType": "MediaFileAbuseClassification",
          "kind": "LinkedField",
          "name": "abuseClassification",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "name": "classification"
            },
            {
              "kind": "ScalarField",
              "name": "confidence"
            }
          ]
        }
      ]
    }
  ],
  "type": "MediaItem"
};
})();

(node as any).hash = "4e43f35ff56e6b31fe107eef88103ed3";

export default node;
