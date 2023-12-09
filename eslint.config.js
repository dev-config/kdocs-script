// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: false,
    jsx: false,
    ignores: [
      // eslint ignore globs here
    ],
  },
  {
    rules: {
      // overrides
      'object-shorthand': 'off',
      'no-console': 'off',
    },
  },
)
