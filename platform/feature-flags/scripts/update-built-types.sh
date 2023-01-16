#!/usr/bin/env bash

if [ -d "src" ]; then
    cp types.generated.ts src/types.ts
fi

# overwrite built d.ts with new types.ts if it exists
if [ -f "dist/types/types.d.ts" ]; then
    cp types.generated.ts dist/types/types.d.ts
fi
