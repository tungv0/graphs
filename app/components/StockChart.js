import React from 'react';

class StockRow extends React.Component {
    render() {
        return (
            <tr>
                {this.props.stockList.map( (stock) => {
                        return (
                            <StockChart name={stock.name} url={stock.url} /> 
                        )
                    }) 
                }
            </tr>
        )
    }
}

class StockChart extends React.Component {
    render() {
        return (
            <td>
                <h2>{this.props.name}</h2>
                <iframe src={this.props.url} frameBorder="0" height="385" width="380"></iframe>
            </td>
        )
    }
}

module.exports = StockRow