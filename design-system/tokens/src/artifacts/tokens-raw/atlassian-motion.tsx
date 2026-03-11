/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2a5ddbfd4356a65a3955ab62d7341a46>>
 * @codegenCommand yarn build tokens
 */

type TokenValue =
	| {
		duration: number;
		curve: string;
		keyframes: string[];
		delay?: number;
	};

type TokenValueOriginal =
	| {
		duration: string;
		curve: string;
		keyframes: string[];
		delay?: string;
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
      "group": "motion",
      "state": "experimental",
      "introduced": "11.1.0",
      "description": ""
    },
    "value": {
      "duration": 400,
      "curve": "cubic-bezier(0.66, 0, 0.34, 1)",
      "keyframes": [
        "FadeIn"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.1.0",
        "description": ""
      },
      "value": {
        "duration": "Duration400",
        "curve": "CubicEaseInOut",
        "keyframes": [
          "FadeIn"
        ]
      }
    },
    "name": "motion.content.enter.long",
    "path": [
      "motion",
      "content",
      "enter",
      "long"
    ],
    "cleanName": "motion.content.enter.long"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.1.0",
      "description": ""
    },
    "value": {
      "duration": 200,
      "curve": "cubic-bezier(0.66, 0, 0.34, 1)",
      "keyframes": [
        "FadeIn"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.1.0",
        "description": ""
      },
      "value": {
        "duration": "Duration200",
        "curve": "CubicEaseInOut",
        "keyframes": [
          "FadeIn"
        ]
      }
    },
    "name": "motion.content.enter.medium",
    "path": [
      "motion",
      "content",
      "enter",
      "medium"
    ],
    "cleanName": "motion.content.enter.medium"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.1.0",
      "description": ""
    },
    "value": {
      "duration": 100,
      "curve": "cubic-bezier(0.66, 0, 0.34, 1)",
      "keyframes": [
        "FadeIn"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.1.0",
        "description": ""
      },
      "value": {
        "duration": "Duration100",
        "curve": "CubicEaseInOut",
        "keyframes": [
          "FadeIn"
        ]
      }
    },
    "name": "motion.content.enter.short",
    "path": [
      "motion",
      "content",
      "enter",
      "short"
    ],
    "cleanName": "motion.content.enter.short"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.1.0",
      "description": ""
    },
    "value": {
      "duration": 200,
      "curve": "cubic-bezier(0.66, 0, 0.34, 1)",
      "keyframes": [
        "FadeOut"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.1.0",
        "description": ""
      },
      "value": {
        "duration": "Duration200",
        "curve": "CubicEaseInOut",
        "keyframes": [
          "FadeOut"
        ]
      }
    },
    "name": "motion.content.exit.long",
    "path": [
      "motion",
      "content",
      "exit",
      "long"
    ],
    "cleanName": "motion.content.exit.long"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.1.0",
      "description": ""
    },
    "value": {
      "duration": 100,
      "curve": "cubic-bezier(0.66, 0, 0.34, 1)",
      "keyframes": [
        "FadeOut"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.1.0",
        "description": ""
      },
      "value": {
        "duration": "Duration100",
        "curve": "CubicEaseInOut",
        "keyframes": [
          "FadeOut"
        ]
      }
    },
    "name": "motion.content.exit.medium",
    "path": [
      "motion",
      "content",
      "exit",
      "medium"
    ],
    "cleanName": "motion.content.exit.medium"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.1.0",
      "description": ""
    },
    "value": {
      "duration": 50,
      "curve": "cubic-bezier(0.66, 0, 0.34, 1)",
      "keyframes": [
        "FadeOut"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.1.0",
        "description": ""
      },
      "value": {
        "duration": "Duration050",
        "curve": "CubicEaseInOut",
        "keyframes": [
          "FadeOut"
        ]
      }
    },
    "name": "motion.content.exit.short",
    "path": [
      "motion",
      "content",
      "exit",
      "short"
    ],
    "cleanName": "motion.content.exit.short"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.1.0",
      "description": ""
    },
    "value": {
      "duration": 350,
      "curve": "cubic-bezier(0.66, 0, 0.34, 1)",
      "keyframes": [
        "ScaleIn80",
        "FadeIn"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.1.0",
        "description": ""
      },
      "value": {
        "duration": "Duration350",
        "curve": "CubicEaseInOut",
        "keyframes": [
          "ScaleIn80",
          "FadeIn"
        ]
      }
    },
    "name": "motion.dialog.enter",
    "path": [
      "motion",
      "dialog",
      "enter"
    ],
    "cleanName": "motion.dialog.enter"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.1.0",
      "description": ""
    },
    "value": {
      "duration": 350,
      "curve": "cubic-bezier(0.66, 0, 0.34, 1)",
      "keyframes": [
        "ScaleOut80",
        "FadeOut"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.1.0",
        "description": ""
      },
      "value": {
        "duration": "Duration350",
        "curve": "CubicEaseInOut",
        "keyframes": [
          "ScaleOut80",
          "FadeOut"
        ]
      }
    },
    "name": "motion.dialog.exit",
    "path": [
      "motion",
      "dialog",
      "exit"
    ],
    "cleanName": "motion.dialog.exit"
  }
];

export default tokens;
