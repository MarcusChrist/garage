import React, { Component } from 'react';

export default class DetailProduct extends Component {
  constructor (props) {
    super(props)
    this.state = {
      products: []
        }
    }
    componentDidMount(){
        const token = localStorage.getItem('token')
        axios.get(`/products/${this.state.products.id_product}`, { headers: { authorization: token } })
        .then(response => this.setState({products: response.data.data }))
    }
    render(){
        return(
            <React.Fragment>
                {this.state.products.map(item=>{
                    
                })}
            </React.Fragment>
                
        )
    }
}