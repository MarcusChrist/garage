import React, { Component } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Scanner } from '../../functions/Scanner';
import GridItem from '../../functions/GridItem';
import GridContainer from '../../functions/GridContainer';
import CardBody from '../../functions/CardBody';
import Card from '../../functions/Card';
import CardHeader from '../../functions/CardHeader';
import { Grid, TextField, Typography } from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from "@material-ui/core/InputLabel";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function refreshPage() {
    window.location.reload(false);
}

class EditProduct extends Component {
    state = {
        categories: [],
        unit: 1,
        edited: false,
        openScanner: false,
        counted: 0,
        autoOpened: false,
        openedOptions: false,
        locked: true,
    }

    componentDidMount() {
        const { id } = this.props.match.params;

        axios.get(`http://localhost:8080/products/${id}`)
            .then(res => {
                for (var key in res.data.data[0]) {
                    if (key === 'history') {
                        this.setState({ [key]: JSON.parse(res.data.data[0][key]) });
                    } else {
                        this.setState({ [key]: res.data.data[0][key] });
                    }
                }
                this.setState({ ['counted']: res.data.data[0]['quantity'] })
            })
            .catch(err => console.log(err))

        axios.get('http://localhost:8080/categories')
            .then(response => this.setState({ categories: response.data.data }))
    }

    editData = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    editSelect = e => {
        this.setState({ unit: e.target.value })
    }

    editCode = e => {
        axios.get('http://localhost:8080/products?codefinder=_' + e)
            .then(res => {
                if (res.data.data) {
                    console.log(res.data.data);
                    console.log("Hittad artikel!");
                    if (this.state.autoOpened) {
                        this.props.history.replace('/products/edit/' + res.data.data[0]['id']);
                        for (var key in res.data.data[0]) {
                            if (key === 'history') {
                                this.setState({ [key]: JSON.parse(res.data.data[0][key]) });
                            } else {
                                this.setState({ [key]: res.data.data[0][key] });
                            }
                        }
                        this.setState({ ['counted']: res.data.data[0]['quantity'] });
                    } else {
                        const answer = window.confirm("Denna streckkod används redan.\mVill du ta fram den hittade produkten istället?");
                        if (answer) {
                            this.props.history.replace('/products/edit/' + res.data.data[0]['id']);
                        }
                    }
                } else {
                    if (this.state.autoOpened) {
                        this.props.history.replace({ pathname: '/add', state: e });
                        //this.props.history.replace('/add');
                    } else {
                        this.setState({ code: e });
                    }
                }
            })
            .catch((err) => {
                this.setState({ autoOpened: false });
                console.log(err)
            });
        this.setState({ openScanner: false });
    }

    editSubmit = () => {
        const { id } = this.props.match.params;
        const token = localStorage.getItem('token');

        const { code, name, counted, unit, info, history } = this.state;
        if (this.state.quantity === counted) {
            var answer = window.confirm("Antalet har inte ändrats, vill du ändå godkänna inventeringen?");
            if (!answer) return;
        }
        const quantity = counted;
        axios.put(`/products/` + id, { code, name, quantity, unit, info, history }, { headers: { authorization: token } })
            .then(() => {
                this.setState({ locked: true, id: "", code: "", name: "", quantity: 0, unit: "", info: "", history: "", counted: 0, autoOpened: true, openScanner: true });
            });

    }

    getOut = () => {
        this.props.history.replace('/');
    }

    changeScanner = () => {
        if (this.state.openScanner) {
            this.setState({ openScanner: false })
            if (this.state.autoOpened) {
                this.getOut();
            }
        } else {
            this.setState({ openScanner: true })
        }
    }

    openOptions = () => {
        if (this.state.openedOptions) {
            this.setState({ openedOptions: false });
        } else {
            this.setState({ openedOptions: true });
        }
    }

    editData = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    changedOptions = e => {
        if (e.target.value === "cancel") {
            this.getOut();
        } else if (e.target.value === "unlock") {
            this.setState({ locked: false });
        } else if (e.target.value === "scan") {
            this.changeScanner();
        } else if (e.target.value === "delete") {
            this.delete(this.state.id);
        }
    }

	delete = (id) => {
        console.log(id);
        const answer = window.confirm("Vill du verkligen ta bort denna produkt permanent?");
        if (answer) {
            const token = localStorage.getItem('token');
    
            axios.delete(`/products/${id}`, { headers: { authorization: token } })
                .then(this.getOut)
                .catch((err) => {
                    console.log(err);
                    this.getOut()
                });
        }
            
    }
    
