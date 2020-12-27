import { makeStyles, createStyles, Theme, createMuiTheme } from "@material-ui/core/styles";

const drawerWidth = 360;

export const useStyles = makeStyles((Theme) =>
    createStyles({
        dataTable: {
            marginBottom: "60px",
        },
    })
);

export const muiTheme = createMuiTheme({
    typography: {
        fontSize: 14,
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
    overrides: {
      // @ts-ignore
      MUIDataTableBodyCell: {
        root: {
            paddingTop:"0",
            paddingBottom:"0",
            paddingRight: "0",
        },
      }, 
    }
});