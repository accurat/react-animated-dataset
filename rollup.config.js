import babel from 'rollup-plugin-babel'

export default {
  input: 'src/AnimatedDataset.js',
  external: ['react', 'd3-selection', 'd3-transition'],
  output: {
    format: 'esm',
    file: 'build/AnimatedDataset.js',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
}
