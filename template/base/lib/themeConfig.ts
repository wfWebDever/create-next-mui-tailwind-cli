// the Breakpoints same with the tailwind config
export const themeConfig = {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          letterSpacing: 0
        }
      }
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 992,
      xl: 1440
    }
  },
  palette: {
    primary: {
      main: '#050A22'
    },
    secondary: {
      main: '#75798D'
    }
  }
}
