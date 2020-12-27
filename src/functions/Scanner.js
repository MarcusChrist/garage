import React, { Component } from 'react'
import QrReader from 'react-qr-scanner'
import { Grid, Button } from "@material-ui/core";
import BarcodeScannerComponent from "react-webcam-barcode-scanner";

export class Scanner extends Component {
    constructor(props) {

        super(props)
        this.state = {
            delay: 100,
            result: '',
            isOnline: true
        };

        this.handleScan = this.handleScan.bind(this);
    }

    componentWillUnmount() {
        this.state.isOnline = false;
    }
    
    handleScan(data) {
        this.setState({
            result: data,
        });
        if (data !== null) {
            console.log("nu2!")
            console.log(data);
            this.props.change(data);
        }
    }

    handleError(err) {
        console.error(err)
    }

    getOut = () => {
        this.props.history.replace('/');
    }

    render() {
        const previewStyle = {
            height: "100%",
            width: "100%",
        }
        return (
            <div >
                <QrReader
                    delay={this.state.delay}
                    style={previewStyle}
                    onError={this.handleError}
                    onScan={this.handleScan}
                />
                <BarcodeScannerComponent
                    width={"0px"} //% KAN BEHÖVAS BLI STÖRRE ELLER MINDRE, kolla vad som funkar
                    height={"0px"}
                    onUpdate={(err, result) => {
                        if (this.state.isOnline) {  
                            if (result) {
                                console.log("nu!")
                                this.props.change(result.text);
                            } else {
                                this.setState({
                                    result: '',
                                });
                            }
                        }
                    }}
                />
                <Grid container justify="space-between" direction="row">
                    {/* {this.props.value ? this.props.value : "Scanna kod"} */}
                    <Button color="primary" fontSize="large" onClick={this.props.close}>
                    {this.props.history ? "Tillbaka" : "Stäng"}
                    </Button>
                    {this.props.history ? 
                    <Button color="primary" fontSize="large" onClick={this.getOut}>
                        Avsluta
                    </Button>
                    : "" }
                </Grid>
            </div>
        )
    }
}