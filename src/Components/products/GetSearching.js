import React, {Component} from 'react'
import Headers from '../page/Header'
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Button, Card} from 'react-bootstrap';
import { WebUrl } from '../../api/config';
const Todo = props => (
    <React.Fragment>

    <Card clasName='card'>
    <Link to={'/products/' + props.todo.id}><Card.Img variant="top" src={props.todo.image} /></Link>
    <Card.Body>
        <Card.Title>{props.todo.name}</Card.Title>
        <Card.Text>{props.todo.category}</Card.Text>
    </Card.Body>
    <Card.Body>
    <Link to={'/products/' + props.todo.id}><Button variant="primary"  size="sm">Description</Button></Link>
    </Card.Body>
    </Card>
    </React.Fragment>
)


export default class GetSearching extends Component {
    constructor(props){
        super(props)
        this.state = {
            item: [],
        }
    }

    componentDidMount() {
        let url = WebUrl + '/products/';
        
        const { name } = this.props.match.params;
        
        if(name){
            url += `?search=${name}`
        }
        
        const token = localStorage.getItem('token')
        axios.get(url, { headers: { authorization: token } })
        .then(res =>{
            this.setState({item: res.data.data})
        })
       
    }
    todoList(){
        return this.state.item.map(function(currentTodo){
            return <Todo todo={currentTodo} key={currentTodo.id} />;
        })
    }

    render(){
        
        return(
            <>
            <Headers />
            <div>{this.todoList()}</div>
            </>
        )
    }
}