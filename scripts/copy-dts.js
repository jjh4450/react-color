const fs = require('fs');
const path = require('path');
const { sync: globSync } = require('glob');

const SOURCE_DIR = 'types';
const TARGET_DIRS = ['./lib', './es'];

const dtsFiles = globSync(`${SOURCE_DIR}/**/*.d.ts`);

dtsFiles.forEach((filePath) => {
    const relativePath = path.relative(SOURCE_DIR, filePath);

    TARGET_DIRS.forEach((target) => {
        const destPath = path.join(target, relativePath);
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(filePath, destPath);
    });
});

console.log(`✅ TypeScript declaration files copied to ${TARGET_DIRS.join(', ')}`);
