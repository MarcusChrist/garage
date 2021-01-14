import React, { Component } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";


const catChoices = [
    "Lägg till",
    "Ta bort",
    "Ändra",
]
const defaultState = {
    showTable: false,
    importTable: false,
    units: [],
    totals: 0,
    catChoice: "",
    catChosen: "",
    catName: "",
}

class Admin extends Component {
    state = defaultState;

    hiddenGetFile = React.createRef();
    hiddenCreateFile = React.createRef();

    componentDidMount() {
        this.refreshPage();
    }

    getFile = () => {
        this.hiddenGetFile.current.click();
    }

    handleGetFile = e => {
        e.preventDefault();
        readXlsxFile(e.target.files[0]).then((rows) => {
            this.setState({ importTable: rows, totals: rows.length });
        });
    }

    deleteRow = index => e => {
        var temp = this.state.showTable;
        temp.splice(index, 1);
        this.setState({ showTable: temp });
    }
    deleteImportRow = index => e => {
        var temp = this.state.importTable;
        temp.splice(index, 1);
        this.setState({ importTable: temp });
    }

    createLists = () => {
        const token = localStorage.getItem('token');
        if (token) {
            this.hiddenCreateFile.current.click();
        };
    }
    createProducts = () => {
        const token = localStorage.getItem('token')
        const answer = window.confirm("Har du förhandsgranskat listan och allt ser okej ut?\nTryck annars avbryt.");
        if (answer && token) {
            for (var i = 0; i < this.state.importTable.length; i++) {
                const newTodo = {
                    name: this.state.importTable[i][0],
                    code: this.state.importTable[i][1],
                    quantity: this.state.importTable[i][2],
                    unit: this.state.importTable[i][3],
                    info: this.state.importTable[i][4],
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

        const token = localStorage.getItem('token')
        axios.get(`/products?search=${search}&sortBy=${sortBy}&sort=${sort}&limit=${limit}&page=${page}`, { headers: { authorization: token } })
            .then(res => {
                var temp = res.data.data;
                for (var i = 0; i < temp.length; i++) {
                    temp[i].history = temp[i].history ? temp[i].history.substr(10, 19) : "Ej inventerad";
                }
                setTimeout(() => this.setState({ showTable: temp, totals: temp.length }), 500);
            })
            .catch(err => console.log(err));

    }
    catStart = () => {
        if (this.state.catChoice === "") {
            alert("Tror du missat något!");
            return;
        }
        const token = localStorage.getItem('token');

        if (this.state.catChoice === "Lägg till") {
            if (this.state.catName === "") {
                alert("Tror du missat något!");
                return;
            }
            const result = this.state.units.find( ({unit}) => unit === this.state.catName);
            if (result) {
                alert("Denna enhet används redan!");
                return;
            } else {
                axios.post('/categories', { unit: this.state.catName }, { headers: { authorization: token } })
                    .then((response) => {   
                        this.refreshPage();
                        console.log(response);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }

        } else if (this.state.catChoice === "Ta bort") {
            if (this.state.catChosen === "") {
                alert("Tror du missat något!");
                return;
            }
            //%% Gör även en update på alla som har denna enhet
            axios.delete('/categories/' + this.state.catChosen, { headers: { authorization: token } })
                .then((response) => {
                    this.refreshPage();
                    console.log(response);
                })
                .catch((err) => {
                    console.log(err);
                });

        } else if (this.state.catChoice === "Ändra") {
            if (this.state.catChosen === "" || this.state.catName === "") {
                alert("Tror du missat något!");
                return;
            }
            const result = this.state.units.find( ({unit}) => unit === this.state.catName);
            if (result) {
                alert("Den nya enheten används redan!");
                return;
            } else {
                axios.patch('/categories/' + this.state.catChosen, { unit: this.state.catName }, { headers: { authorization: token } })
                    .then((response) => {
                        this.refreshPage();
                        console.log(response);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            //Ändra alla i en kategori till en annan som redan finns och ta bort den gamla kategorin
        }
    }

    refreshPage = () => {
        this.setState(defaultState);

        const token = localStorage.getItem('token')
        axios.get('/categories', { headers: { authorization: token } })
            .then((response) => { 
                if (response) {
                    console.log(response.data.data);
                    this.setState({ units: response.data.data }) 
                }
            })
    }

    render() {
        return (
            <div style={{ margin: "10px" }}>
                <Card>
                    <CardBody>
                        <GridContainer direction="row">
                            <GridItem xs={12} sm={12} md={12}>
                                <Grid container direction="row-reverse" justify="space-between">
                                    <Link to='/'>
                                        <Button variant="primary">
                                            Tillbaka
                                                </Button>
                                    </Link>
                                </Grid>
                                <div style={{ marginBottom: "20px" }}></div>
                            </GridItem>
                        </GridContainer>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>IMPORTERA</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={12}>
                                        {this.state.importTable ?
                                            <Button variant="primary" onClick={this.createProducts} disabled={this.state.importTable ? false : true}>
                                                IMPORTERA
                                                    </Button> :
                                            <IconButton color="primary" aria-label="readMany" size="medium" onClick={this.getFile}>
                                                <input type="file" style={{ display: 'none' }} ref={this.hiddenGetFile} onChange={this.handleGetFile} />
                                                <CloudDownloadIcon style={{ marginRight: "10px" }} />
                                                <Typography>VÄLJ EXCEL FIL</Typography>
                                            </IconButton>
                                        }
                                        <Typography>Skapa produkter från en excelfil. Varje rad blir en ny produkt med:</Typography>
                                        <Typography>Kolumn A = Namn, Kolumn B = Scankod, Kolumn C = Antal (lämna tom om inget antal är inventerat), Kolumn D = Enhet, Kolumn E = Beskrivning.</Typography>
                                        <div style={{ marginBottom: "20px" }}></div>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <Table style={{ width: "100%" }} aria-label="import">
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
                                                {this.state.importTable ? this.state.importTable.map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell component="th" scope="row">{index + 1}</TableCell>
                                                        <TableCell>{row[0]}</TableCell>
                                                        <TableCell>{row[1]}</TableCell>
                                                        <TableCell>{row[2]}</TableCell>
                                                        <TableCell style={this.state.units.find(element => element.unit === row[3]) ? null : { backgroundColor: "red" }}>{row[3]}</TableCell>
                                                        <TableCell>{row[4]}</TableCell>
                                                        <TableCell align="right">
                                                            <IconButton color="primary" aria-label="readMany" size="medium" onClick={this.deleteImportRow(index)}>
                                                                <DeleteForeverIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                )) : <></>}
                                            </TableBody>
                                        </Table>
                                    </GridItem>
                                </GridContainer>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1b-content"
                                id="panel1b-header"
                            >
                                <Typography>EXPORTERA</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={12}>
                                        {!this.state.showTable ?
                                            <IconButton color="primary" aria-label="readMany" size="medium" onClick={this.createFile}>
                                                <BackupIcon style={{ marginRight: "10px" }} />
                                                <Typography>SKAPA EXPORTFIL</Typography>
                                            </IconButton>
                                            // <Button variant="primary" onClick={this.createFile}>
                                            //     FÖRHANDSGRANSKA
                                            //     </Button>
                                            :
                                            <Download data={this.state.showTable} hiddenCreateFile={this.hiddenCreateFile} />
                                        }
                                        <Typography>Sparar ner information om produkterna i en excelfil.</Typography>
                                        {/* <Typography>Välj vilka produkter som ska presenteras.</Typography> */}
                                        <div style={{ marginBottom: "20px" }}></div>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <Table style={{ width: "100%" }} aria-label="export">
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
                                                {this.state.showTable ? this.state.showTable.map((row, index) => (
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
                                                )) : <></>}
                                            </TableBody>
                                        </Table>
                                    </GridItem>
                                </GridContainer>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1c-content"
                                id="panel1c-header"
                            >
                                <Typography>KATEGORIER</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <GridContainer style={{ width: "100%" }}>
                                    <GridItem xs={6} sm={4} md={2}>
                                        <select defaultValue="Välj händelse" className="form-control" name="unitSelect1" onChange={val => this.setState({ catChoice: val.target.value })}>
                                            <option disabled>Välj händelse</option>
                                            {catChoices.map(item => {
                                                return <option key={item} value={item}>{item}</option>
                                            })}
                                        </select>
                                        <div style={{ marginBottom: "20px" }}></div>
                                        {/* <FormControl style={{ width: "100%" }}>
                                            <InputLabel id="mittNamn2">Händelse</InputLabel>
                                            <Select
                                                labelId="mittNamn2"
                                                id="mittNamn"
                                                value={this.state.catChoice}
                                                onChange={val => this.setState({ catChoice: val.target.value })}
                                            >
                                                {catChoices.map(item => {
                                                    return <MenuItem value={item} key={item}>{item}</MenuItem>
                                                })}
                                            </Select>
                                        </FormControl> */}
                                    </GridItem>
                                    {this.state.catChoice === "Ändra" ?
                                        <GridItem xs={6} sm={3} md={2}>
                                            <select defaultValue="Välj enhet" className="form-control" name="unitSelect2" onChange={val => this.setState({ catChosen: val.target.value })}>
                                                <option disabled>Välj enhet</option>
                                                {this.state.units.map(item => {
                                                    return <option key={item.id} value={item.id}>{item.unit}</option>
                                                })}
                                            </select>
                                            {/* <FormControl style={{ width: "100%" }}>
                                                <InputLabel id="foundcat3a">Enhet</InputLabel>
                                                <Select
                                                    labelId="foundcata"
                                                    id="foundcat1a"
                                                    value={this.state.catChosen}
                                                    onChange={val => this.setState({ catChosen: val.target.value })}
                                                >
                                                    {this.state.units.map(item => {
                                                        return <MenuItem value={item} key={item.id}>{item.unit}</MenuItem>
                                                    })}
                                                </Select>
                                            </FormControl> */}
                                        </GridItem>
                                        : <></>}
                                    {this.state.catChoice === "Lägg till" || this.state.catChoice === "Ändra" ?
                                        <GridItem xs={6} sm={3} md={2}>
                                            <TextField
                                                label="Nytt Namn"
                                                id="kommantarer"
                                                value={this.state.catName ? this.state.catName : ""}
                                                style={{ width: "100%", marginTop: "-12px" }}
                                                onChange={val => { this.setState({'catName': val.target.value }); }}
                                            />
                                        </GridItem>
                                        : <></>}
                                    {this.state.catChoice === "Ta bort" ?
                                        <GridItem xs={6} sm={3} md={2}>
                                            <select defaultValue="Enhet" className="form-control" name="unitSelect3" onChange={val => this.setState({ catChosen: val.target.value })}>
                                                <option disabled>Enhet</option>
                                                {this.state.units.map(item => {
                                                    return <option key={item.id} value={item.id}>{item.unit}</option>
                                                })}
                                            </select>
                                        </GridItem>
                                        // <FormControl style={{ width: "100%" }}>
                                        //     <InputLabel id="foundcat3">Enhet</InputLabel>
                                        //     <Select
                                        //         labelId="foundcat2"
                                        //         id="foundcat1"
                                        //         value={this.state.catChosen}
                                        //         onChange={val => this.setState({ catChosen: val.target.value })}
                                        //     >
                                        //         {this.state.units.map(item => {
                                        //             return <MenuItem value={item} key={item.id}>{item.unit}</MenuItem>
                                        //         })}
                                        //     </Select>
                                        // </FormControl>
                                        : <></>}
                                <GridItem xs={2} sm={2} md={1}>
                                    <Button variant="primary" onClick={this.catStart} disabled={this.state.catChoice === ""}>
                                        OK
                                        </Button>
                                </GridItem>
                                </GridContainer>
                            <div style={{ marginBottom: "20px" }}></div>
                            </AccordionDetails>
                        </Accordion>
                    </CardBody>
                </Card>
            </div >
        );
    }
}
export default Admin;

