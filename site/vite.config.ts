import { defineConfig } from 'vite';
import { join, resolve } from 'path';
import { readdirSync } from 'fs';

const PACKAGES_BASE = resolve(__dirname, '../packages');

const packages = readdirSync(PACKAGES_BASE);

export default defineConfig({
    resolve: {
        alias: {
            ...packages.reduce((total: Record<string, string>, dir) => {
                total[dir] = join(PACKAGES_BASE, dir, 'src/index.ts');

                return total;
            }, {}),
        },
    },
});
