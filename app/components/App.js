import React from 'react';
import StockChart from './StockChart'

class App extends React.Component {
    render() {
        return (
            <div>
                <h1>Stock charts!</h1>
                <iframe src="https://www.bloomberg.com/markets/earnings-calendar/us#content" sandbox="allow-forms allow-scripts" frameBorder="0" height="385" width="380"></iframe>
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