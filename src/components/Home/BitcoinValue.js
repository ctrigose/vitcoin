import React from 'react'
import { Heading , Provider} from 'rendition'

import LineChart from './LineChart';



class BitcoinValue extends React.Component {

    constructor(){
        super()

        this.state = {
            count: 0,
            currency: "USD",
            currentValue: "",
            dataset: []
        }
    }

    componentDidMount() {
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
            const value = JSON.parse(e.data);
                if (value.type !== "ticker") {
                    return
                }
                const price = parseFloat(parseFloat(value.price).toFixed(3))
                const dataObj = {
                    x: this.state.count, 
                    y: price
                }

                let oldDataset = this.state.dataset
                oldDataset.length>14 && oldDataset.shift()
                oldDataset.push(dataObj)
                let newDataset = oldDataset
                this.setState({
                    count: this.state.count+1,
                    currentValue: parseFloat(value.price).toFixed(3),
                    dataset: newDataset
                 })
                 
            }
        }
    
      componentWillUnmount() {
        this.ws.close()
      }

    
    render(){
        console.table(this.state.dataset)
        return (
            <Provider>
                <Heading.h1>{this.state.currentValue}</Heading.h1>
                <LineChart 
                    interpolate={'basis'}
                    margin={{top: 30, right: 30, bottom: 30, left: 30}}
                    padding={{left: 50}}
                    width={800}
                    height={500}
                    data={[this.state.dataset]}/>
            </Provider>
        )
  }

}

export default BitcoinValue