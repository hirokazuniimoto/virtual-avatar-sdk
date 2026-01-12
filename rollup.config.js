import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'dist/index.js',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
  ],
  external: ['three', '@pixiv/three-vrm', '@pixiv/three-vrm-animation'],
  plugins: [resolve(), commonjs()],
}