    render() {
        const { code, name, quantity, unit, info, history, edited, counted, locked } = this.state;
        //const path = '/products/' + this.props.match.params.id;
        const path = '/';
        if (edited === true) {
            return setTimeout(() => this.props.history.replace(path), 250)
        }
        return (
            <div style={{ padding: "10px" }}>
                {this.state.openScanner ?
                    <Scanner change={this.editCode} value={code} close={this.changeScanner} />
                    :
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                            <Card>
                                <CardHeader color="primary">
                                    <GridContainer>
                                        <GridItem xs={6} sm={6} md={6}>
                                            <TextField
                                                label="Namn"
                                                id="kommantarer"
                                                value={name ? name : ""}
                                                style={{ width: "100%" }}
                                                onChange={val => { this.setState({ ['name']: val.target.value }); }}
                                                disabled={locked}
                                            //className={classes.textfield}
                                            />
                                        </GridItem>
                                        <GridItem xs={3} sm={3} md={3}>
                                            <TextField
                                                label="Antal"
                                                id="antal"
                                                value={quantity ? quantity : 0}
                                                style={{ width: "100%" }}
                                                onChange={val => {
                                                    if (Number(val.target.value)) {
                                                        this.setState({ ['quantity']: val.target.value });
                                                        this.setState({ ['counted']: val.target.value });
                                                    }
                                                }}
                                                disabled={locked}
                                            //className={classes.textfield}
                                            />
                                        </GridItem>
                                        <GridItem xs={3} sm={3} md={3}>
                                            <FormControl style={{ width: "100%" }}>
                                                <InputLabel id="mittNamn2">Enhet</InputLabel>
                                                <Select
                                                    labelId="mittNamn2"
                                                    id="mittNamn"
                                                    value={unit}
                                                    onChange={this.editSelect}
                                                    disabled={locked}
                                                >
                                                    {this.state.categories.map(item => {
                                                        return <MenuItem value={item.unit} key={item.id}>{item.unit}</MenuItem>
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </GridItem>
                                    </GridContainer>
                                </CardHeader>
                                <CardBody>
                                    <GridContainer>
                                        <GridItem xs={12} sm={8} md={6}>
                                            <GridContainer>
                                                <GridItem xs={6} sm={6} md={8}>
                                                    <TextField
                                                        label="Inventerat Antal"
                                                        id="antal2"
                                                        value={counted ? counted : "0"}
                                                        disabled
                                                        style={{ width: "100%", marginBottom: "20px" }}
                                                        //onChange={val => { this.setState({ ['counted']: val.target.value }); }}
                                                        inputProps={{ style: { fontSize: 50 } }} // font size of input text
                                                        InputLabelProps={{ style: { fontSize: 20 } }} // font size of input label
                                                    //className={classes.textfield}
                                                    />
                                                </GridItem>
                                                <GridItem xs={6} sm={6} md={4}>
                                                    <Grid container direction="column">
                                                        <Button variant="success" type="button" style={{ marginBottom: "5px" }} onClick={val => { this.setState({ ['counted']: (Number(counted) + 1) }); }}>
                                                            +
                                                        </Button>
                                                        <Button variant="success" type="button" style={{ marginTop: "5px" }} onClick={val => { if (counted > 0) this.setState({ ['counted']: (counted - 1) }); }}>
                                                            -
                                                        </Button>
                                                    </Grid>
                                                </GridItem>
                                                <Grid container direction="row" justify="space-between">
                                                    <GridItem xs={6} sm={6} md={5}>
                                                        <Grid container direction="row" justify="space-between">
                                                            <Button variant="success" type="button" style={{ marginBottom: "15px" }} onClick={val => { this.setState({ ['counted']: 0 }); }}>
                                                                0
                                                            </Button>
                                                            <Button variant="success" type="button" style={{ marginBottom: "15px" }} onClick={val => { this.setState({ ['counted']: (Number(counted) + 10) }); }}>
                                                                +10
                                                            </Button>
                                                            <Button variant="success" type="button" style={{ marginBottom: "15px" }} onClick={val => { this.setState({ ['counted']: (Number(counted) + 100) }); }}>
                                                                +100
                                                            </Button>
                                                        </Grid>
                                                    </GridItem>
                                                    <GridItem xs={6} sm={6} md={4}>
                                                        <Grid container direction="row" justify="space-between">
                                                            <Button variant="success" type="submit" onClick={this.editSubmit} style={{ marginBottom: "15px" }}>
                                                                Klar!
                                                            </Button>
                                                            <FormControl>
                                                                <Select
                                                                    labelId="demo-controlled-open-select-label"
                                                                    id="demo-controlled-open-select"
                                                                    open={this.state.openedOptions}
                                                                    onClose={this.openOptions}
                                                                    onOpen={this.openOptions}
                                                                    onChange={this.changedOptions}
                                                                    value={""}
                                                                    style={{ display: 'none' }}
                                                                >
                                                                    <MenuItem value={"cancel"}>Avbryt</MenuItem>
                                                                    <MenuItem value={"unlock"}>Lås Upp</MenuItem>
                                                                    <MenuItem value={"scan"}>Ny Scan</MenuItem>
                                                                    <MenuItem value={"delete"}>Radera</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                            <Button variant="danger" type="reset" onClick={this.openOptions} style={{ marginBottom: "15px" }}>
                                                                Admin
                                                            </Button>
                                                        </Grid>
                                                    </GridItem>
                                                </Grid>
                                            </GridContainer>
                                        </GridItem>
                                        <GridItem xs={12} sm={4} md={6}>
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Beskrivning"
                                                name="info"
                                                multiline
                                                rows={6}
                                                style={{ width: "100%" }}
                                                variant="outlined"
                                                value={info ? info : ""}
                                                onChange={this.editData}
                                                disabled={locked}
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6}>
                                            <TextField
                                                label="Scankod"
                                                id="Scankod"
                                                name="code"
                                                style={{ width: "100%" }}
                                                onChange={this.editData}
                                                value={code ? code : ""}
                                                disabled={locked}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                </CardBody>
                            </Card>
                            {history ?
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Inventerad</TableCell>
                                            <TableCell>Användare</TableCell>
                                            <TableCell align="right">Antal</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {history.map((historyRow) => (
                                            <TableRow key={historyRow.date}>
                                                <TableCell component="th" scope="row">
                                                    {historyRow.date}
                                                </TableCell>
                                                <TableCell>{historyRow.user}</TableCell>
                                                <TableCell align="right">{historyRow.amount}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                : ""}
                        </GridItem>
                    </GridContainer>
                }
            </div>
            //             <Row>
            //                 <Col ></Col>
            //                 <Col style={{ backgroundColor: '#f5f8fa' }}>
            //                     <br /><h1>Ändra Produkt</h1>
            //                     <Form>
            //                     </Form></Col>
            //             </Row>
            //     }
            //     </Container>
            // </div >
        );
    }
}
export default EditProduct;



// import React, { Component} from 'react';
// import { Form, Button, Row, Col, Container } from 'react-bootstrap';
// import {Redirect} from 'react-router-dom';
// import axios from 'axios';

// function refreshPage() {
//     window.location.reload(false);
//   }
// class EditProduct extends Component {
//     state = {
//         categories : [],
//         category: 1,
//         edited : false
//     }


//     componentDidMount(){
//         const {id} = this.props.match.params;

//         axios.get(`http://localhost:8080/products/${id}`)
//         .then(res => {
//             for (var key in res.data.data[0]){
//                 this.setState({[key] : res.data.data[0][key]})
//             }
//         })
//         .catch(err => console.log(err))

//         axios.get('http://localhost:8080/categories')
//         .then(response => this.setState({categories: response.data.data }))
//     }

//     editData = e => {
//         this.setState({[e.target.name]: e.target.value})
//     }

//     editSelect = e => {
//         this.setState({category : e.target.value})
//     }

//     editSubmit = () => {
//         const {id} = this.props.match.params;
//         const token = localStorage.getItem('token');
//         console.log(`category : ${this.state.category}`)

//         const {name, image, category, quantity, description} = this.state;

//         axios.put(`/products/` + id, {name, image, category, quantity, description}, {headers: {authorization : token}})
//         .then(this.setState({edited: true}))

//     }


//     render() {
//         const {name, image, quantity, description, edited} = this.state;
//         const path = '/products/' + this.props.match.params.id;
//         if(edited === true){
//             return setTimeout(() => this.props.history.replace(path), 250)
//         }
//         return(
//           <div style={{height : '800px' } } className='beckground'>
//           <Container >
//               <Row>
//               <Col ></Col>
//               <Col style={{ backgroundColor: '#f5f8fa'}}>
//                   <br/><h1>Edit Product</h1>
//              <Form>
//                 <Form.Group >
//                     <Form.Label>Name Product</Form.Label>
//                     <Form.Control name="name" placeholder="Enter name product" onChange={this.editData} value={name} />
//                 </Form.Group>
//                 <Form.Group >
//                     <Form.Label>Description</Form.Label>
//                     <Form.Control name="description" placeholder="Enter description product" onChange={this.editData} value={description}/>
//                 </Form.Group>
//                 <Form.Group >
//                     <Form.Label>Image (Url)</Form.Label>
//                     <Form.Control name="image" placeholder="Enter image product" onChange={this.editData} value={image} />
//                 </Form.Group>
//                 <Form.Group >
//                     <Form.Label>Category</Form.Label>
//                     <Form.Label >Select category product</Form.Label>
//                     <Form.Control as="select"  onChange={this.editSelect}>
//                     <option selected>-- Select category --</option>
//                     {this.state.categories.map(item =>{
//                        return <option value={item.id}   key={item.id}>{item.category}</option>
//                         })
//                     }
//                     </Form.Control>

//                 </Form.Group>
//                 <Form.Group >
//                     <Form.Label>Quantity</Form.Label>
//                     <Form.Control name="quantity" placeholder="Enter quantity product" onChange={this.editData} value={quantity} />
//                 </Form.Group>
//                 <Button variant="primary" type="submit" onClick={this.editSubmit}>
//                     Submit
//                 </Button>
//             </Form></Col>
//                 </Row>
//             </Container>
//             </div>
//         )
//     }
// }
// export default EditProduct;
