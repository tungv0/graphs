import React from 'react';
import StockChart from './StockChart'

class App extends React.Component {
    render() {
        return (
            <div>
                <h1>Stock charts!</h1>
                {this.props.stockList.map( (stockRow) => {
                         return (
                             <StockChart stockList={stockRow} /> 
                         )
                    })
                }
            </div>
        );
    }
};

module.exports = App;