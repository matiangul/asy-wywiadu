module.exports = {
  purge: {
    content: ['./pages/**/*.tsx', './src/components/**/*.tsx'],
    options: {
      safelist: ['bg', 'border', 'text'].flatMap((elem) =>
        ['unseen', 'red', 'blue', 'miss', 'bomb', 'beige'].map((color) => `${elem}-${color}`)
      ),
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        unseen: '#4d8b37',
        red: '#bf211e',
        blue: '#2274a5',
        miss: '#ffc800',
        bomb: '#0a100d',
        beige: '#fff8f0',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/custom-forms')],
};
