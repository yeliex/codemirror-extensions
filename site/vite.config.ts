import { readdirSync } from 'fs';
import { join, resolve } from 'path';
import { type Alias, defineConfig } from 'vite';

const PACKAGES_BASE = resolve(__dirname, '../packages');

const packages = readdirSync(PACKAGES_BASE);

export default defineConfig({
    assetsInclude: [resolve(PACKAGES_BASE)],
    resolve: {
        alias: [
            ...packages.reduce((total, dir) => {
                total.push(
                    {
                        find: `${dir}/README.md?raw`,
                        replacement: join(PACKAGES_BASE, dir, 'README.md?raw'),
                    },
                    {
                        find: `${dir}/README.md`,
                        replacement: join(PACKAGES_BASE, dir, 'README.md'),
                    },
                    {
                        find: new RegExp(`^${dir}/(.*)$`),
                        replacement: join(PACKAGES_BASE, dir, 'src/$1'),
                    },
                    {
                        find: dir,
                        replacement: join(PACKAGES_BASE, dir, 'src/index.ts'),
                    },
                );

                return total;
            }, [] as Alias[]),
        ],
    },
});
