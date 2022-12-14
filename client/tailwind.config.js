module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionDuration: {
        '0': '0ms',
      },
      height: {
        'screen-nav': 'calc(100vh - 56px)',
        'screen-nav-mob': 'calc(-webkit-fill-available - 56px)',
      },
      minHeight: {
        'screen-nav': 'calc(100vh - 56px)',
        'screen-nav-mob': 'calc(-webkit-fill-available - 56px)',
      }
    },
  },
  plugins: [],
}