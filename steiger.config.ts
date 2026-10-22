import { defineConfig } from 'steiger'
import fsd from '@feature-sliced/steiger-plugin'

export default defineConfig([
    ...fsd.configs.recommended,
    {
        // структура шарів задана завданням лаби
        rules: { 'fsd/insignificant-slice': 'off' },
    },
    {
        files: ['./src/app/**'],
        rules: { 'fsd/segments-by-purpose': 'off' },
    },
])