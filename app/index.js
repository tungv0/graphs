var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/App');

var stocks = [
    [{
            name: "AAPL",
            url: "http://stockcharts.com/h-sc/ui?s=AAPL&p=D&yr=0&mn=2&dy=0&id=p62600595338#chartImg"
        },
        {
            name: "RH",
            url: "http://stockcharts.com/h-sc/ui?s=RH&p=D&yr=0&mn=2&dy=0&id=p26391866845#chartImg"
        },
        {
            name: "CEFL",
            url: "http://stockcharts.com/h-sc/ui?s=CEFL&p=D&yr=0&mn=2&dy=0&id=p82984840230#chartImg"
        }
    ],
    [{
            name: "MORL",
            url: "http://stockcharts.com/h-sc/ui?s=MORL&p=D&yr=0&mn=2&dy=0&id=p86231375598#chartImg"
        },
        {
            name: "TXN",
            url: "http://stockcharts.com/h-sc/ui?s=TXN&p=D&yr=0&mn=2&dy=0&id=p97055035454#chartImg"
        },
        {
            name: "TSLA",
            url: "http://stockcharts.com/h-sc/ui?s=TSLA&p=D&yr=0&mn=2&dy=0&id=p72720229695#chartImg"
        }
    ],
/*     [{
            name: "NFLX",
            url: "http://stockcharts.com/h-sc/ui?s=NFLX&p=D&yr=0&mn=2&dy=0&id=p57064685951#chartImg"
        },
        {
            name: "AMZN",
            url: "http://stockcharts.com/h-sc/ui?s=AMZN&p=D&yr=0&mn=2&dy=0&id=p75815806748#chartImg"

        }, {
            name: "GOOGL",
            url: "http://stockcharts.com/h-sc/ui?s=GOOGL&p=D&yr=0&mn=2&dy=0&id=p14314852273#chartImg"
        }
    ],
    [{
            name: "V",
            url: "http://stockcharts.com/h-sc/ui?s=V&p=D&yr=0&mn=2&dy=0&id=p22358143472#chartImg"
        },
        {
            name: "KO",
            url: "http://stockcharts.com/h-sc/ui?s=KO&p=D&yr=0&mn=2&dy=0&id=p76581121211#chartImg"
        },
        {
            name: "ISRG",
            url: "http://stockcharts.com/h-sc/ui?s=ISRG&p=D&yr=0&mn=2&dy=0&id=p27968228514#chartImg"
        }
    ],
    [{
            name: "REGN",
            url: "http://stockcharts.com/h-sc/ui?s=REGN&p=D&yr=0&mn=2&dy=0&id=p22839588211#chartImg"
        },
        {
            name: "TMUS",
            url: "http://stockcharts.com/h-sc/ui?s=TMUS&p=D&yr=0&mn=2&dy=0&id=p34646068698#chartImg"
        },
        {
            name: "TWLO",
            url: "http://stockcharts.com/h-sc/ui?s=TWLO&p=D&yr=0&mn=2&dy=0&id=p92520469070#chartImg"
        }
    ],
    [{
            name: "DTN",
            url: "http://stockcharts.com/h-sc/ui?s=DTN&p=D&yr=0&mn=2&dy=0&id=p29875906510#chartImg"
        },
        {
            name: "DVHL",
            url: "http://stockcharts.com/h-sc/ui?s=DVHL&p=D&yr=0&mn=2&dy=0&id=p47121753787#chartImg"
        },
        {
            name: "MCD",
            url: "http://stockcharts.com/h-sc/ui?s=MCD&p=D&yr=0&mn=2&dy=0&id=p31683050500#chartImg"
        }
    ],
    [{
            name: "ILMN",
            url: "http://stockcharts.com/h-sc/ui?s=ILMN&p=D&yr=0&mn=2&dy=0&id=p62735043502#chartImg"
        },
        {
            name: "EXPE",
            url: "http://stockcharts.com/h-sc/ui?s=EXPE&p=D&yr=0&mn=6&dy=0&id=p42721582702#chartImg"
        },
        {
            name: "AA",
            url: "http://stockcharts.com/h-sc/ui?s=AA&p=D&yr=0&mn=2&dy=0&id=p61663932215#chartImg"

        }
    ],
    [{
            name: "RTN",
            url: "http://stockcharts.com/h-sc/ui?s=RTN&p=D&yr=0&mn=2&dy=0&id=p26159491597#chartImg"
        },
        {
            name: "LMT",
            url: "http://stockcharts.com/h-sc/ui?s=LMT&p=D&yr=0&mn=2&dy=0&id=p25784410213#chartImg"
        },
        {
            name: "JNJ",
            url: "http://stockcharts.com/h-sc/ui?s=JNJ&p=D&yr=0&mn=2&dy=0&id=p93125844991#chartImg"
        }
    ],
    [{
            name: "PM",
            url: "http://stockcharts.com/h-sc/ui?s=PM&p=D&yr=0&mn=2&dy=0&id=p15187653920#chartImg"
        },
        {
            name: "BA",
            url: "http://stockcharts.com/h-sc/ui?s=BA&p=D&yr=0&mn=2&dy=0&id=p00474985446#chartImg"
        },
        {
            name: "NOW",
            url: "http://stockcharts.com/h-sc/ui?s=NOW&p=D&yr=0&mn=2&dy=0&id=p43549589688#chartImg"
        }
    ],
    [{
            name: "IBM",
            url: "http://stockcharts.com/h-sc/ui?s=IBM&p=D&yr=0&mn=2&dy=0&id=p04004448670#chartImg"
        },
        {
            name: "VZ",
            url: "http://stockcharts.com/h-sc/ui?s=VZ&p=D&yr=0&mn=2&dy=0&id=p21400556845#chartImg"
        },
        {
            name: "FB",
            url: "http://stockcharts.com/h-sc/ui?s=FB&p=D&yr=0&mn=2&dy=0&id=p33816847743#chartImg"
        }
    ],
    [{
            name: "AXP",
            url: "http://stockcharts.com/h-sc/ui?s=AXP&p=D&yr=0&mn=2&dy=0&id=p76511169776#chartImg"
        },
        {
            name: "UAL",
            url: "http://stockcharts.com/h-sc/ui?s=UAL&p=D&yr=0&mn=2&dy=0&id=p04130826495#chartImg"
        },
        {
            name: "NK",
            url: "http://stockcharts.com/h-sc/ui?s=NK&p=D&yr=0&mn=2&dy=0&id=p32473023425#chartImg"
        }
    ],
    [{
            name: "GS",
            url: "http://stockcharts.com/h-sc/ui?s=GS&p=D&yr=0&mn=2&dy=0&id=p98445344774#chartImg"
        },
        {
            name: "AMD",
            url: "http://stockcharts.com/h-sc/ui?s=AMD&p=D&yr=0&mn=2&dy=0&id=p14322011616#chartImg"
        },
        {
            name: "ALB",
            url: "http://stockcharts.com/h-sc/ui?s=ALB&p=D&yr=0&mn=2&dy=0&id=p70487832629#chartImg"
        }
    ],
    [{
            name: "CLB",
            url: "http://stockcharts.com/h-sc/ui?s=CLB&p=D&yr=0&mn=2&dy=0&id=p46889232659#chartImg"
        },
        {
            name: "NVDA",
            url: "http://stockcharts.com/h-sc/ui?s=NVDA&p=D&yr=0&mn=2&dy=0&id=p85752770387#chartImg"
        },
        {
            name: "MOH",
            url: "http://stockcharts.com/h-sc/ui?s=MOH&p=D&yr=0&mn=2&dy=0&id=p63796429826#chartImg"
        }
    ],
    [{
            name: "COPX",
            url: "http://stockcharts.com/h-sc/ui?s=COPX&p=D&yr=0&mn=2&dy=0&id=p15770757317#chartImg"
        },
        {
            name: "XOP",
            url: "http://stockcharts.com/h-sc/ui?s=XOP&p=D&yr=0&mn=2&dy=0&id=p37401246995#chartImg"
        },
        {
            name: "XOM",
            url: "http://stockcharts.com/h-sc/ui?s=XOM&p=D&yr=0&mn=2&dy=0&id=p41739758834#chartImg"
        }
    ],
    [{
            name: "INCY",
            url: "http://stockcharts.com/h-sc/ui?s=INCY&p=D&yr=0&mn=2&dy=0&id=p17491249470#chartImg"
        },
        {
            name: "COH",
            url: "http://stockcharts.com/h-sc/ui?s=COH&p=D&yr=0&mn=2&dy=0&id=p21569325962#chartImg"
        },
        {
            name: "MMM",
            url: "http://stockcharts.com/h-sc/ui?s=MMM&p=D&yr=0&mn=2&dy=0&id=p02030115423#chartImg"
        }
    ],
    [{
            name: "PCLN",
            url: "http://stockcharts.com/h-sc/ui?s=PCLN&p=D&yr=0&mn=2&dy=0&id=p07785501208#chartImg"
        },
        {
            name: "MSFT",
            url: "http://stockcharts.com/h-sc/ui?s=MSFT&p=D&yr=0&mn=2&dy=0&id=p55754914095#chartImg"
        },
        {
            name: "AVGO",
            url: "http://stockcharts.com/h-sc/ui?s=AVGO&p=D&yr=0&mn=2&dy=0&id=p23694002387#chartImg"
        }
    ],
    [{
            name: "BAC",
            url: "http://stockcharts.com/h-sc/ui?s=BAC&p=D&yr=0&mn=6&dy=0&id=p41689777031#chartImg"
        },
        {
            name: "JPM",
            url: "http://stockcharts.com/h-sc/ui?s=JPM&p=D&yr=0&mn=6&dy=0&id=p31113283951#chartImg"
        },
        {
            name: "MS",
            url: "http://stockcharts.com/h-sc/ui?s=MS&p=D&yr=0&mn=6&dy=0&id=p83921253137#chartImg"
        }
    ] */
    
]

ReactDOM.render(<App stockList = {stocks}/>, document.getElementById('app'));
