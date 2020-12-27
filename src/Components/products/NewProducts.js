import React, { Component } from 'react';
import axios from 'axios';
import AddReduceDelete from './AddReduceDelete';
import Pagination from './Pagination';
import { Redirect } from 'react-router-dom';
import empty from '../../assets/Ellipsis-1s-100px.gif'


import { MuiThemeProvider } from '@material-ui/core/styles';
import ProductsTable from '../overview';
import { Grid } from '@material-ui/core';
import { muiTheme } from '../../styles/style';
import GridItem from '../../functions/GridItem';
import GridContainer from '../../functions/GridContainer';

class Products extends Component {
	state = {
		items: [],
		totals: 0,
		query: {
			search: '%%',
			sortBy: 'name',
			sort: 'asc',
			limit: '6',
			page: '1'
		},

		isLoading: true

	}

	componentDidMount() {
		const { search, sortBy, sort, limit, page } = this.state.query;
		axios.get(`/products?search=${search}&sortBy=${sortBy}&sort=${sort}&limit=${limit}&page=${page}`)
			.then(res => {
				setTimeout(() => this.setState({ items: res.data.data, totals: res.data.total.total, isLoading: false }), 500);
			})
			.catch(err => console.log(err))
	}

	delete = (id) => {
		const token = localStorage.getItem('token');

		axios.delete(`/products/${id}`, { headers: { authorization: token } })
			.catch(err => this.setState({ success: true }));

		this.setState({ items: this.state.items.filter(item => item.id !== id) })
	}

	queryString = (data) => {
		this.setState({ query: data })
		const { search, sortBy, sort, limit, page } = this.state.query;
		let url = `/products?search=${search}&sortBy=${sortBy}&sort=${sort}&limit=${limit}&page=${page}`;
		axios.get(url)
			.then(res => this.setState({ items: res.data.data, isLoading: false }))
			.catch(err => console.log(err))
	}

	pageNumber = () => {
		var data = [];
		const counter = Math.ceil(this.state.totals / this.state.query.limit);
		for (let i = 1; i <= counter; i++) {
			data.push(i);
		}
		return data
	}

	render() {
		const pageNum = this.pageNumber();
		return (
			<GridContainer>
			  <GridItem xs={12} sm={12} md={12}>
              <GridContainer justify="space-evenly">
                <GridItem xs={12} sm={12} md={12}>
				<div style={{ margin: '20px'}}>
					<Pagination callBack={this.queryString} pagination={pageNum} fixHist={this.props.fixHist} />
				</div>
                </GridItem>
              </GridContainer>
				<div style={{ margin: '5px' }}>
					<MuiThemeProvider theme={muiTheme}>
						<Grid // className={classes.dataTable}
						>
							<ProductsTable items={this.state.items} />
						</Grid>
					</MuiThemeProvider>
				</div>
                </GridItem>
              </GridContainer>
		)
	}

}
export default Products;
