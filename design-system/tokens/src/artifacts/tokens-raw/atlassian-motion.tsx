/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a05c62bc089a075de35d08a2570d9421>>
 * @codegenCommand yarn build tokens
 */

type TokenValue =
	| {
		duration: number;
		curve: string;
		keyframes?: string[];
		properties?: string[];
		delay?: number;
	};

type TokenValueOriginal =
	| {
		duration: string;
		curve: string;
		keyframes?: string[];
		properties?: string[];
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
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 150,
      "curve": "cubic-bezier(0.6, 0, 0.8, 0.6)",
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
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration150",
        "curve": "EasePracticalIn",
        "keyframes": [
          "ScaleIn80",
          "FadeIn"
        ]
      }
    },
    "name": "motion.avatar.enter",
    "path": [
      "motion",
      "avatar",
      "enter"
    ],
    "cleanName": "motion.avatar.enter"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 100,
      "curve": "cubic-bezier(0.32, 0, 0.67, 0)",
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
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration100",
        "curve": "Custom",
        "keyframes": [
          "ScaleOut80",
          "FadeOut"
        ]
      }
    },
    "name": "motion.avatar.exit",
    "path": [
      "motion",
      "avatar",
      "exit"
    ],
    "cleanName": "motion.avatar.exit"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 100,
      "curve": "cubic-bezier(0.32, 0, 0.67, 0)",
      "properties": [
        "transform"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration100",
        "curve": "Custom",
        "properties": [
          "Transform"
        ]
      }
    },
    "name": "motion.avatar.hovered",
    "path": [
      "motion",
      "avatar",
      "hovered"
    ],
    "cleanName": "motion.avatar.hovered"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 400,
      "curve": "cubic-bezier(0.4, 0, 0, 1)",
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
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration400",
        "curve": "EaseBoldInOut",
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
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 200,
      "curve": "cubic-bezier(0.4, 0, 0, 1)",
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
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration200",
        "curve": "EaseBoldInOut",
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
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 100,
      "curve": "cubic-bezier(0.4, 0, 0, 1)",
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
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration100",
        "curve": "EaseBoldInOut",
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
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 200,
      "curve": "cubic-bezier(0.4, 0, 0, 1)",
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
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration200",
        "curve": "EaseBoldInOut",
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
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 100,
      "curve": "cubic-bezier(0.4, 0, 0, 1)",
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
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration100",
        "curve": "EaseBoldInOut",
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
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 50,
      "curve": "cubic-bezier(0.4, 0, 0, 1)",
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
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration050",
        "curve": "EaseBoldInOut",
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
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 250,
      "curve": "cubic-bezier(0, 0.4, 0, 1)",
      "keyframes": [
        "SlideIn50PercentLeft",
        "FadeIn"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration250",
        "curve": "EaseBoldOut",
        "keyframes": [
          "SlideIn50PercentLeft",
          "FadeIn"
        ]
      }
    },
    "name": "motion.flag.enter",
    "path": [
      "motion",
      "flag",
      "enter"
    ],
    "cleanName": "motion.flag.enter"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 200,
      "curve": "cubic-bezier(0.6, 0, 0.8, 0.6)",
      "keyframes": [
        "SlideOut15PercentLeft",
        "FadeOut"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration200",
        "curve": "EasePracticalIn",
        "keyframes": [
          "SlideOut15PercentLeft",
          "FadeOut"
        ]
      }
    },
    "name": "motion.flag.exit",
    "path": [
      "motion",
      "flag",
      "exit"
    ],
    "cleanName": "motion.flag.exit"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 300,
      "curve": "cubic-bezier(0.4, 0, 0, 1)",
      "properties": [
        "transform"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration300",
        "curve": "EaseBoldInOut",
        "properties": [
          "Transform"
        ]
      }
    },
    "name": "motion.flag.reposition",
    "path": [
      "motion",
      "flag",
      "reposition"
    ],
    "cleanName": "motion.flag.reposition"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 200,
      "curve": "cubic-bezier(0.4, 0, 0, 1)",
      "keyframes": [
        "ScaleIn95",
        "FadeIn"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration200",
        "curve": "EaseBoldInOut",
        "keyframes": [
          "ScaleIn95",
          "FadeIn"
        ]
      }
    },
    "name": "motion.modal.enter",
    "path": [
      "motion",
      "modal",
      "enter"
    ],
    "cleanName": "motion.modal.enter"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 200,
      "curve": "cubic-bezier(0.4, 1, 0.6, 1)",
      "keyframes": [
        "ScaleOut95",
        "FadeOut"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration200",
        "curve": "EasePracticalOut",
        "keyframes": [
          "ScaleOut95",
          "FadeOut"
        ]
      }
    },
    "name": "motion.modal.exit",
    "path": [
      "motion",
      "modal",
      "exit"
    ],
    "cleanName": "motion.modal.exit"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 150,
      "curve": "cubic-bezier(0.4, 1, 0.6, 1)",
      "keyframes": [
        "SlideInBottom",
        "FadeIn"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration150",
        "curve": "EasePracticalOut",
        "keyframes": [
          "SlideInBottom",
          "FadeIn"
        ]
      }
    },
    "name": "motion.popup.enter.bottom",
    "path": [
      "motion",
      "popup",
      "enter",
      "bottom"
    ],
    "cleanName": "motion.popup.enter.bottom"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 150,
      "curve": "cubic-bezier(0.4, 1, 0.6, 1)",
      "keyframes": [
        "SlideInLeft",
        "FadeIn"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration150",
        "curve": "EasePracticalOut",
        "keyframes": [
          "SlideInLeft",
          "FadeIn"
        ]
      }
    },
    "name": "motion.popup.enter.left",
    "path": [
      "motion",
      "popup",
      "enter",
      "left"
    ],
    "cleanName": "motion.popup.enter.left"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 150,
      "curve": "cubic-bezier(0.4, 1, 0.6, 1)",
      "keyframes": [
        "SlideInRight",
        "FadeIn"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration150",
        "curve": "EasePracticalOut",
        "keyframes": [
          "SlideInRight",
          "FadeIn"
        ]
      }
    },
    "name": "motion.popup.enter.right",
    "path": [
      "motion",
      "popup",
      "enter",
      "right"
    ],
    "cleanName": "motion.popup.enter.right"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 150,
      "curve": "cubic-bezier(0.4, 1, 0.6, 1)",
      "keyframes": [
        "SlideInTop",
        "FadeIn"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration150",
        "curve": "EasePracticalOut",
        "keyframes": [
          "SlideInTop",
          "FadeIn"
        ]
      }
    },
    "name": "motion.popup.enter.top",
    "path": [
      "motion",
      "popup",
      "enter",
      "top"
    ],
    "cleanName": "motion.popup.enter.top"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 100,
      "curve": "cubic-bezier(0.6, 0, 0.8, 0.6)",
      "keyframes": [
        "SlideOutBottom",
        "FadeOut"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration100",
        "curve": "EasePracticalIn",
        "keyframes": [
          "SlideOutBottom",
          "FadeOut"
        ]
      }
    },
    "name": "motion.popup.exit.bottom",
    "path": [
      "motion",
      "popup",
      "exit",
      "bottom"
    ],
    "cleanName": "motion.popup.exit.bottom"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 100,
      "curve": "cubic-bezier(0.6, 0, 0.8, 0.6)",
      "keyframes": [
        "SlideOutLeft",
        "FadeOut"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration100",
        "curve": "EasePracticalIn",
        "keyframes": [
          "SlideOutLeft",
          "FadeOut"
        ]
      }
    },
    "name": "motion.popup.exit.left",
    "path": [
      "motion",
      "popup",
      "exit",
      "left"
    ],
    "cleanName": "motion.popup.exit.left"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 100,
      "curve": "cubic-bezier(0.6, 0, 0.8, 0.6)",
      "keyframes": [
        "SlideOutRight",
        "FadeOut"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration100",
        "curve": "EasePracticalIn",
        "keyframes": [
          "SlideOutRight",
          "FadeOut"
        ]
      }
    },
    "name": "motion.popup.exit.right",
    "path": [
      "motion",
      "popup",
      "exit",
      "right"
    ],
    "cleanName": "motion.popup.exit.right"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 100,
      "curve": "cubic-bezier(0.6, 0, 0.8, 0.6)",
      "keyframes": [
        "SlideOutTop",
        "FadeOut"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration100",
        "curve": "EasePracticalIn",
        "keyframes": [
          "SlideOutTop",
          "FadeOut"
        ]
      }
    },
    "name": "motion.popup.exit.top",
    "path": [
      "motion",
      "popup",
      "exit",
      "top"
    ],
    "cleanName": "motion.popup.exit.top"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 250,
      "curve": "cubic-bezier(0.4, 0, 0, 1)",
      "keyframes": [
        "ScaleIn95",
        "FadeIn"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration250",
        "curve": "EaseBoldInOut",
        "keyframes": [
          "ScaleIn95",
          "FadeIn"
        ]
      }
    },
    "name": "motion.spotlight.enter",
    "path": [
      "motion",
      "spotlight",
      "enter"
    ],
    "cleanName": "motion.spotlight.enter"
  },
  {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": 200,
      "curve": "cubic-bezier(0.4, 1, 0.6, 1)",
      "keyframes": [
        "ScaleOut95",
        "FadeOut"
      ]
    },
    "filePath": "schema/themes/atlassian-motion/motion.tsx",
    "isSource": true,
    "original": {
      "attributes": {
        "group": "motion",
        "state": "experimental",
        "introduced": "11.2.0",
        "description": ""
      },
      "value": {
        "duration": "Duration200",
        "curve": "EasePracticalOut",
        "keyframes": [
          "ScaleOut95",
          "FadeOut"
        ]
      }
    },
    "name": "motion.spotlight.exit",
    "path": [
      "motion",
      "spotlight",
      "exit"
    ],
    "cleanName": "motion.spotlight.exit"
  }
];

export default tokens;
