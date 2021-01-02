import React from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Download extends React.Component {
    render() {
        console.log(this.props);
        console.log(this.props.data);
        return (
            <ExcelFile element={<button ref={this.props.hiddenCreateFile} style={{ display: 'none' }} ></button>}>
                <ExcelSheet data={this.props.data} name="Inventeringslista">
                    <ExcelColumn label="Namn" value="name"/>
                    <ExcelColumn label="Inventerad" value={"history"}/>
                    <ExcelColumn label="Antal" value="quantity"/>
                    <ExcelColumn label="Enhet" value="unit"/>
                    <ExcelColumn label="Beskrivning" value="info"/>
                </ExcelSheet>
            </ExcelFile>
        );
    }
}
export default Download;
