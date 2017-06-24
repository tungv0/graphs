var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/App');

var stocks = [
    [{
            name: "AAPL",
            url: "http://stockcharts.com/h-sc/ui?s=AAPL&p=D&yr=0&mn=2&dy=0&id=p62600595338#image-container"
        },
        {
            name: "RH",
            url: "http://stockcharts.com/h-sc/ui?s=RH&p=D&yr=0&mn=2&dy=0&id=p26391866845#image-container"
        },
        {
            name: "CEFL",
            url: "http://stockcharts.com/h-sc/ui?s=CEFL&p=D&yr=0&mn=2&dy=0&id=p82984840230#image-container"
        }
    ],
    [{
            name: "MORL",
            url: "http://stockcharts.com/h-sc/ui?s=MORL&p=D&yr=0&mn=2&dy=0&id=p86231375598#image-container"
        },
        {
            name: "TXN",
            url: "http://stockcharts.com/h-sc/ui?s=TXN&p=D&yr=0&mn=2&dy=0&id=p97055035454#image-container"
        },
        {
            name: "TSLA",
            url: "http://stockcharts.com/h-sc/ui?s=TSLA&p=D&yr=0&mn=2&dy=0&id=p72720229695#image-container"
        }
    ],
    [{
            name: "NFLX",
            url: "http://stockcharts.com/h-sc/ui?s=NFLX&p=D&yr=0&mn=2&dy=0&id=p57064685951#image-container"
        },
        {
            name: "AMZN",
            url: "http://stockcharts.com/h-sc/ui?s=AMZN&p=D&yr=0&mn=2&dy=0&id=p75815806748#image-container"

        }, {
            name: "GOOGL",
            url: "http://stockcharts.com/h-sc/ui?s=GOOGL&p=D&yr=0&mn=2&dy=0&id=p14314852273#image-container"
        }
    ],
    [{
            name: "SQM",
            url: "http://stockcharts.com/h-sc/ui?s=SQM&p=D&yr=0&mn=2&dy=0&id=p88946420254#image-container"
        },
        {
            name: "FMC",
            url: "http://stockcharts.com/h-sc/ui?s=FMC&p=D&yr=0&mn=2&dy=0&id=p65351599791#image-container"

        },
        {
            name: "VRTX",
            url: "http://stockcharts.com/h-sc/ui?s=VRTX&p=D&yr=0&mn=2&dy=0&id=p82551674189#image-container"
        }
    ],
    [{
            name: "AYI",
            url: "http://stockcharts.com/h-sc/ui?s=AYI&p=D&yr=0&mn=2&dy=0&id=p19380760851#image-container"
        },
        {
            name: "F",
            url: "http://stockcharts.com/h-sc/ui?s=F&p=D&yr=0&mn=2&dy=0&id=p44830535510#image-container"
        },
        {
            name: "GM",
            url: "http://stockcharts.com/h-sc/ui?s=GM&p=D&yr=0&mn=2&dy=0&id=p62826057915#image-container"
        }
    ],
    [{
            name: "V",
            url: "http://stockcharts.com/h-sc/ui?s=V&p=D&yr=0&mn=2&dy=0&id=p22358143472#image-container"
        },
        {
            name: "KO",
            url: "http://stockcharts.com/h-sc/ui?s=KO&p=D&yr=0&mn=2&dy=0&id=p76581121211#image-container"
        },
        {
            name: "ISRG",
            url: "http://stockcharts.com/h-sc/ui?s=ISRG&p=D&yr=0&mn=2&dy=0&id=p27968228514#image-container"
        }
    ],
    [{
            name: "REGN",
            url: "http://stockcharts.com/h-sc/ui?s=REGN&p=D&yr=0&mn=2&dy=0&id=p22839588211#image-container"
        },
        {
            name: "TMUS",
            url: "http://stockcharts.com/h-sc/ui?s=TMUS&p=D&yr=0&mn=2&dy=0&id=p34646068698#image-container"
        },
        {
            name: "TWLO",
            url: "http://stockcharts.com/h-sc/ui?s=TWLO&p=D&yr=0&mn=2&dy=0&id=p92520469070#image-container"
        }
    ],
    [{
            name: "FPE",
            url: "http://stockcharts.com/h-sc/ui?s=FPE&p=D&yr=0&mn=2&dy=0&id=p51520441701#image-container"

        },
        {
            name: "PGX",
            url: "http://stockcharts.com/h-sc/ui?s=PGX&p=D&yr=0&mn=2&dy=0&id=p50419278403#image-container"

        },
        {
            name: "PSK",
            url: "http://stockcharts.com/h-sc/ui?s=PSK&p=D&yr=0&mn=2&dy=0&id=p17747377884#image-container"
        }
    ],
    [{
            name: "DTN",
            url: "http://stockcharts.com/h-sc/ui?s=DTN&p=D&yr=0&mn=2&dy=0&id=p29875906510#image-container"
        },
        {
            name: "DVHL",
            url: "http://stockcharts.com/h-sc/ui?s=DVHL&p=D&yr=0&mn=2&dy=0&id=p47121753787#image-container"
        },
        {
            name: "MCD",
            url: "http://stockcharts.com/h-sc/ui?s=MCD&p=D&yr=0&mn=2&dy=0&id=p31683050500#image-container"
        }
    ],
    [{
            name: "ILMN",
            url: "http://stockcharts.com/h-sc/ui?s=ILMN&p=D&yr=0&mn=2&dy=0&id=p62735043502#image-container"
        },
        {
            name: "YHOO",
            url: "http://stockcharts.com/h-sc/ui?s=YHOO&p=D&yr=0&mn=2&dy=0&id=p81913325743#image-container"
        },
        {
            name: "AA",
            url: "http://stockcharts.com/h-sc/ui?s=AA&p=D&yr=0&mn=2&dy=0&id=p61663932215#image-container"

        }
    ],
    [{
            name: "RTN",
            url: "http://stockcharts.com/h-sc/ui?s=RTN&p=D&yr=0&mn=2&dy=0&id=p26159491597#image-container"
        },
        {
            name: "LMT",
            url: "http://stockcharts.com/h-sc/ui?s=LMT&p=D&yr=0&mn=2&dy=0&id=p25784410213#image-container"
        },
        {
            name: "JNJ",
            url: "http://stockcharts.com/h-sc/ui?s=JNJ&p=D&yr=0&mn=2&dy=0&id=p93125844991#image-container"
        }
    ],
    [{
            name: "PM",
            url: "http://stockcharts.com/h-sc/ui?s=PM&p=D&yr=0&mn=2&dy=0&id=p15187653920#image-container"
        },
        {
            name: "BA",
            url: "http://stockcharts.com/h-sc/ui?s=BA&p=D&yr=0&mn=2&dy=0&id=p00474985446#image-container"
        },
        {
            name: "NOW",
            url: "http://stockcharts.com/h-sc/ui?s=NOW&p=D&yr=0&mn=2&dy=0&id=p43549589688#image-container"
        }
    ],
    [{
            name: "IBM",
            url: "http://stockcharts.com/h-sc/ui?s=IBM&p=D&yr=0&mn=2&dy=0&id=p04004448670#image-container"
        },
        {
            name: "VZ",
            url: "http://stockcharts.com/h-sc/ui?s=VZ&p=D&yr=0&mn=2&dy=0&id=p21400556845#image-container"
        },
        {
            name: "FB",
            url: "http://stockcharts.com/h-sc/ui?s=FB&p=D&yr=0&mn=2&dy=0&id=p33816847743#image-container"
        }
    ],
    [{
            name: "AXP",
            url: "http://stockcharts.com/h-sc/ui?s=AXP&p=D&yr=0&mn=2&dy=0&id=p76511169776#image-container"
        },
        {
            name: "UAL",
            url: "http://stockcharts.com/h-sc/ui?s=UAL&p=D&yr=0&mn=2&dy=0&id=p04130826495#image-container"
        },
        {
            name: "NK",
            url: "http://stockcharts.com/h-sc/ui?s=NK&p=D&yr=0&mn=2&dy=0&id=p32473023425#image-container"
        }
    ],
    [{
            name: "WFC",
            url: "http://stockcharts.com/h-sc/ui?s=WFC&p=D&yr=0&mn=2&dy=0&id=p05135978061#image-container"
        },

        {
            name: "CAH",
            url: "http://stockcharts.com/h-sc/ui?s=CAH&p=D&yr=0&mn=2&dy=0&id=p59631820040#image-container"
        },
        {
            name: "USB",
            url: "http://stockcharts.com/h-sc/ui?s=USB&p=D&yr=0&mn=2&dy=0&id=p23252493054#image-container"
        }
    ],
    [{
            name: "GS",
            url: "http://stockcharts.com/h-sc/ui?s=GS&p=D&yr=0&mn=2&dy=0&id=p98445344774#image-container"
        },
        {
            name: "AMD",
            url: "http://stockcharts.com/h-sc/ui?s=AMD&p=D&yr=0&mn=2&dy=0&id=p14322011616#image-container"
        },
        {
            name: "ALB",
            url: "http://stockcharts.com/h-sc/ui?s=ALB&p=D&yr=0&mn=2&dy=0&id=p70487832629#image-container"
        }
    ],
    [{
            name: "RDS/A",
            url: "http://stockcharts.com/h-sc/ui?s=RDS%2FA&p=D&yr=0&mn=2&dy=0&id=p22884284014#image-container"
        },
        {
            name: "VLO",
            url: "http://stockcharts.com/h-sc/ui?s=VLO&p=D&yr=0&mn=2&dy=0&id=p79450272578#image-container"
        },
        {
            name: "CXO",
            url: "http://stockcharts.com/h-sc/ui?s=CXO&p=D&yr=0&mn=2&dy=0&id=p03684954597#image-container"
        }
    ],
    [{
            name: "CLB",
            url: "http://stockcharts.com/h-sc/ui?s=CLB&p=D&yr=0&mn=2&dy=0&id=p46889232659#image-container"
        },
        {
            name: "NVDA",
            url: "http://stockcharts.com/h-sc/ui?s=NVDA&p=D&yr=0&mn=2&dy=0&id=p85752770387#image-container"
        },
        {
            name: "MOH",
            url: "http://stockcharts.com/h-sc/ui?s=MOH&p=D&yr=0&mn=2&dy=0&id=p63796429826#image-container"
        }
    ],
    [{
            name: "COPX",
            url: "http://stockcharts.com/h-sc/ui?s=COPX&p=D&yr=0&mn=2&dy=0&id=p15770757317#image-container"
        },
        {
            name: "XOP",
            url: "http://stockcharts.com/h-sc/ui?s=XOP&p=D&yr=0&mn=2&dy=0&id=p37401246995#image-container"
        },
        {
            name: "XOM",
            url: "http://stockcharts.com/h-sc/ui?s=XOM&p=D&yr=0&mn=2&dy=0&id=p41739758834#image-container"
        }
    ],
    [{
            name: "INCY",
            url: "http://stockcharts.com/h-sc/ui?s=INCY&p=D&yr=0&mn=2&dy=0&id=p17491249470#image-container"
        },
        {
            name: "COH",
            url: "http://stockcharts.com/h-sc/ui?s=COH&p=D&yr=0&mn=2&dy=0&id=p21569325962#image-container"
        },
        {
            name: "MMM",
            url: "http://stockcharts.com/h-sc/ui?s=MMM&p=D&yr=0&mn=2&dy=0&id=p02030115423#image-container"
        }
    ],
    [{
            name: "PCLN",
            url: "http://stockcharts.com/h-sc/ui?s=PCLN&p=D&yr=0&mn=2&dy=0&id=p07785501208#image-container"
        },
        {
            name: "MSFT",
            url: "http://stockcharts.com/h-sc/ui?s=MSFT&p=D&yr=0&mn=2&dy=0&id=p55754914095#image-container"
        },
        {
            name: "AVGO",
            url: "http://stockcharts.com/h-sc/ui?s=AVGO&p=D&yr=0&mn=2&dy=0&id=p23694002387#image-container"
        }
    ]
    
]

ReactDOM.render(< App stockList = {stocks}/>, document.getElementById('app'));