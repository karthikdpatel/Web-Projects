window.onload = function () {
    var hideContent = document.getElementById("found-record")
    hideContent.style.display = "none"
    document.getElementById("record-not-found").style.display = "none"
}

document.getElementById("resetbtn").onclick = function () {
    document.getElementById("stock_ticker").value = ""
    document.getElementById("found-record").style.display = "none"
    document.getElementById("record-not-found").style.display = "none"
}

document.getElementById("form").addEventListener('submit',function (event) {
    event.preventDefault();
    var i, tabcontent;

    tabcontent = document.getElementsByClassName("tab-content");
    for (i=0; i < tabcontent.length; i++){
        if (tabcontent[i].id != 'company') {
            tabcontent[i].style.display = "none";
        } else {
            tabcontent[i].style.display = "block";
        }
    }

    var formData = new FormData(this);
    let stock_ticker = formData.get('stock_ticker')

    let params = `?stock_ticker=${stock_ticker}`;
    let url = `/home${params}`;
    let req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onload = () => {
        if (req.status == 200) {
            //, data_7days, data_15days, data_1month, data_3month, data_6month
            const [profile_data, quote_data, recommendation_data, filtered_news_data, chart_data, to_date, stock_ticker, displayflag] = JSON.parse(req.response);
            console.log(profile_data)

            if (displayflag == true){
                createCompanyTab(profile_data)
                createStockSummaryTab(profile_data, quote_data, recommendation_data)
                createNewsTab(filtered_news_data)
                createHighChart(chart_data, to_date, stock_ticker)
                document.getElementById("record-not-found").style.display = "none"

                document.getElementById("found-record").style.display = "block"
            }
            else {
                document.getElementById("found-record").style.display = "none"
                document.getElementById("record-not-found").style.display = "block"
            }


            //renderMinimizedItemsTable(data);
        } else {
            alert("There was an error contacting the backend");
        }
    };
    req.send()
});

function createHighChart(data, to_date, stock_ticker) {

        const stock_data = [], volume_data = []
        var i;

        for (i = 0 ; i < data.length; i++){
            stock_data.push([
                data[i][0],
                data[i][1]
            ])
            volume_data.push([
                data[i][0],
                data[i][2]
            ])
        }

        // Configuration options for the chart
        const options = {

        rangeSelector: {
            buttons: [
                {
                    type: 'day',
                    count: 7,
                    text : "7d"
                },
                {
                    type: 'day',
                    count: 15,
                    text : "15d"
                },
                {
                    type: 'month',
                    count: 1,
                    text : "1m"
                },
                {
                    type: 'month',
                    count: 3,
                    text : "3m"
                },
                {
                    type: 'month',
                    count: 6,
                    text : "6m"
                }
            ],
            selected: 1,
            inputEnabled: false
        },

        title: {
            text: 'Stock Price ' + stock_ticker + " " + to_date
        },
        subtitle:{
            text: '<a href="https://polygon.io/" target="_blank" id="subtitle_link">Source: Polygon.io</a>'
        },
        yAxis: [{
            opposite: false,
            title: {
                text: 'Stock Price'
            }
        },
        {
            opposite: true,
            title: {
                text: 'Volume'
            }
        }],

        navigator: {
            series: {
                accessibility: {
                    exposeAsGroupOnly: true
                }
            }
        },

        series: [{
                name: 'Stock Price',
                data: stock_data,
                type: 'area',
                threshold: null,
                tooltip: {
                    valueDecimals: 2
                },
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                }
            },
            {
                name: 'Volume',
                data: volume_data,
                type: 'column',
                threshold: null,
                yAxis: 1, // use the second y-axis for this series
                color: 'black',
                tooltip: {
                    valueDecimals: 2
                },
                pointWidth: 5,
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[1]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[1]).setOpacity(0).get('rgba')]
                    ]
                }
            }]

    }

        // Initialize the chart
        Highcharts.stockChart('charts', options);
}

