import React, { Component } from 'react';
import { Button, Paper } from "@material-ui/core";
import { Scanner } from '../../functions/Scanner';
import axios from 'axios';
import { Redirect } from 'react-router-dom'
import GridItem from '../../functions/GridItem';
import GridContainer from '../../functions/GridContainer';
import { WebUrl } from '../../api/config';
//import { Link } from 'react-router-dom';

class Pagination extends Component {
	state = {
		search: '',
		sortBy: 'name',
		sort: 'desc',
		limit: '100',
		page: '1',
		openScanner: false,
	}

	handlerChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
		console.log(e.target.value);
		setTimeout(() => this.props.callBack(this.state), 250);
	}

	changeScanner = () => {
		if (this.state.openScanner) {
			this.setState({ openScanner: false });
		} else {
			this.setState({ openScanner: true });
		}
	}
	editCode = e => {
		console.log(e);
        const token = localStorage.getItem('token')
        axios.get(WebUrl + '/products/_' + e, { headers: { authorization: token } })
			.then(res => {
				if (res && res.data && res.data.data) {
					console.log(e);
					console.log(res.data.data)
					this.props.fixHist.replace('/products/edit/' + res.data.data[0].id);
				} else {
					console.log(res);
					this.props.fixHist.replace({ pathname: '/add', state: e });
				}
			})
			.catch(err => console.log(err))
		this.setState({ search: e });
		this.setState({ openScanner: false });
		setTimeout(() => this.props.callBack(this.state), 250);
	}
	render() {
		var asc = "ASC";
		var desc = "DESC";
		if (this.state.sortBy === "date") {
			asc = "Äldsta";
			desc = "Senaste";
		} else if (this.state.sortBy === "name") {
			asc = "Första";
			desc = "Sista";
		} else if (this.state.sortBy === "unit") {
			asc = "Första";
			desc = "Sista";
		} else if (this.state.sortBy === "quantity") {
			asc = "Minst";
			desc = "Mest";
		}
		return (
			this.state.openScanner ?
				<Scanner change={this.editCode} value={""} close={this.changeScanner} />
				:
				<GridContainer>
					<GridItem xs={12} sm={12} md={12}>
						<Button color="primary" variant="outlined" fontSize="large" style={{marginBottom: "10px"}} className="form-control" onClick={this.changeScanner}>
							Scanna
					</Button>
					</GridItem>
					<GridItem xs={12} sm={12} md={6}>
						<input className="form-control mr-sm-2" style={{marginBottom: "10px"}} type="search" name="search" placeholder="Sök" aria-label="Search" onChange={this.handlerChange} />
					</GridItem>
					<GridItem xs={4} sm={4} md={2}>
						<select defaultValue="Sortera" className="form-control" name="sortBy" onChange={this.handlerChange}>
							<option disabled>Sortera</option>
							<option value="date">Datum</option>
							<option value="name">Namn</option>
							<option value="unit">Enhet</option>
							<option value="quantity">Antal</option>
						</select>
					</GridItem>
					<GridItem xs={4} sm={4} md={2}>
						<select defaultValue="ASC" className="form-control" name="sort" onChange={this.handlerChange}>
							<option value="asc">{asc}</option>
							<option value="desc">{desc}</option>
						</select>
					</GridItem>
					{/* <GridItem xs={4} sm={3} md={2}>
						<select defaultValue="15" className="form-control" name="limit" onChange={this.handlerChange}>
							<option value="6">6</option>
							<option value="9">9</option>
							<option value="12">12</option>
							<option value="15">15</option>
						</select>
					</GridItem> */}
					<GridItem xs={4} sm={4} md={2}>
						<select defaultValue="Sida" className="form-control" name="page" onChange={this.handlerChange}>
							<option disabled>Sida</option>
							{
								this.props.pagination.map(num => {
									return <option value={num} key={num}>{num}</option>
								})
							}
						</select>
					</GridItem>
				</GridContainer>

		)
	}

}
export default Pagination;
