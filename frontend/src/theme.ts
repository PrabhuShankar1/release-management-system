import { alpha, createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f4d47",
      light: "#4f7f78",
      dark: "#153833"
    },
    secondary: {
      main: "#c67c4e"
    },
    background: {
      default: "#f4efe7",
      paper: "#fffdf9"
    },
    text: {
      primary: "#1f2933",
      secondary: "#52606d"
    },
    success: {
      main: "#2f855a"
    },
    warning: {
      main: "#c98633"
    },
    info: {
      main: "#2b6cb0"
    },
    error: {
      main: "#c53030"
    },
    divider: alpha("#1f4d47", 0.1)
  },
  shape: {
    borderRadius: 18
  },
  typography: {
    fontFamily: '"Aptos", "Trebuchet MS", "Segoe UI", sans-serif',
    body1: {
      fontSize: "0.98rem",
      lineHeight: 1.65
    },
    body2: {
      fontSize: "0.9rem",
      lineHeight: 1.6
    },
    overline: {
      fontSize: "0.72rem",
      fontWeight: 700,
      letterSpacing: "0.14em",
      lineHeight: 1.4
    },
    h3: {
      fontSize: "2.35rem",
      fontWeight: 800,
      letterSpacing: "-0.03em",
      lineHeight: 1.05
    },
    h4: {
      fontSize: "1.9rem",
      fontWeight: 800,
      letterSpacing: "-0.03em",
      lineHeight: 1.1
    },
    h5: {
      fontSize: "1.35rem",
      fontWeight: 700,
      lineHeight: 1.15
    },
    h6: {
      fontSize: "1.05rem",
      fontWeight: 700,
      lineHeight: 1.2
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.45
    },
    subtitle2: {
      fontSize: "0.92rem",
      fontWeight: 600,
      lineHeight: 1.45
    },
    button: {
      fontSize: "0.95rem",
      fontWeight: 700,
      textTransform: "none"
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "radial-gradient(circle at top left, rgba(198, 124, 78, 0.18), transparent 32%), radial-gradient(circle at top right, rgba(31, 77, 71, 0.12), transparent 28%), #f4efe7"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          paddingTop: 18,
          paddingBottom: 18,
          verticalAlign: "middle",
          borderColor: alpha("#1f4d47", 0.08)
        },
        head: {
          fontSize: "0.78rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em"
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
          minHeight: 42
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #1f4d47 0%, #2b6a62 100%)",
          boxShadow: "0 18px 38px rgba(31, 77, 71, 0.18)",
          "&:hover": {
            background: "linear-gradient(135deg, #153833 0%, #1f4d47 100%)",
            boxShadow: "0 20px 42px rgba(31, 77, 71, 0.24)"
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          border: `1px solid ${alpha("#1f4d47", 0.08)}`,
          boxShadow: "0 16px 40px rgba(31, 41, 51, 0.08)"
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: alpha("#ffffff", 0.72),
          transition: "transform 180ms ease, box-shadow 180ms ease",
          alignItems: "center",
          "&:hover": {
            transform: "translateY(-1px)"
          },
          "&.Mui-focused": {
            boxShadow: `0 0 0 4px ${alpha("#c67c4e", 0.14)}`
          }
        }
      }
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          color: "#52606d"
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700
        }
      }
    }
  }
})

export default theme