function createNewsTab(data) {
    var i=0//, news_tab_container, newsImg, news_content, news_headline, news_date, news_link_container, news_link
    let newsTab = document.getElementById("latest-news-tab")
    newsTab.innerHTML = ""

    for (i = 0; i<data.length;i++) {
        var news_tab_container = document.createElement("div")
        news_tab_container.style.display = 'flex'
        news_tab_container.style.backgroundColor = "rgba(248,249,250,255)"
        news_tab_container.style.marginLeft = "200px"
        news_tab_container.style.marginRight = "200px"
        news_tab_container.style.marginTop = "20px"

        var newsImg = document.createElement("img")
        newsImg.src = data[i]['image']
        newsImg.className = "news-image"
        newsImg.style.paddingLeft = "20px"
        newsImg.style.paddingRight = "20px"
        newsImg.style.paddingTop = "20px"
        newsImg.style.paddingBottom = "20px"
        news_tab_container.appendChild(newsImg)

        var news_content = document.createElement("div")

        var news_headline = document.createElement("div")
        news_headline.innerHTML = data[i]['headline']
        news_headline.style.fontFamily = "sans-serif"
        news_headline.style.fontWeight = "bold"
        news_headline.style.marginRight = "20px"
        news_headline.style.marginTop = "20px"
        news_content.appendChild(news_headline)

        var news_date = document.createElement("div")
        news_date.innerHTML = formatTimestamp(data[i]['datetime'])
        news_content.appendChild(news_date)

        var news_link_container = document.createElement("div")
        var news_link = document.createElement("a")
        news_link.target = '_blank'
        news_link.innerHTML = 'See Original Post'
        news_link.href = data[i]['url']
        news_link_container.appendChild(news_link)
        news_content.appendChild(news_link_container)

        news_tab_container.appendChild(news_content)

        newsTab.appendChild(news_tab_container)
    }
}

