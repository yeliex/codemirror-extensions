import { readdirSync } from 'fs';
import { join, resolve } from 'path';
import { defineConfig } from 'vite';

const PACKAGES_BASE = resolve(__dirname, '../packages');

const packages = readdirSync(PACKAGES_BASE);

export default defineConfig({
    assetsInclude: [resolve(PACKAGES_BASE)],
    resolve: {
        alias: {
            ...packages.reduce((total: Record<string, string>, dir) => {
                total[`${dir}/README.md?raw`] = join(PACKAGES_BASE, dir, 'README.md?raw');
                total[`${dir}/README.md`] = join(PACKAGES_BASE, dir, 'README.md');
                total[dir] = join(PACKAGES_BASE, dir, 'src/index.ts');

                return total;
            }, {}),
        },
    },
});
