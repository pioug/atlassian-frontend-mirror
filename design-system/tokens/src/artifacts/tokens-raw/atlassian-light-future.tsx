/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::17a73ccf5d3b30eeaee16556ef650833>>
 * @codegenCommand yarn build tokens
 */

type TokenValue =	string;

type TokenValueOriginal =	string;

type TokenAttributes = {
	group: string;
	state: string;
	introduced: string;
	description: string;
	suggest?: string[];
	deprecated?: string;
	replacement?: string;
};


type Token = {
	value: TokenValue;
	filePath: string;
	isSource: boolean;
	attributes: TokenAttributes;
	original: {
		value: TokenValueOriginal;
		attributes: TokenAttributes;
	};
	name: string;
	path: string[];
	cleanName: string;
};

const tokens: Token[] = [
  {
    "attributes": {
      "group": "paint",
      "state": "active",
      "introduced": "0.0.15",
      "description": "Use for backgrounds of elements in a disabled state."
    },
    "value": "#28311B",
    "filePath": "schema/themes/atlassian-light-future/color/background.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "paint",
        "state": "active",
        "introduced": "0.0.15",
        "description": "Use for backgrounds of elements in a disabled state."
      },
      "value": "Lime1000"
    },
    "name": "color.background.disabled",
    "path": [
      "color",
      "background",
      "disabled"
    ],
    "cleanName": "color.background.disabled"
  }
];

export default tokens;
