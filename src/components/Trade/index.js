import React from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase'

import { Banner } from 'rendition'


class Trade extends React.Component {

    constructor(){
        super()

        this.state = {
            email: "",
            username: "",
            uid: "",
            wallet: {
                btc: 0,
                usd: 0
            },
            trade:{
                buy: 0,
                sell: 0,
                transactions: []
            },
            btcPrice: 0
        }
    }

    componentDidMount(){
        // Get user data from Firebase
        this.props.firebase.users().on('value', snapshot => {
            const key = Object.keys(snapshot.val())[0]
            this.setState(snapshot.val()[key])
            this.setState({uid: key})
        })

        // Get btc price from Coinbase Pro Websocket
        const subscribe = {
            type: "subscribe",
            channels: [
                {
                name: "ticker",
                product_ids: ["BTC-USD"]
                }
            ]
        }   
        this.ws = new WebSocket("wss://ws-feed.gdax.com")
        this.ws.onopen = () => this.ws.send(JSON.stringify(subscribe))
        this.ws.onmessage = e => {
            const value = JSON.parse(e.data)
            if (value.type !== "ticker") {
                return
            }
            this.setState({btcPrice: parseFloat(parseFloat(value.price).toFixed(3))})
        }
    }

    componentWillUnmount(){
        this.props.firebase.users().off();
        this.ws.close()
    }

    // Buy event allows for buying btc if sufficient balance
    buyBTC = event => {
        const totalPrice = this.state.trade.buy * this.state.btcPrice
        if(totalPrice <= this.state.wallet.usd){
            //Update Firebase wallet if enough funds
            this.props.firebase.user(this.state.uid+"/wallet/btc").set(this.state.wallet.btc+parseFloat(this.state.trade.buy))
            this.props.firebase.user(this.state.uid+"/wallet/usd").set(this.state.wallet.usd-totalPrice)
            console.log(`Bought ${this.state.trade.buy} btc for ${totalPrice}`)
            //Log transaction in Firebase
            this.props.firebase.user(this.state.uid+"/transactions").push({
                type: "buy",
                amount: this.state.trade.buy,
                price: totalPrice,
                timestamp: (+ new Date()),
                btcPrice: this.state.btcPrice
            })
        }else{
            console.log("Insufficient funds")
        }
        event.preventDefault()
    }

    // Sell event allows for selling btc if sufficient balance
    sellBTC = event => {

        const totalPrice = this.state.trade.sell * this.state.btcPrice

        if(this.state.wallet.btc >= this.state.trade.sell){
            // Update Firebase wallet if enough funds
            this.props.firebase.user(this.state.uid+"/wallet/btc").set(this.state.wallet.btc-parseFloat(this.state.trade.sell))
            this.props.firebase.user(this.state.uid+"/wallet/usd").set(this.state.wallet.usd+totalPrice)
            console.log(`Sold ${this.state.trade.sell} btc for ${totalPrice}`)

            // Log transaction in Firebase
            this.props.firebase.user(this.state.uid+"/transactions").push({
                type: "sell",
                amount: this.state.trade.sell,
                price: totalPrice,
                timestamp: (+ new Date()),
                btcPrice: this.state.btcPrice,
                wallet: this.state.wallet
            })
        }else{
            console.log("Insufficient funds")
        }
        event.preventDefault()
    }

    // Update buy/sell inputs
    onChange = event => {
        this.setState({ trade: {[event.target.name]: event.target.value }})
    }

    render(){
        return(
            <div>
                <h1>wallet</h1>
                <h2>usd: {this.state.wallet.usd}</h2>
                <h2>btc: {this.state.wallet.btc}</h2>
                <form onSubmit={this.buyBTC}>
                    <input type="number" step="0.001" name="buy" onChange={this.onChange}></input>
                    <button type="submit">buy</button>
                </form>
                <form onSubmit={this.sellBTC}>
                    <input type="number" step="0.001" name="sell" onChange={this.onChange}></input>
                    <button type="submit">sell</button>
                </form>
            </div>
        )
    }

}


export default withRouter(withFirebase(Trade))