function createStockSummaryTab(profile_data, quote_data, recommendation_data) {
    let stocksummarytab = document.getElementById("stock-summary-tab")
    stocksummarytab.innerHTML = ""

    const table_container = document.createElement("div")
    table_container.className = "company-tab-division"
    const stock_summary_table = document.createElement("table")
    stock_summary_table.innerHTML = ""

    const stock_ticker_symbol_tr = document.createElement("tr")
    stock_ticker_symbol_tr.innerHTML = ""
    stock_ticker_symbol_tr.className = "top-line"
    const stock_ticker_symbol_td_column1 = document.createElement("td")
    stock_ticker_symbol_td_column1.className = 'right-column'
    stock_ticker_symbol_td_column1.innerHTML = 'Stock Ticker Symbol'
    stock_ticker_symbol_tr.appendChild(stock_ticker_symbol_td_column1)
    const stock_ticker_symbol_td_column2 = document.createElement("td")
    stock_ticker_symbol_td_column2.className = 'left-column'
    stock_ticker_symbol_td_column2.innerHTML = "&nbsp;&nbsp;&nbsp;" + profile_data.ticker
    stock_ticker_symbol_tr.appendChild(stock_ticker_symbol_td_column2)
    stock_summary_table.appendChild(stock_ticker_symbol_tr)

    const trading_day_tr = document.createElement("tr")
    trading_day_tr.innerHTML = ""
    const trading_day_td_column1 = document.createElement("td")
    trading_day_td_column1.className = 'right-column'
    trading_day_td_column1.innerHTML = 'Trading Day'
    trading_day_tr.appendChild(trading_day_td_column1)
    const trading_day_td_column2 = document.createElement("td")
    trading_day_td_column2.className = 'left-column'
    trading_day_td_column2.innerHTML = "&nbsp;&nbsp;&nbsp;" + formatTimestamp(quote_data.t)
    trading_day_tr.appendChild(trading_day_td_column2)
    stock_summary_table.appendChild(trading_day_tr)

    const previous_closing_price_tr = document.createElement("tr")
    previous_closing_price_tr.innerHTML = ""
    const previous_closing_price_td_column1 = document.createElement("td")
    previous_closing_price_td_column1.className = 'right-column'
    previous_closing_price_td_column1.innerHTML = 'Previous Closing Price'
    previous_closing_price_tr.appendChild(previous_closing_price_td_column1)
    const previous_closing_price_td_column2 = document.createElement("td")
    previous_closing_price_td_column2.className = 'left-column'
    previous_closing_price_td_column2.innerHTML = "&nbsp;&nbsp;&nbsp;" + quote_data.pc
    previous_closing_price_tr.appendChild(previous_closing_price_td_column2)
    stock_summary_table.appendChild(previous_closing_price_tr)

    const opening_price_tr = document.createElement("tr")
    opening_price_tr.innerHTML = ""
    const opening_price_td_column1 = document.createElement("td")
    opening_price_td_column1.className = 'right-column'
    opening_price_td_column1.innerHTML = 'Opening Price'
    opening_price_tr.appendChild(opening_price_td_column1)
    const opening_price_td_column2 = document.createElement("td")
    opening_price_td_column2.className = 'left-column'
    opening_price_td_column2.innerHTML = "&nbsp;&nbsp;&nbsp;" + quote_data.o
    opening_price_tr.appendChild(opening_price_td_column2)
    stock_summary_table.appendChild(opening_price_tr)

    const high_price_tr = document.createElement("tr")
    high_price_tr.innerHTML = ""
    const high_price_td_column1 = document.createElement("td")
    high_price_td_column1.className = 'right-column'
    high_price_td_column1.innerHTML = 'High Price'
    high_price_tr.appendChild(high_price_td_column1)
    const high_price_td_column2 = document.createElement("td")
    high_price_td_column2.className = 'left-column'
    high_price_td_column2.innerHTML = "&nbsp;&nbsp;&nbsp;" + quote_data.h
    high_price_tr.appendChild(high_price_td_column2)
    stock_summary_table.appendChild(high_price_tr)

    const low_price_tr = document.createElement("tr")
    low_price_tr.innerHTML = ""
    const low_price_td_column1 = document.createElement("td")
    low_price_td_column1.className = 'right-column'
    low_price_td_column1.innerHTML = 'Low Price'
    low_price_tr.appendChild(low_price_td_column1)
    const low_price_td_column2 = document.createElement("td")
    low_price_td_column2.className = 'left-column'
    low_price_td_column2.innerHTML = "&nbsp;&nbsp;&nbsp;" + quote_data.l
    low_price_tr.appendChild(low_price_td_column2)
    stock_summary_table.appendChild(low_price_tr)

    const change_tr = document.createElement("tr")
    change_tr.innerHTML = ""
    const change_td_column1 = document.createElement("td")
    change_td_column1.className = 'right-column'
    change_td_column1.innerHTML = 'Change'
    change_tr.appendChild(change_td_column1)
    const change_td_column2 = document.createElement("td")
    change_td_column2.className = 'left-column'
    change_td_column2.innerHTML = "&nbsp;&nbsp;&nbsp;" + quote_data.d + "&nbsp;&nbsp;"
    const change_img = document.createElement("img")
    change_img.className = "stock-summary-arrow-img"
    if (quote_data.d >= 0) {
        change_img.src = "/static/img/GreenArrowUp.png"
    }
    else {
        change_img.src = "/static/img/RedArrowDown.png"
    }
    change_td_column2.appendChild(change_img)
    change_tr.appendChild(change_td_column2)
    stock_summary_table.appendChild(change_tr)

    const change_percent_tr = document.createElement("tr")
    change_percent_tr.innerHTML = ""
    const change_percent_td_column1 = document.createElement("td")
    change_percent_td_column1.className = 'right-column'
    change_percent_td_column1.innerHTML = 'Change Percent'
    change_percent_tr.appendChild(change_percent_td_column1)
    const change_percent_td_column2 = document.createElement("td")
    change_percent_td_column2.className = 'left-column'
    change_percent_td_column2.innerHTML = "&nbsp;&nbsp;&nbsp;" + quote_data.dp + "&nbsp;&nbsp;"
    const change_percent_img = document.createElement("img")
    change_percent_img.className = "stock-summary-arrow-img"
    if (quote_data.dp >= 0) {
        change_percent_img.src = "/static/img/GreenArrowUp.png"
    }
    else {
        change_percent_img.src = "/static/img/RedArrowDown.png"
    }
    change_percent_td_column2.appendChild(change_percent_img)
    change_percent_tr.appendChild(change_percent_td_column2)
    stock_summary_table.appendChild(change_percent_tr)

    table_container.appendChild(stock_summary_table)
    stocksummarytab.appendChild(table_container)

    const recommendation_trends = document.createElement("div")
    recommendation_trends.style.display = "flex"
    recommendation_trends.className = "company-tab-division"
    recommendation_trends.style.paddingLeft = "100px"
    recommendation_trends.style.paddingTop = "20px"

    const strong_sell_text_container = document.createElement("div")
    strong_sell_text_container.innerHTML = "Strong<br>Sell"
    strong_sell_text_container.style.color = "rgba(237,41,55,255)"
    strong_sell_text_container.style.paddingRight = "10px"
    recommendation_trends.appendChild(strong_sell_text_container)

    const box1 = document.createElement("div")
    box1.className = "recommendation-box"
    box1.style.backgroundColor = "rgba(237,41,55,255)"
    box1.style.color = "white"
    box1.innerHTML = recommendation_data.strongSell
    recommendation_trends.appendChild(box1)

    const box2 = document.createElement("div")
    box2.className = "recommendation-box"
    box2.style.backgroundColor = "rgba(178,95,74,255)"
    box2.style.color = "white"
    box2.innerHTML = recommendation_data.sell
    recommendation_trends.appendChild(box2)

    const box3 = document.createElement("div")
    box3.className = "recommendation-box"
    box3.style.backgroundColor = "rgba(119,148,92,255)"
    box3.style.color = "white"
    box3.innerHTML = recommendation_data.hold
    recommendation_trends.appendChild(box3)

    const box4 = document.createElement("div")
    box4.className = "recommendation-box"
    box4.style.backgroundColor = "rgba(60,202,108,255)"
    box4.style.color = "white"
    box4.innerHTML = recommendation_data.buy
    recommendation_trends.appendChild(box4)

    const box5 = document.createElement("div")
    box5.className = "recommendation-box"
    box5.style.backgroundColor = "rgba(2,255,127,255)"
    box5.style.color = "white"
    box5.innerHTML = recommendation_data.strongBuy
    recommendation_trends.appendChild(box5)

    const strong_buy_text_container = document.createElement("div")
    strong_buy_text_container.innerHTML = "Strong<br>Buy&nbsp;"
    strong_buy_text_container.style.color = "rgba(2,255,127,255)"
    strong_buy_text_container.style.paddingLeft = "10px"
    recommendation_trends.appendChild(strong_buy_text_container)

    stocksummarytab.appendChild(recommendation_trends)

    const recommendation_trends_text = document.createElement("div")
    recommendation_trends_text.innerHTML = "Recommendation Trends"
    recommendation_trends_text.className = "company-tab-division"
    recommendation_trends_text.style.paddingTop = "10px"
    recommendation_trends_text.style.fontSize = "20px"
    recommendation_trends_text.style.fontFamily = "sans-serif"
    stocksummarytab.appendChild(recommendation_trends_text)

}
function createCompanyTab(data) {
            let companytab = document.getElementById("company-tab")
            companytab.innerHTML = ""


            const img_container = document.createElement("div")
            img_container.className = "company-tab-division"
            const img = document.createElement("img")
            img.className = "company-tab-image"
            img.src = data.logo
            img_container.appendChild(img)
            companytab.appendChild(img_container)


            const table_container = document.createElement("div")
            table_container.className = "company-tab-division"
            const company_tab_table = document.createElement("table")
            company_tab_table.innerHTML = ""

            const company_name_tr = document.createElement("tr")
            company_name_tr.innerHTML = ""
            company_name_tr.className = "top-line"
            const company_name_td_column1 = document.createElement("td")
            company_name_td_column1.className = 'right-column'
            company_name_td_column1.innerHTML = 'Company Name'
            company_name_tr.appendChild(company_name_td_column1)
            const company_name_td_column2 = document.createElement("td")
            company_name_td_column2.className = 'left-column'
            company_name_td_column2.innerHTML = "&nbsp;&nbsp;&nbsp;" + data.name
            company_name_tr.appendChild(company_name_td_column2)
            company_tab_table.appendChild(company_name_tr)

            const stick_ticker_tr = document.createElement("tr")
            stick_ticker_tr.innerHTML = ""
            const stick_ticker_td_column1 = document.createElement("td")
            stick_ticker_td_column1.className = 'right-column'
            stick_ticker_td_column1.innerHTML = 'Stock Ticker Symbol'
            stick_ticker_tr.appendChild(stick_ticker_td_column1)
            const stick_ticker_td_column2 = document.createElement("td")
            stick_ticker_td_column2.className = 'left-column'
            stick_ticker_td_column2.innerHTML = "&nbsp;&nbsp;&nbsp;" + data.ticker
            stick_ticker_tr.appendChild(stick_ticker_td_column2)
            company_tab_table.appendChild(stick_ticker_tr)

            const stick_exchange_tr = document.createElement("tr")
            stick_exchange_tr.innerHTML = ""
            const stick_exchange_td_column1 = document.createElement("td")
            stick_exchange_td_column1.className = 'right-column'
            stick_exchange_td_column1.innerHTML = 'Stock Exchange Code'
            stick_exchange_tr.appendChild(stick_exchange_td_column1)
            const stick_exchange_td_column2 = document.createElement("td")
            stick_exchange_td_column2.className = 'left-column'
            stick_exchange_td_column2.innerHTML = "&nbsp;&nbsp;&nbsp;" + data.exchange
            stick_exchange_tr.appendChild(stick_exchange_td_column2)
            company_tab_table.appendChild(stick_exchange_tr)


            const company_start_date_tr = document.createElement("tr")
            company_start_date_tr.innerHTML = ""
            const company_start_date_td_column1 = document.createElement("td")
            company_start_date_td_column1.className = 'right-column'
            company_start_date_td_column1.innerHTML = 'Company IPO Date'
            company_start_date_tr.appendChild(company_start_date_td_column1)
            const company_start_date_td_column2 = document.createElement("td")
            company_start_date_td_column2.className = 'left-column'
            company_start_date_td_column2.innerHTML = "&nbsp;&nbsp;&nbsp;" + data.ipo
            company_start_date_tr.appendChild(company_start_date_td_column2)
            company_tab_table.appendChild(company_start_date_tr)

            const category_tr = document.createElement("tr")
            category_tr.innerHTML = ""
            const category_td_column1 = document.createElement("td")
            category_td_column1.className = 'right-column'
            category_td_column1.innerHTML = 'Category'
            category_tr.appendChild(category_td_column1)
            const category_td_column2 = document.createElement("td")
            category_td_column2.className = 'left-column'
            category_td_column2.innerHTML = "&nbsp;&nbsp;&nbsp;" + data.finnhubIndustry
            category_tr.appendChild(category_td_column2)
            company_tab_table.appendChild(category_tr)

            table_container.appendChild(company_tab_table)
            companytab.appendChild(table_container)
}

