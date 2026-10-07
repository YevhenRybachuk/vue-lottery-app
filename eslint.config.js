import eslint from '@eslint/js'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    {
        ignores: [
            'dist/**',
            'node_modules/**'
        ]
    },

    eslint.configs.recommended,

    ...tseslint.configs.recommended,

    ...vue.configs['flat/recommended'],

    {
        files: ['**/*.{ts,tsx,vue}'],
        rules: {
            'vue/multi-word-component-names': 'off'
        }
    }
)