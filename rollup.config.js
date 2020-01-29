import babel from 'rollup-plugin-babel'

export default {
  input: 'src/AnimatedDataset.js',
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
