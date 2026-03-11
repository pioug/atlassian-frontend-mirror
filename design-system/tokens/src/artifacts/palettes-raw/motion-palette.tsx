/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::863c43667e050d7cdb209823990418e0>>
 * @codegenCommand yarn build tokens
 */

type TokenValue =
	| string
	| number
	| {
		duration: number;
		curve: string;
		keyframes: string[];
		delay?: number;
	}
	| Record<string, any>;

type TokenValueOriginal =
	| string
	| number
	| {
		duration: string;
		curve: string;
		keyframes: string[];
		delay?: string;
	}
	| Record<string, any>;

type TokenAttributes = {
	group: string;
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

};

const tokens: Token[] = [
  {
    "value": "cubic-bezier(0.32, 0, 0.67, 0)",
    "attributes": {
      "group": "motion"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": "cubic-bezier(0.32, 0, 0.67, 0)",
      "attributes": {
        "group": "motion"
      }
    },
    "name": "motion.curve.CubicEaseIn",
    "path": [
      "motion",
      "curve",
      "CubicEaseIn"
    ]
  },
  {
    "value": "cubic-bezier(0.66, 0, 0.34, 1)",
    "attributes": {
      "group": "motion"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": "cubic-bezier(0.66, 0, 0.34, 1)",
      "attributes": {
        "group": "motion"
      }
    },
    "name": "motion.curve.CubicEaseInOut",
    "path": [
      "motion",
      "curve",
      "CubicEaseInOut"
    ]
  },
  {
    "value": "cubic-bezier(0.33, 1, 0.68, 1)",
    "attributes": {
      "group": "motion"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": "cubic-bezier(0.33, 1, 0.68, 1)",
      "attributes": {
        "group": "motion"
      }
    },
    "name": "motion.curve.CubicEaseOut",
    "path": [
      "motion",
      "curve",
      "CubicEaseOut"
    ]
  },
  {
    "value": 50,
    "attributes": {
      "group": "motion"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": 50,
      "attributes": {
        "group": "motion"
      }
    },
    "name": "motion.duration.Duration050",
    "path": [
      "motion",
      "duration",
      "Duration050"
    ]
  },
  {
    "value": 100,
    "attributes": {
      "group": "motion"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": 100,
      "attributes": {
        "group": "motion"
      }
    },
    "name": "motion.duration.Duration100",
    "path": [
      "motion",
      "duration",
      "Duration100"
    ]
  },
  {
    "value": 150,
    "attributes": {
      "group": "motion"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": 150,
      "attributes": {
        "group": "motion"
      }
    },
    "name": "motion.duration.Duration150",
    "path": [
      "motion",
      "duration",
      "Duration150"
    ]
  },
  {
    "value": 200,
    "attributes": {
      "group": "motion"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": 200,
      "attributes": {
        "group": "motion"
      }
    },
    "name": "motion.duration.Duration200",
    "path": [
      "motion",
      "duration",
      "Duration200"
    ]
  },
  {
    "value": 250,
    "attributes": {
      "group": "motion"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": 250,
      "attributes": {
        "group": "motion"
      }
    },
    "name": "motion.duration.Duration250",
    "path": [
      "motion",
      "duration",
      "Duration250"
    ]
  },
  {
    "value": 300,
    "attributes": {
      "group": "motion"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": 300,
      "attributes": {
        "group": "motion"
      }
    },
    "name": "motion.duration.Duration300",
    "path": [
      "motion",
      "duration",
      "Duration300"
    ]
  },
  {
    "value": 350,
    "attributes": {
      "group": "motion"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": 350,
      "attributes": {
        "group": "motion"
      }
    },
    "name": "motion.duration.Duration350",
    "path": [
      "motion",
      "duration",
      "Duration350"
    ]
  },
  {
    "value": 400,
    "attributes": {
      "group": "motion"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": 400,
      "attributes": {
        "group": "motion"
      }
    },
    "name": "motion.duration.Duration400",
    "path": [
      "motion",
      "duration",
      "Duration400"
    ]
  },
  {
    "value": {
      "0%": {
        "opacity": 0
      },
      "100%": {
        "opacity": 1
      }
    },
    "attributes": {
      "group": "keyframe"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": {
        "0%": {
          "opacity": 0
        },
        "100%": {
          "opacity": 1
        }
      },
      "attributes": {
        "group": "keyframe"
      }
    },
    "name": "motion.keyframe.FadeIn",
    "path": [
      "motion",
      "keyframe",
      "FadeIn"
    ]
  },
  {
    "value": {
      "0%": {
        "opacity": 1
      },
      "100%": {
        "opacity": 0
      }
    },
    "attributes": {
      "group": "keyframe"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": {
        "0%": {
          "opacity": 1
        },
        "100%": {
          "opacity": 0
        }
      },
      "attributes": {
        "group": "keyframe"
      }
    },
    "name": "motion.keyframe.FadeOut",
    "path": [
      "motion",
      "keyframe",
      "FadeOut"
    ]
  },
  {
    "value": {
      "0%": {
        "transform": "rotate(0deg)"
      },
      "100%": {
        "transform": "rotate(5deg)"
      }
    },
    "attributes": {
      "group": "keyframe"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": {
        "0%": {
          "transform": "rotate(0deg)"
        },
        "100%": {
          "transform": "rotate(5deg)"
        }
      },
      "attributes": {
        "group": "keyframe"
      }
    },
    "name": "motion.keyframe.RotateIn",
    "path": [
      "motion",
      "keyframe",
      "RotateIn"
    ]
  },
  {
    "value": {
      "0%": {
        "transform": "rotate(5deg)"
      },
      "100%": {
        "transform": "rotate(0deg)"
      }
    },
    "attributes": {
      "group": "keyframe"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": {
        "0%": {
          "transform": "rotate(5deg)"
        },
        "100%": {
          "transform": "rotate(0deg)"
        }
      },
      "attributes": {
        "group": "keyframe"
      }
    },
    "name": "motion.keyframe.RotateOut",
    "path": [
      "motion",
      "keyframe",
      "RotateOut"
    ]
  },
  {
    "value": {
      "0%": {
        "transform": "scale(0.8)"
      },
      "100%": {
        "transform": "scale(1)"
      }
    },
    "attributes": {
      "group": "keyframe"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": {
        "0%": {
          "transform": "scale(0.8)"
        },
        "100%": {
          "transform": "scale(1)"
        }
      },
      "attributes": {
        "group": "keyframe"
      }
    },
    "name": "motion.keyframe.ScaleIn80",
    "path": [
      "motion",
      "keyframe",
      "ScaleIn80"
    ]
  },
  {
    "value": {
      "0%": {
        "transform": "scale(0.85)"
      },
      "100%": {
        "transform": "scale(1)"
      }
    },
    "attributes": {
      "group": "keyframe"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": {
        "0%": {
          "transform": "scale(0.85)"
        },
        "100%": {
          "transform": "scale(1)"
        }
      },
      "attributes": {
        "group": "keyframe"
      }
    },
    "name": "motion.keyframe.ScaleIn85",
    "path": [
      "motion",
      "keyframe",
      "ScaleIn85"
    ]
  },
  {
    "value": {
      "0%": {
        "transform": "scale(0.9)"
      },
      "100%": {
        "transform": "scale(1)"
      }
    },
    "attributes": {
      "group": "keyframe"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": {
        "0%": {
          "transform": "scale(0.9)"
        },
        "100%": {
          "transform": "scale(1)"
        }
      },
      "attributes": {
        "group": "keyframe"
      }
    },
    "name": "motion.keyframe.ScaleIn90",
    "path": [
      "motion",
      "keyframe",
      "ScaleIn90"
    ]
  },
  {
    "value": {
      "0%": {
        "transform": "scale(0.95)"
      },
      "100%": {
        "transform": "scale(1)"
      }
    },
    "attributes": {
      "group": "keyframe"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": {
        "0%": {
          "transform": "scale(0.95)"
        },
        "100%": {
          "transform": "scale(1)"
        }
      },
      "attributes": {
        "group": "keyframe"
      }
    },
    "name": "motion.keyframe.ScaleIn95",
    "path": [
      "motion",
      "keyframe",
      "ScaleIn95"
    ]
  },
  {
    "value": {
      "0%": {
        "transform": "scale(1)"
      },
      "100%": {
        "transform": "scale(0.8)"
      }
    },
    "attributes": {
      "group": "keyframe"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": {
        "0%": {
          "transform": "scale(1)"
        },
        "100%": {
          "transform": "scale(0.8)"
        }
      },
      "attributes": {
        "group": "keyframe"
      }
    },
    "name": "motion.keyframe.ScaleOut80",
    "path": [
      "motion",
      "keyframe",
      "ScaleOut80"
    ]
  },
  {
    "value": {
      "0%": {
        "transform": "scale(1)"
      },
      "100%": {
        "transform": "scale(0.85)"
      }
    },
    "attributes": {
      "group": "keyframe"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": {
        "0%": {
          "transform": "scale(1)"
        },
        "100%": {
          "transform": "scale(0.85)"
        }
      },
      "attributes": {
        "group": "keyframe"
      }
    },
    "name": "motion.keyframe.ScaleOut85",
    "path": [
      "motion",
      "keyframe",
      "ScaleOut85"
    ]
  },
  {
    "value": {
      "0%": {
        "transform": "scale(1)"
      },
      "100%": {
        "transform": "scale(0.9)"
      }
    },
    "attributes": {
      "group": "keyframe"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": {
        "0%": {
          "transform": "scale(1)"
        },
        "100%": {
          "transform": "scale(0.9)"
        }
      },
      "attributes": {
        "group": "keyframe"
      }
    },
    "name": "motion.keyframe.ScaleOut90",
    "path": [
      "motion",
      "keyframe",
      "ScaleOut90"
    ]
  },
  {
    "value": {
      "0%": {
        "transform": "scale(1)"
      },
      "100%": {
        "transform": "scale(0.95)"
      }
    },
    "attributes": {
      "group": "keyframe"
    },
    "filePath": "schema/palettes/motion-palette.tsx",
    "isSource": true,
    "original": {
      "value": {
        "0%": {
          "transform": "scale(1)"
        },
        "100%": {
          "transform": "scale(0.95)"
        }
      },
      "attributes": {
        "group": "keyframe"
      }
    },
    "name": "motion.keyframe.ScaleOut95",
    "path": [
      "motion",
      "keyframe",
      "ScaleOut95"
    ]
  }
];

export default tokens;
