import React, { Component } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { Scanner } from '../../functions/Scanner';
import GridItem from '../../functions/GridItem';
import GridContainer from '../../functions/GridContainer';
import CardBody from '../../functions/CardBody';
import Card from '../../functions/Card';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { WebUrl } from '../../api/config';
import BackupIcon from '@material-ui/icons/Backup';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import readXlsxFile from 'read-excel-file'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Download from '../../functions/download';

class Lists extends Component {
    state = {
        showTable: false,
        units: [],
        totals: 0,
        export: false,
    }

    hiddenGetFile = React.createRef();
    hiddenCreateFile = React.createRef();

    componentDidMount() {
        axios.get('/categories')
            .then(response => this.setState({ units: response.data.data }))
    }

    getFile = () => {
        this.hiddenGetFile.current.click();
    }

    handleGetFile = e => {
        e.preventDefault();
        readXlsxFile(e.target.files[0]).then((rows) => {
            this.setState({ showTable: rows, totals: rows.length });
        });
    }

    deleteRow = index => e => {
        var temp = this.state.showTable;
        temp.splice(index, 1);
        this.setState({ showTable: temp });
    }

    createProducts = () => {
        const token = localStorage.getItem('token')
        const answer = window.confirm("Har du förhandsgranskat listan och allt ser okej ut?\nTryck annars avbryt.");
        if (answer && token) {
            this.hiddenCreateFile.current.click();
            //this.setState({ download: true})
        } else {
            for (var i = 0; i < this.state.showTable.length; i++) {
                const newTodo = {
                    name: this.state.showTable[i][0],
                    code: this.state.showTable[i][1],
                    quantity: this.state.showTable[i][2],
                    unit: this.state.showTable[i][3],
                    info: this.state.showTable[i][4],
                }
                axios.post('/products', newTodo, { headers: { authorization: token } })
                    .then((response) => {
                        console.log(response);
                        if (response.data.message !== "Success insert data Product") {
                            alert("Något gick fel på  rad " + i + ": " + response.data.message);
                        } else {
                            //inläsningen gick bra
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    }

    createFile = () => {
        //öppna popup för alternativ, hämta hem "allproducts" med sökning som i newProducts, kanske använda samma sökalternativ som i översyn delen?

        var search = '%%';
        var sortBy = 'id';
        var sort = 'desc';
        var limit = '9999';
        var page = '1';

        axios.get(`/products?search=${search}&sortBy=${sortBy}&sort=${sort}&limit=${limit}&page=${page}`)
            .then(res => {
                var temp = res.data.data;
                for (var i = 0; i < temp.length; i++) {
                    temp[i].history = temp[i].history ? temp[i].history.substr(10, 19) : "Ej inventerad";
                }
                setTimeout(() => this.setState({ showTable: temp, totals: temp.length, export: true }), 500);
            })
            .catch(err => console.log(err));

    }

    render() {
        console.log(this.state.showTable);
        return (
            <div style={{ padding: "10px" }}>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardBody>
                                <GridContainer direction="row">
                                    <GridItem xs={12} sm={12} md={12}>
                                        <Grid container direction="row" justify="space-between">
                                            <Button variant="primary" onClick={this.createProducts} disabled={this.state.showTable ? false : true}>
                                                Skapa
                                            </Button>
                                            <Link to='/'>
                                                <Button variant="primary">
                                                    Tillbaka
                                                </Button>
                                            </Link>
                                        </Grid>
                                        <div style={{ marginBottom: "20px" }}></div>
                                    </GridItem>
                                    <GridItem xs={12} sm={6} md={6}>
                                        <IconButton color="primary" aria-label="readMany" size="medium" onClick={this.getFile}>
                                            <input type="file" style={{ display: 'none' }} ref={this.hiddenGetFile} onChange={this.handleGetFile} />
                                            <CloudDownloadIcon style={{ marginRight: "10px" }} />
                                            <Typography>IMPORTERA</Typography>
                                        </IconButton>
                                        <Typography>Skapa produkter från en excelfil. Varje rad blir en ny produkt med:</Typography>
                                        <Typography>Kolumn A = Namn, Kolumn B = Scankod, Kolumn C = Antal (lämna tom om inget antal är inventerat), Kolumn D = Enhet, Kolumn E = Beskrivning.</Typography>
                                        <div style={{ marginBottom: "20px" }}></div>
                                    </GridItem>
                                    <GridItem xs={12} sm={6} md={6}>
                                        <IconButton color="primary" aria-label="readMany" size="medium" onClick={this.createFile}>
                                                <Download data={this.state.showTable} hiddenCreateFile={this.hiddenCreateFile}/>
                                            <BackupIcon style={{ marginRight: "10px" }} />
                                            <Typography>EXPORTERA</Typography>
                                        </IconButton>
                                        <Typography>Sparar ner information om produkterna i en excelfil.</Typography>
                                        {/* <Typography>Välj vilka produkter som ska presenteras.</Typography> */}
                                        <div style={{ marginBottom: "20px" }}></div>
                                    </GridItem>
                                </GridContainer>
                                <Accordion disabled={this.state.showTable ? false : true} expanded={this.state.showTable ? true : false}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3a-content"
                                        id="panel3a-header"
                                    >
                                        <Typography>{"Förhandsgranskning av " + this.state.totals + " produkter."}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            {this.state.showTable && this.state.export ?
                                                <Table size="small" aria-label="purchases">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Rad</TableCell>
                                                            <TableCell>Namn</TableCell>
                                                            <TableCell>Inventerad</TableCell>
                                                            <TableCell>Antal</TableCell>
                                                            <TableCell>Enhet</TableCell>
                                                            <TableCell>Beskrivning</TableCell>
                                                            <TableCell align="right">Ta Bort</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {this.state.showTable.map((row, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell component="th" scope="row">{index + 1}</TableCell>
                                                                <TableCell>{row.name}</TableCell>
                                                                <TableCell>{row.history}</TableCell>
                                                                <TableCell>{row.quantity}</TableCell>
                                                                <TableCell>{row.unit}</TableCell>
                                                                <TableCell>{row.info}</TableCell>
                                                                <TableCell align="right">
                                                                    <IconButton color="primary" aria-label="readMany" size="medium" onClick={this.deleteRow(index)}>
                                                                        <DeleteForeverIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                                : this.state.showTable ?
                                                    <Table size="small" aria-label="purchases">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Rad</TableCell>
                                                                <TableCell>Namn</TableCell>
                                                                <TableCell>Scankod</TableCell>
                                                                <TableCell>Antal</TableCell>
                                                                <TableCell>Enhet</TableCell>
                                                                <TableCell>Beskrivning</TableCell>
                                                                <TableCell align="right">Ta Bort</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {this.state.showTable.map((row, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell component="th" scope="row">{index + 1}</TableCell>
                                                                    <TableCell>{row[0]}</TableCell>
                                                                    <TableCell>{row[1]}</TableCell>
                                                                    <TableCell>{row[2]}</TableCell>
                                                                    <TableCell style={this.state.units.find(element => element.unit === row[3]) ? null : { backgroundColor: "red" }}>{row[3]}</TableCell>
                                                                    <TableCell>{row[4]}</TableCell>
                                                                    <TableCell align="right">
                                                                        <IconButton color="primary" aria-label="readMany" size="medium" onClick={this.deleteRow(index)}>
                                                                            <DeleteForeverIcon />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                    : ""}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}
export default Lists;