function chartFilter(event, filterCond) {
    var i , graphClass, fiterCondName;
    graphClass = document.getElementsByClassName("graph")
    for (i=0; i < graphClass.length; i++){
        graphClass[i].style.display = "none";
    }

    fiterCondName = document.getElementsByClassName("filterCond")
    for (i=0; i < fiterCondName.length; i++){
        fiterCondName[i].className.replace(" active","");
    }
    document.getElementById(filterCond).style.display = "block";
    event.currentTarget.className += " active";
}

function displayTab(event, tab) {
    var i, tabcontent, tabname;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i=0; i < tabcontent.length; i++){
        tabcontent[i].style.display = "none";
    }

    tabname = document.getElementsByClassName("tabs");
    for (i=0; i < tabname.length; i++){
        tabname[i].className = tabname[i].className.replace(" active", "");
    }
    document.getElementById(tab).style.display = "block";
    event.currentTarget.className += " active";
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000)
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return day + ' ' + months[monthIndex] + ', ' + year;
}

async function createHighCharts() {
    const data = await fetch(
        'https://www.highcharts.com/samples/data/new-intraday.json'
    ).then(response => response.json());

    Highcharts.stockChart('custom-chart', {

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        navigator: {
            series: {
                accessibility: {
                    exposeAsGroupOnly: true
                }
            }
        },

        series: [{
            name: 'AAPL Stock Price',
            data: data,
            type: 'area',
            threshold: null,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            }
        }]
    });
}

document.addEventListener("DOMContentLoaded", function(event) {
    createHighCharts();
});






