import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Link } from 'react-router-dom';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  root1: {
    '& > *': {
      borderBottom: 'unset',
      backgroundColor: "rgba(0, 255, 0, 0.1)"
    },
  },
  root2: {
    '& > *': {
      borderBottom: 'unset',
      backgroundColor: "rgba(255, 0, 0, 0.08)"
    },
  },
});

function Row(props) {
  const { row, newDate, oldDate} = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const history = JSON.parse(row.history);
  var fix = 0;

  if (!history) {

  } else if (new Date(history[0].date) > newDate) {
    fix = 1;
  } else if (new Date(history[0].date) < oldDate) {
    fix = 2;
  };

  return (
    <React.Fragment>
      <TableRow className={fix === 1 ? classes.root1 : fix === 2 ? classes.root2 : classes.root }>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left" component="th" scope="row">
          <Link to={'/products/edit/' + row.id}> {row.name}</Link>
        </TableCell>
        <TableCell align="left">
          {row.quantity + "/" + row.unit}
        </TableCell>
        {/* <TableCell align="right">{row.unit}</TableCell> */}
        <TableCell align="left">{history ? history[0].date : ""}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Beskrivning
              </Typography>
              <Typography variant="body1" gutterBottom component="div">
                {row.info}
              </Typography>
              <Typography variant="body1" gutterBottom component="div">
                {"Scankod: " + row.code}
              </Typography>
              <Typography variant="h6" gutterBottom component="div">
                Historik
              </Typography>
              {history ?
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Inventerad</TableCell>
                      <TableCell>Antal</TableCell>
                      <TableCell align="right">Användare</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {history.map((historyRow) => (
                      <TableRow key={historyRow.date}>
                        <TableCell component="th" scope="row">
                          {historyRow.date}
                        </TableCell>
                        <TableCell>{historyRow.amount + "/" + row.unit}</TableCell>
                        <TableCell align="right">{historyRow.user}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                : ""}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    // history: PropTypes.arrayOf(
    //   PropTypes.shape({
    //     date: PropTypes.string.isRequired,
    //     user: PropTypes.string.isRequired,
    //     amount: PropTypes.number.isRequired,
    //   }),
    // ).isRequired,
    name: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired,
  }).isRequired,
};

export default function ProductsTable(props) {
  const { items } = props;
  console.log(items);
  var newDate = new Date();
  var oldDate = new Date();
  newDate.setDate(newDate.getDate() - 30);
  oldDate.setDate(oldDate.getDate() - 365);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="left">Namn</TableCell>
            <TableCell align="left">Antal</TableCell>
            <TableCell align="left">Inventerad</TableCell>
          </TableRow>
        </TableHead>
        {items ? 
        <TableBody>
          {items.map((row) => (
            <Row key={row.name} row={row} newDate={newDate} oldDate={oldDate}/>
          ))}
        </TableBody>
        : ""}
      </Table>
    </TableContainer>
  );
}
