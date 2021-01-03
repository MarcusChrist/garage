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
import { Grid, IconButton, InputAdornment, TextField, Typography } from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from "@material-ui/core/InputLabel";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { WebUrl } from '../../api/config';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';

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
        addUp: false,
        mobile: false,
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({ mobile: this.mobileAndTabletCheck() })
        axios.get(WebUrl + `/products/${id}`)
            .then(res => {
                for (var key in res.data.data[0]) {
                    if (key === 'history') {
                        if (res.data.data[0][key] !== "") {
                            this.setState({ [key]: JSON.parse(res.data.data[0][key]) });
                        }
                    } else {
                        this.setState({ [key]: res.data.data[0][key] });
                    }
                }
                this.setState({ ['counted']: res.data.data[0]['quantity'] })
            })
            .catch(err => console.log(err))

        axios.get(WebUrl + '/categories')
            .then(response => this.setState({ categories: response.data.data }))
    }
    mobileAndTabletCheck = function () {
        let check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    editData = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    editSelect = e => {
        this.setState({ unit: e.target.value })
    }

    editCode = e => {
        axios.get(WebUrl + '/products?codefinder=_' + e)
            .then(res => {
                if (res.data.data) {
                    console.log(res.data.data);
                    console.log("Hittad artikel!");
                    if (res.data.data[0]['id'] === this.state.id) return;
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
                        const answer = window.confirm("Denna streckkod används redan.\nVill du ta fram den hittade produkten istället?");
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

    editData = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    delete = () => {
        const answer = window.confirm("Vill du verkligen ta bort denna produkt permanent?");
        if (answer) {
            const token = localStorage.getItem('token');

            axios.delete('/products/' + this.state.id, { headers: { authorization: token } })
                .then(this.getOut)
                .catch((err) => {
                    console.log(err);
                    this.getOut()
                });
        }

    }
    doSetTimeout = (i) => {
        setTimeout(() => {
            if (this.state.addUp) {
                this.setState({ counted: Number(this.state.counted + 1) });
                i -= 12;
                this.doSetTimeout(i);
            }
        }, i);
    }

    handleButtonPress = () => {
        this.setState({ counted: Number(this.state.counted + 1) });
        if (this.state.mobile) {
            this.setState({ addUp: true });
            this.doSetTimeout(400);
        }
    }
    
    handleButtonPressLong = () => {
        if (!this.state.mobile) {
            this.setState({ counted: Number(this.state.counted + 1) });
        }
        this.setState({ addUp: true });
        this.doSetTimeout(400);
    }

    handleButtonRelease = () => {
        this.setState({ addUp: false });
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
                                                        this.setState({ quantity: val.target.value, counted: val.target.value });
                                                    } else if (val.target.value === "" || val.target.value === "0") {
                                                        this.setState({ quantity: "0", counted: "0" });
                                                    }
                                                }}
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
                                                <GridItem xs={6} sm={6} md={5}>
                                                    <Grid container direction="column">
                                                        <Button onTouchStart={this.handleButtonPress} 
                                                        onTouchEnd={this.handleButtonRelease} onMouseDown={this.handleButtonPressLong}
                                                            onMouseUp={this.handleButtonRelease} onMouseLeave={this.handleButtonRelease} variant="success"
                                                            type="button" style={{ marginBottom: "30px", height: "90px" }}>
                                                            +
                                                        </Button>
                                                    </Grid>
                                                </GridItem>
                                                <GridItem xs={6} sm={6} md={7}>
                                                    <TextField
                                                        label="Inventerat Antal"
                                                        id="antal2"
                                                        value={counted ? counted : "0"}
                                                        style={{ width: "100%", marginBottom: "30px" }}
                                                        onChange={val => {
                                                            if (Number(val.target.value)) {
                                                                this.setState({ counted: val.target.value });
                                                            } else if (val.target.value === "" || val.target.value === "0") {
                                                                this.setState({ counted: "0" });
                                                            }
                                                        }}
                                                        inputProps={{ style: { fontSize: 50 } }} // font size of input text
                                                        InputLabelProps={{ style: { fontSize: 20 } }} // font size of input label
                                                    //className={classes.textfield}
                                                    />
                                                </GridItem>
                                                <Grid container direction="row" justify="space-between">
                                                    <GridItem xs={6} sm={6} md={5}>
                                                        <Grid container direction="row" justify="space-between">
                                                            <Button variant="success" type="button" style={{ marginBottom: "30px" }} onClick={val => { this.setState({ ['counted']: 0 }); }}>
                                                                0
                                                            </Button>
                                                            <Button variant="success" type="button" style={{ marginBottom: "30px" }} onClick={val => { this.setState({ ['counted']: (Number(counted) + 10) }); }}>
                                                                +10
                                                            </Button>
                                                            <Button variant="success" type="button" style={{ marginBottom: "30px" }} onClick={val => { this.setState({ ['counted']: (Number(counted) + 100) }); }}>
                                                                +100
                                                            </Button>
                                                        </Grid>
                                                    </GridItem>
                                                    <GridItem xs={6} sm={6} md={7}>
                                                        <Button variant="info" type="button" style={{ marginBottom: "30px", width: "100%" }} onClick={val => { if (counted > 0) this.setState({ ['counted']: (counted - 1) }); }}>
                                                            -
                                                        </Button>
                                                    </GridItem>
                                                    <GridItem xs={6} sm={6} md={5}>
                                                        <Button variant="success" type="submit" onClick={this.editSubmit} style={{ marginBottom: "15px", width: "100%" }}>
                                                            Klar!
                                                            </Button>
                                                    </GridItem>
                                                    <GridItem xs={6} sm={6} md={7}>
                                                        <Grid container direction="row" justify="space-between">
                                                            <Button variant="warning" type="submit" onClick={this.getOut} style={{ marginBottom: "15px" }}>
                                                                Avbryt
                                                            </Button>
                                                            <Button variant="danger" type="submit" onClick={this.delete} style={{ marginBottom: "15px" }}>
                                                                Radera
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
                                                InputProps={{
                                                    endAdornment:
                                                        <InputAdornment position='end'>
                                                            <IconButton aria-label="timpriset" size="small" color="primary" onClick={this.changeScanner} >
                                                                <AddAPhotoIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                }}
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
