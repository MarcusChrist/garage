import React, { Component } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios';
import { Scanner } from '../../functions/Scanner';
import { WebUrl } from '../../api/config';
import GridItem from '../../functions/GridItem';
import GridContainer from '../../functions/GridContainer';
import { Grid, TextField, InputAdornment, IconButton, Typography } from "@material-ui/core";
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';

class CreateProduct extends Component {

    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            categori: [],
            name: "",
            info: "",
            code: "",
            unit: 1,
            quantity: 0,
            created: false,
            openScanner: false
        }
    }
    onChangeName(e) {
        this.setState({
            name: e.target.value
        })
    }
    onChangeDescription(e) {
        this.setState({
            info: e.target.value
        })
    }
    onChangeImage(e) {
        this.setState({
            code: e.target.value
        })
    }
    onChangeCategory(e) {
        this.setState({
            unit: e.target.value
        })
    }
    onChangeQuantity(e) {
        if (Number(e.target.value) || e.target.value === "") {
            this.setState({
                quantity: e.target.value
            })
        }
    }
    onSubmit(e) {
        e.preventDefault();
        console.log(`create`)
        console.log(`name : ${this.state.name}`)
        console.log(`info : ${this.state.info}`)
        console.log(`unit : ${this.state.unit}`)

        const newTodo = {
            name: this.state.name,
            info: this.state.info,
            code: this.state.code,
            unit: this.state.unit,
            quantity: this.state.quantity,
        }
        const token = localStorage.getItem('token')

        axios.post('/products', newTodo, { headers: { authorization: token } })
            .then(this.postTimer.bind(this))
            .catch(err => console.log(err))

        this.setState({
            name: "",
            info: "",
            code: "",
            unit: 1,
            quantity: ""
        })
    }
    postTimer = () => {
        setTimeout(() => this.setState({ created: true }), 2000)
    }

    componentDidMount() {
        const token = localStorage.getItem('token')
        axios.get('/categories', { headers: { authorization: token } })
            .then(response => this.setState({ categori: response.data.data }))

        if (this.props.location.state) {
            this.setState({ code: this.props.location.state })
        }

    }

    changeScanner = () => {
        if (this.state.openScanner) {
            this.setState({ openScanner: false })
        } else {
            this.setState({ openScanner: true })
        }
    }

    editCode = e => {
        const token = localStorage.getItem('token')
        axios.get(WebUrl + `/products/${"_" + e}`, { headers: { authorization: token } })
            .then(res => {
                console.log(res);
				if (res && res.data && res.data.data) {
                    console.log("Hittad artikel!")
                    console.log(res.data.data)
                    alert("Scankoden finns redan för " + res.data.data[0]['name']);
                    // var answer = window.confirm("Streckkoden finns redan för " + res.data.data[0]['name'] + ".\nVill du använda streckkoden här istället?");
                    // if (answer) {
                    //     this.setState({ code: e });
                    //     //% UPPDATERA HÄMTAD PRODUKT MED TOM STRECKKOD FÖR ATT GE PLATS TILL NY PRODUKT
                    // }
                } else {
                    this.setState({ code: e });
                }
            })
            .catch(err => console.log(err))
        this.setState({ openScanner: false })
    }

    render() {
        console.log(this.props);
        const path = '/';
        const { created } = this.state
        if (created === true) {
            // return setTimeout(() => this.props.history.replace(path), 250)
            return (<Redirect push to={path} />)
        }
        return (
            <div style={{ height: '800px' }} className='beckground'>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        {this.state.openScanner ?
                            <Scanner change={this.editCode} value={this.state.code} close={this.changeScanner} />
                            :
                            // <Row>
                            <>
                                <Col style={{ backgroundColor: '#f5f8fa' }}>
                                    <br />
                                    <Form onSubmit={this.onSubmit}>
                                        <h1>Skapa Produkt</h1>
                                        <Form.Group >
                                            <Form.Label>Produkt Namn</Form.Label>
                                            <Form.Control name="name" value={this.state.name} placeholder="Namn på produkten" onChange={this.onChangeName} required />
                                        </Form.Group>
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="Beskrivning"
                                            name="info"
                                            multiline
                                            rows={6}
                                            style={{ width: "100%" }}
                                            variant="outlined"
                                            value={this.state.info}
                                            onChange={this.onChangeDescription}
                                            placeholder="Beskrivning av produkten"
                                        />
                                            <TextField
                                                label="Scankod"
                                                id="Scankod"
                                                name="code"
                                                style={{ width: "100%" }}
                                                onChange={this.onChangeImage}
                                                value={this.state.code}
                                                InputProps={{
                                                    endAdornment:
                                                        <InputAdornment position='end'>
                                                            <IconButton aria-label="timpriset" size="small" color="primary" onClick={this.changeScanner} >
                                                                <AddAPhotoIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                }}
                                            />
                                        <GridContainer>
                                            <GridItem xs={6} sm={6} md={6}>
                                                <Form.Group >
                                                    <Form.Label>Antal</Form.Label>
                                                    <Form.Control name="quantity" value={this.state.quantity} placeholder="Skriv in inventerat antal" onChange={this.onChangeQuantity} />
                                                </Form.Group>
                                            </GridItem>
                                            <GridItem xs={6} sm={6} md={6}>
                                                <Form.Group >
                                                    <Form.Label >Välj Enhet</Form.Label>
                                                    <Form.Control as="select" name="unit" onChange={this.onChangeCategory} required>
                                                        {this.state.categori ? this.state.categori.map(item => {
                                                            return <option value={item.unit} key={item.id}>{item.unit}</option>
                                                        }) 
                                                        : ""}
                                                    </Form.Control>
                                                </Form.Group>
                                            </GridItem>
                                        </GridContainer>
                                        <Grid container direction="row" justify="space-between">
                                            <Button variant="primary" type="submit">
                                                Skapa
                                            </Button>
                                            <Link to='/'>
                                                <Button variant="primary">
                                                    Tillbaka
                                                </Button>
                                            </Link>
                                        </Grid>
                                    </Form>
                                    <br />
                                </Col>
                                <Col ></Col>
                            </>
                            // </Row>
                        }
                    </GridItem>
                </GridContainer>
            </div>
        )
    }
}
export default CreateProduct