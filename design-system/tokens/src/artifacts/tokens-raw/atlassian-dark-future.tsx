/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::98ec2ef3c3602f1046b2ecf3775d0f05>>
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
    "value": "#B3DF72",
    "filePath": "schema/themes/atlassian-dark-future/color/background.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "paint",
        "state": "active",
        "introduced": "0.0.15",
        "description": "Use for backgrounds of elements in a disabled state."
      },
      "value": "Lime300"
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
