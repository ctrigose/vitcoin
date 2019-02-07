import React from 'react'

class BitcoinValue extends React.Component {
    constructor(){
        super()

        this.state = {
            gdaxAPI: ""
        }
    }

    componentDidMount() {
        fetch('https://api.gdax.com/products/BTC-USD/ticker')
            .then(response => response.json())
            .then(data => this.setState({ gdaxAPI: data }));
        
    }

    componentWillUnmount() {
    
    }

    render(){
        return (
            <p>{this.state.gdaxAPI.price}</p>
        )
    }
}

export default BitcoinValue