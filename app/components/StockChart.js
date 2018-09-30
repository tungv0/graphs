import React from 'react';
import styles from '../style.css';

class StockRow extends React.Component {
    render() {
        return (
            <div>
                <div className="column-sm-4">
                    <div>
                        {this.props.stockList.map( (stock) => {
                                return (
                                    <StockChart name={stock.name} url={stock.url} /> 
                                )
                            }) 
                        }
                    </div>
                </div>
            </div>
        )
    }
}

class StockChart extends React.Component {
    render() {
        return (
            <div className={styles.card}>
                <div className={styles.title}>
                    <i className={styles.fa} aria-hidden="true"></i>
                    <h2>{this.props.name}</h2>
                </div>
                <iframe src={this.props.url} frameBorder="0" height="385" width="380"></iframe>
            </div>
        )
    }
}

module.exports = StockRow