import fs, { readdirSync } from 'node:fs'
import type { BuildEntry } from 'unbuild'
import { defineBuildConfig } from 'unbuild'
import replace from '@rollup/plugin-replace'
import dotenv from 'dotenv'

let config: dotenv.DotenvConfigOutput = { parsed: {} }
if (fs.existsSync('.env.local'))
  config = dotenv.config({ path: '.env.local' })
else
  config = dotenv.config({ path: '.env' })

function getEntriesList(): BuildEntry[] {
  const entries = readdirSync('src/checkin').filter((item) => {
    return item !== 'utils'
  }).map((item) => {
    return {
      input: `src/checkin/${item}/index.ts`,
      outDir: 'dist/',
      name: item,
    }
  })

  return entries
}

export default defineBuildConfig({
  entries: getEntriesList(),
  declaration: false,
  clean: true,

  rollup: {
    emitCJS: false,
    esbuild: {
      charset: 'utf8',
    },
  },
  hooks: {
    'rollup:options'(ctx, options) {
      const configObj = config.parsed || {}
      const processEnv: Record<string, string> = {}

      Object.entries(configObj).forEach(([key, value]) => {
        processEnv[`process.env.${key}`] = JSON.stringify(value)
      })

      options.plugins = [
        options.plugins,
        replace(
          { preventAssignment: true, values: processEnv },
        ),

      ]
    },
  },
})
