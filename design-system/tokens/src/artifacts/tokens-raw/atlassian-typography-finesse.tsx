/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e6d2b4b5bf7fe4085d9ff5fa6ef38c0c>>
 * @codegenCommand yarn build tokens
 */

type TokenValue =
	| string;

type TokenValueOriginal =
	| {
		fontWeight: string;
		fontSize: string;
		lineHeight: string;
		fontFamily: string;
		fontStyle: string;
		letterSpacing: string;
	};

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
      "group": "typography",
      "state": "active",
      "introduced": "1.14.0",
      "description": "Headers in large components, such as modal dialogs. Migrate instances of H600 to Heading M."
    },
    "value": "normal 500 20px/24px \"Atlassian Sans\", ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Ubuntu, \"Helvetica Neue\", sans-serif",
    "filePath": "schema/themes/atlassian-typography-finesse/theme.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "typography",
        "state": "active",
        "introduced": "1.14.0",
        "description": "Headers in large components, such as modal dialogs. Migrate instances of H600 to Heading M."
      },
      "value": {
        "fontWeight": "FontWeight500",
        "fontSize": "FontSize20",
        "lineHeight": "LineHeight24",
        "fontFamily": "FontFamilyWebSansRefreshed",
        "fontStyle": "normal",
        "letterSpacing": "LetterSpacing0"
      }
    },
    "name": "font.heading.medium",
    "path": [
      "font",
      "heading",
      "medium"
    ],
    "cleanName": "font.heading.medium"
  },
  {
    "attributes": {
      "group": "typography",
      "state": "active",
      "introduced": "1.14.0",
      "description": "For headers in small components where space is limited. Migrate instances of H500 to Heading S."
    },
    "value": "normal 500 16px/20px \"Atlassian Sans\", ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Ubuntu, \"Helvetica Neue\", sans-serif",
    "filePath": "schema/themes/atlassian-typography-finesse/theme.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "typography",
        "state": "active",
        "introduced": "1.14.0",
        "description": "For headers in small components where space is limited. Migrate instances of H500 to Heading S."
      },
      "value": {
        "fontWeight": "FontWeight500",
        "fontSize": "FontSize16",
        "lineHeight": "LineHeight20",
        "fontFamily": "FontFamilyWebSansRefreshed",
        "fontStyle": "normal",
        "letterSpacing": "LetterSpacing0"
      }
    },
    "name": "font.heading.small",
    "path": [
      "font",
      "heading",
      "small"
    ],
    "cleanName": "font.heading.small"
  },
  {
    "attributes": {
      "group": "typography",
      "state": "active",
      "introduced": "1.14.0",
      "description": "For headers in small components where space is limited. Migrate instances of H400 to Heading XS."
    },
    "value": "normal 500 14px/20px \"Atlassian Sans\", ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Ubuntu, \"Helvetica Neue\", sans-serif",
    "filePath": "schema/themes/atlassian-typography-finesse/theme.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "typography",
        "state": "active",
        "introduced": "1.14.0",
        "description": "For headers in small components where space is limited. Migrate instances of H400 to Heading XS."
      },
      "value": {
        "fontWeight": "FontWeight500",
        "fontSize": "FontSize14",
        "lineHeight": "LineHeight20",
        "fontFamily": "FontFamilyWebSansRefreshed",
        "fontStyle": "normal",
        "letterSpacing": "LetterSpacing0"
      }
    },
    "name": "font.heading.xsmall",
    "path": [
      "font",
      "heading",
      "xsmall"
    ],
    "cleanName": "font.heading.xsmall"
  },
  {
    "attributes": {
      "group": "typography",
      "state": "active",
      "introduced": "1.14.0",
      "description": "For headers in fine print or tight spaces. Use sparingly. Migrate instances of H100, H200 and H300 to Heading XXS."
    },
    "value": "normal 500 12px/16px \"Atlassian Sans\", ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Ubuntu, \"Helvetica Neue\", sans-serif",
    "filePath": "schema/themes/atlassian-typography-finesse/theme.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "typography",
        "state": "active",
        "introduced": "1.14.0",
        "description": "For headers in fine print or tight spaces. Use sparingly. Migrate instances of H100, H200 and H300 to Heading XXS."
      },
      "value": {
        "fontWeight": "FontWeight500",
        "fontSize": "FontSize12",
        "lineHeight": "LineHeight16",
        "fontFamily": "FontFamilyWebSansRefreshed",
        "fontStyle": "normal",
        "letterSpacing": "LetterSpacing0"
      }
    },
    "name": "font.heading.xxsmall",
    "path": [
      "font",
      "heading",
      "xxsmall"
    ],
    "cleanName": "font.heading.xxsmall"
  }
];

export default tokens;
