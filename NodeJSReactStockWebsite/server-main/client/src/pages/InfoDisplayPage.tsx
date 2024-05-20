
//import { useParams } from "react-router-dom";
import{useParams} from "react-router-dom";
import { useEffect, useRef, useState, ChangeEvent } from "react";
import { APIService } from "../services/api-service";
import {INTERFACEStockOverview} from "../interfaces/StockOverview";
import {INTERFACESummaryDetails} from "../interfaces/SummaryDetails";
import {INTERFACEInsiderSentiments} from "../interfaces/InsiderSentiments";
import { Button, Card, Col, Container, Modal, Row, Tab, Tabs } from "react-bootstrap";
import React from "react";
import HighchartsReact from 'highcharts-react-official';
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";
import * as Highcharts from 'highcharts/highstock';
import VBP from 'highcharts/indicators/volume-by-price';
import SMA from 'highcharts/indicators/ema';
import HighchartsMore from "highcharts/highcharts-more";
import Indicators from "highcharts/indicators/indicators";
import {StarFill, Star, ArrowDown, ArrowUp, CaretUpFill, CaretDownFill} from 'react-bootstrap-icons'
import HomePage from "./HomePage";
import './InfoDisplayPage.css';
import {useHistory} from "react-router-dom";

import dragPanes from 'highcharts/modules/drag-panes';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';
import accessibility from 'highcharts/modules/accessibility';

HighchartsMore(Highcharts);
Indicators(Highcharts);
VBP(Highcharts);
SMA(Highcharts);

exporting(Highcharts);
exportData(Highcharts);
accessibility(Highcharts);
//dragPanes(Highcharts);

type HomeParams = {
    tickerValue: string
}
const InfoDisplayPage = (hihhChartProperties: HighchartsReact.Props) => {
    let {tickerValue} = useParams<HomeParams>();

    let history = useHistory()
    const apiService = new APIService();
    const [stockOverviewDetails, setStockOverviewDetails] = useState<INTERFACEStockOverview>()
    const [tabID, setTabID] = useState<null | string>('')
    const [summaryDetails, setSummaryDetails] = useState<INTERFACESummaryDetails | undefined>()
    const chartReference = useRef<HighchartsReact.RefObject>(null)
    let [summaryChartDataOptions, setSummaryChartDataOptions] = useState<Highcharts.Options>({
        title: {
            text: '< Ticker > Hourly Price Variation',
        },
        series:[
            {
                type:'line',
                data: [],
            },
        ],
    });
    const [newsData, setNewsData] = useState<any>()
    const [selectedNews, setSelectedNews] = useState<any>(null)
    const [showModal, setShowModal] = useState(false)
    let [historicalChartDataOptions, setHistoricalChartDataOptions] = useState<Highcharts.Options>({
        title: {
            text: '< Ticker > Historical',
        },
        series:[
            {
                type:'line',
                data: [],
            },
        ],
    })
    const [insiderTrendsInfo, setInsiderTrendsIndo] = useState<INTERFACEInsiderSentiments | undefined>()
    const [historicalEPSChart, setHistoricalEPSChart] = useState<Highcharts.Options>({
        title: {
            text: 'Historical EPS Surprises',
        },
        series:[
            {
                type:'line',
                data: [],
            },
        ],
    })
    const [recommendationTrends, setRecommendationTrends] = useState<Highcharts.Options>({
        title: {
            text: 'Recommendation Trends',
        },
        series:[
            {
                type:'line',
                data: [],
            },
        ],
    })
    const [watchListStar, setWatchListStar] = useState<boolean>(false)

    const [showStockBuyModal, setShowStockBuyModal] = useState(false)
    const [stockBuyDetails, setStockBuyDetails] = useState<any>(null)
    const [stockBuyQuantity, setStockBuyQuantity] = useState<number>(0)

    const [showStockSellModal, setShowStockSellModal] = useState(false)
    const [stockSellDetails, setStockSellDetails] = useState<any>(null)
    const [stockSellQuantity, setStockSellQuantity] = useState<number>(0)
    const [stocksPurchasedQuantity, setStocksPurchasedQuantity] = useState<number>(0)
    const [moneyLeft, setMoneyLeft] = useState<number>(0)

    const [purchasedStockFlag, setPurchasedStockFlag] = useState(false)
    const [purchasedStock, setPurchasedStock] = useState('')
    const [soldStockFlag, setSoldStockFlag] = useState(false)
    const [soldStock, setSoldStock] = useState('')

    const [displaySell, setDisplaySell] = useState(false)

    const fnFetchSellButtonDependancy = async () => {
        try {
            let params = `?tickerValue=${tickerValue}`
            const data = await apiService.callInternalAPI("/api/getStockQuantity" + params)
            console.log(data)
            if (data['quantity'] > 0) {
                setDisplaySell(true)
            } else {
                setDisplaySell(false)
            }
        } catch (error) {
            console.error('Error fetching SellButtonDependancy:', error);
        }
    }
    const stockBuyHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setStockBuyQuantity(Number(event.target.value))
    }

    const openModal = (newsItem: any) => {
        setSelectedNews(newsItem);
        setShowModal(true)
    };

    const closeModal = () => {
        setSelectedNews(null);
        setShowModal(false);
    };



    useEffect( () => {
        fetchOverviewData()
        fnFetchSellButtonDependancy()
    },[tickerValue])

    useEffect( () => {
        if (tabID == 'summary') {
            fetchSummaryData()
        } else if (tabID == 'topNews') {
            fetchTopNewsData()
        } else if (tabID == 'chart') {
            fetchChartsData()
        } else if (tabID == 'insights') {
            fetchInsightsData()
        }
    },[tabID])

    const fetchOverviewData = async () => {
        try {
            let tickerValueParams = tickerValue
            let params = `?tickerValue=${tickerValueParams}`
            const data = await apiService.callInternalAPI("/api/getStockOverview" + params)
            setStockOverviewDetails(data[0])
            console.log(stockOverviewDetails)
            setTabID('summary')
        } catch (error) {
            console.error('Error fetching overview data:', error);
        }
    }

    const fetchSummaryData = async () => {
        try {
            let params = `?tickerValue=${tickerValue}&isOpen=${stockOverviewDetails?.marketStatus}&stockLastUpdatedUNIXTimeStamp=${stockOverviewDetails?.stockLastUpdatedTimestamp}`
            console.log(params)
            const data = await apiService.callInternalAPI("/api/getSummaryDetails" + params)
            console.log(data)
            setSummaryDetails(data[0])

            const xAxisCategories = []
            var i
            for (i=0; i<data[0]['summaryTabChartData'].length;i++) {
                xAxisCategories.push(data[0]['summaryTabChartData'][i][0].slice(0,16))
            }
            const newOptions: Highcharts.Options = {
                title: {
                    text: `${tickerValue} Hourly Price Variation`,
                },
                xAxis:[{
                    categories: xAxisCategories
                }],
                yAxis:[{
                    title: {
                        text: null
                    },
                    opposite:true
                }],
                series:[
                    {
                        name: 'Stock Price',
                        data: data[0]['summaryTabChartData'],
                        type: 'line',
                        threshold: null,
                        tooltip: {
                            valueDecimals: 2
                        }
                    }
                ],
            }
            setSummaryChartDataOptions(newOptions)
        } catch (error) {
            console.error('Error fetching summary data:', error);
        }
    }

    const fetchTopNewsData = async () => {
        try {
            let params = `?tickerValue=${tickerValue}`
            const data = await apiService.callInternalAPI("/api/getNewsData" + params)
            console.log(data)
            setNewsData(data)
        } catch (error) {
            console.error('Error fetching news data:', error);
        }
    }

    const fetchChartsData = async () => {
        try {
            let params = `?tickerValue=${tickerValue}`
            const data = await apiService.callInternalAPI("/api/getChartsData" + params)

            const volume = [], ohlc = [], dataLength = data.length, xAxisCategories = []
            const groupingUnits: [string, number[]][] = [
                ['week', [1]],
                ['month', [1, 2, 3, 4, 6]]
            ];
            let i
            for (i=0;i<dataLength;i++) {
                xAxisCategories.push(data[i]['t'])
                ohlc.push([
                    data[i]['t'],
                    data[i]['o'],
                    data[i]['h'],
                    data[i]['l'],
                    data[i]['c']
                ])
                volume.push([
                    data[i]['t'],
                    data[i]['v']
                ])
            }
            const newOptions: Highcharts.Options = {
                rangeSelector: {
                    selected: 0
                },

                title: {
                    text: `${tickerValue} Historical`
                },

                subtitle: {
                    text: 'With SMA and Volume by Price technical indicators'
                },

                yAxis: [{
                    startOnTick: false,
                    endOnTick: false,
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    title: {
                        text: 'OHLC'
                    },
                    height: '60%',
                    lineWidth: 2,
                    resize: {
                        enabled: true
                    }
                }, {
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    title: {
                        text: 'Volume'
                    },
                    top: '65%',
                    height: '35%',
                    offset: 0,
                    lineWidth: 2
                }],

                tooltip: {
                    split: true
                },

                plotOptions: {
                    series: {
                        dataGrouping: {
                            units: groupingUnits
                        }
                    }
                },

                series: [{
                    type: 'candlestick',
                    name: 'AAPL',
                    id: 'aapl',
                    zIndex: 2,
                    data: ohlc
                }, {
                    type: 'column',
                    name: 'Volume',
                    id: 'volume',
                    data: volume,
                    yAxis: 1
                }, {
                    type: 'vbp',
                    linkedTo: 'aapl',
                    params: {
                        volumeSeriesID: 'volume'
                    },
                    dataLabels: {
                        enabled: false
                    },
                    zoneLines: {
                        enabled: false
                    }
                }, {
                    type: 'sma',
                    linkedTo: 'aapl',
                    zIndex: 1,
                    marker: {
                        enabled: false
                    }
                }]
            }
            setHistoricalChartDataOptions(newOptions)



        } catch (error) {
            console.error('Error fetching charts data:', error);
        }
    }

    const fetchInsightsData = async () => {
        try {
            let params = `?tickerValue=${tickerValue}`
            const data = await apiService.callInternalAPI("/api/getInsightsData" + params)
            setInsiderTrendsIndo(data['insiderSentiments'])

            let i
            const historicalEPSActual = [], historicalEPSEstimate = [], xAxisCategories = []

            for (i=0;i<data['earningsdata'].length;i++) {
                historicalEPSActual.push([data['earningsdata'][i]['period'] + '<br>Surprise: ' + data['earningsdata'][i]['surprise'] , data['earningsdata'][i]['actual']])
                historicalEPSEstimate.push([data['earningsdata'][i]['period'] + '<br>Surprise: ' + data['earningsdata'][i]['surprise'] , data['earningsdata'][i]['estimate']])
                xAxisCategories.push(data['earningsdata'][i]['period'] + '<br>Surprise: ' + data['earningsdata'][i]['surprise'])
            }

            const newOptions: Highcharts.Options = {
                title: {
                    text: `Historical EPS Surprises`,
                },
                xAxis:[{
                    categories: xAxisCategories
                }],
                yAxis:[{
                    title: {
                        text: 'Quarterly EPS'
                    },
                    opposite:false
                }],
                series:[
                    {
                        name: 'Actual',
                        data: historicalEPSActual,
                        type: 'spline',
                        threshold: null,
                        tooltip: {
                            valueDecimals: 2
                        }
                    },
                    {
                        name: 'Estimate',
                        data: historicalEPSEstimate,
                        type: 'spline',
                        threshold: null,
                        tooltip: {
                            valueDecimals: 2
                        }
                    }
                ],
            }

            setHistoricalEPSChart(newOptions)

            console.log(data['recommendationdata'])
            const buyData = [], holdData = [], sellData = [], strongBuyData = [], strongSellData = [], xAxisCategoriesRecommendationData = []

            for (i=0;i<data['recommendationdata'].length;i++) {
                xAxisCategoriesRecommendationData.push(data['recommendationdata'][i]['period'].slice(0,7))
                buyData.push([ data['recommendationdata'][i]['period'].slice(0,7), data['recommendationdata'][i]['buy'] ])
                holdData.push([ data['recommendationdata'][i]['period'].slice(0,7), data['recommendationdata'][i]['hold'] ])
                sellData.push([ data['recommendationdata'][i]['period'].slice(0,7), data['recommendationdata'][i]['sell'] ])
                strongBuyData.push([ data['recommendationdata'][i]['period'].slice(0,7), data['recommendationdata'][i]['strongBuy'] ])
                strongSellData.push([ data['recommendationdata'][i]['period'].slice(0,7), data['recommendationdata'][i]['strongSell'] ])
            }

            const newOptions1: Highcharts.Options = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Recommendation Trends'
                },
                xAxis: {
                    categories: xAxisCategoriesRecommendationData
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '# Analysis'
                    },
                    stackLabels: {
                        enabled: false
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}'
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: [{
                    type: 'column',
                    name: 'Strong Buy',
                    data: strongBuyData
                }, {
                    type: 'column',
                    name: 'Buy',
                    data: buyData
                }, {
                    type: 'column',
                    name: 'Hold',
                    data: holdData
                }, {
                    type: 'column',
                    name: 'Sell',
                    data: sellData
                }, {
                    type: 'column',
                    name: 'Strong Sell',
                    data: strongSellData
                }]
            };
            setRecommendationTrends(newOptions1)
        } catch (error) {
            console.error('Error fetching insights data:', error);
        }
    }

    function convertUnixTimeStampToYYYYMMDD(unixTimeStamp: number | undefined): string {
        if (unixTimeStamp === undefined) {
            return '';
        }
        const date = new Date(unixTimeStamp * 1000);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero if needed
        const day = ('0' + date.getDate()).slice(-2); // Add leading zero if needed
        const hours = ('0' + date.getHours()).slice(-2); // Add leading zero if needed
        const minutes = ('0' + date.getMinutes()).slice(-2); // Add leading zero if needed
        const seconds = ('0' + date.getSeconds()).slice(-2); // Add leading zero if needed
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    function getCurrentTimestamp(): string {
        const date = new Date();
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const addToWatchlist = async () => {
        try {
            let params = `?tickerValue=${tickerValue}`
            const data = await apiService.callInternalAPI("/api/addWatchList" + params)
            console.log(data)
        } catch (error) {
            console.error('Error fetching addwatchlist data:', error);
        }
    }

    const openBuyStockModal = async (item: any) => {
        setStockBuyDetails(item)
        setShowStockBuyModal(true)
        try {
            const data = await apiService.callInternalAPI("/api/getWalletMoney")
            setMoneyLeft(data['money'])
        } catch (error) {
            console.error('Error fetching getWalletMoney data:', error);
        }
    }

    const closeBuyStockModal = () => {
        setStockBuyDetails(null)
        setShowStockBuyModal(false)
        setStockBuyQuantity(0)
    }

    const openSellStockModal = async (item: any) => {
        setStockSellDetails(item)
        setShowStockSellModal(true)
        fetchStockQuantity()
        try {
            const data = await apiService.callInternalAPI("/api/getWalletMoney")
            setMoneyLeft(data['money'])
        } catch (error) {
            console.error('Error fetching getWalletMoney data:', error);
        }
    }

    const closeSellStockModal = () => {
        setStockSellDetails(null)
        setShowStockSellModal(false)
        setStockSellQuantity(0)
        setStocksPurchasedQuantity(0)
    }

    const fetchStockQuantity = async () => {
        try {
            let params = `?tickerValue=${tickerValue}`
            const data = await apiService.callInternalAPI("/api/getStockQuantity" + params)
            if (data['stockStatus'] == true) {
                setStocksPurchasedQuantity(Number(data['quantity']))
            }
        } catch (error) {
            console.error('Error fetching getStockQuantity data:', error);
        }
    }

    const stockSellHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setStockSellQuantity(Number(event.target.value))
    }

    const updateBroughtData = async (lastPrice: any, stockBuyQuantity: number, companyCode: any) => {
        try {
            let params = `?tickerValue=${companyCode}&quantity=${stockBuyQuantity}&costPerStock=${lastPrice}`
            const data = await apiService.callInternalAPI("/api/addPortfolio" + params)
            console.log(data)
            setMoneyLeft(data['moneyLeft'])
            setStockBuyQuantity(0)
            setPurchasedStockFlag(true)
            setPurchasedStock(companyCode)
            setDisplaySell(true)
        } catch (error) {
            console.error('Error fetching addPortfolio data:', error);
        }
    }

    const updateSoldData = async (companyCode: any, stockSellQuantity: number, lastPrice: any) => {
        try {
            let params = `?tickerValue=${companyCode}&quantity=${stockSellQuantity}&currentPrice=${lastPrice}`
            const data = await apiService.callInternalAPI("/api/updatePortfolio"+params)
            console.log(data)
            setMoneyLeft(data['moneyLeft'])
            fetchStockQuantity()
            fnFetchSellButtonDependancy()
            setSoldStockFlag(true)
            setSoldStock(companyCode)
        } catch (error) {
            console.error('Error fetching updatePortfolio data:', error);
        }
    }

    const handleStarClick = () => {
        setWatchListStar(!watchListStar);
    };

    function unixTimestampToFormattedDate(unixTimestamp: number) {
        const milliseconds = unixTimestamp * 1000;
        const dateObject = new Date(milliseconds);
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const month = months[dateObject.getMonth()];
        const day = dateObject.getDate();
        const year = dateObject.getFullYear();
        const formattedDate = `${month} ${day}, ${year}`;
        return formattedDate;
    }

    const customRedirect = (val: string | undefined) => {
        if (typeof val === "string") {
            history.push(`/search/${val}`)
        }

    }

    return(

        <Container className='InfoDisplayPage'>
            <HomePage/>
            {(purchasedStockFlag) && (<div onClick={() => {setPurchasedStockFlag(false)}} className='greenBar'>{purchasedStock} bought successfully<Button style={{backgroundColor:'#cae3da'}} className='resetbtn'></Button></div>)}
            {(soldStockFlag) && (<div onClick={() => {setSoldStockFlag(false)}} className='redBar'>{soldStock} sold successfully<Button style={{backgroundColor:'#f6d1d5'}} className='resetbtn'></Button></div>)}
            <Row className="align-items-center infoBar">
                <Col xs={12} md={4} className="text-center">
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                        <Row className="mb-2 infoBar-row1">
                            <Col>{stockOverviewDetails?.companyCode}</Col>
                            <Col>
                            <div onClick={() => addToWatchlist()}>
                                <div onClick={handleStarClick}>
                                    {
                                        watchListStar?(<StarFill style={{ color : '#ffdb01', paddingBottom : '10px' }}/>):(<Star style={{ paddingBottom : '10px' }}/>)
                                    }
                                </div>
                            </div>
                            </Col>
                        </Row>
                        <Row className="mb-2 infoBar-row2">{stockOverviewDetails?.companyName}</Row>
                        <Row className="mb-2">{stockOverviewDetails?.tradingExchangeCode}</Row>
                        <Row>
                            <Col><Button variant="success" size="sm" onClick={() => openBuyStockModal(stockOverviewDetails)}>Buy</Button> </Col>
                            {(displaySell) && (<Col><Button variant="danger" size="sm" onClick={() => openSellStockModal(stockOverviewDetails)}>Sell</Button></Col>)}
                            {(stockBuyDetails != null) && (<Modal show={showStockBuyModal} onHide={closeBuyStockModal}>
                                        <Modal.Header closeButton>
                                        <Modal.Title>{stockBuyDetails?.companyCode}</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div style={{marginLeft:'20px'}}>
                                                <Row>Current Price: {stockBuyDetails?.lastPrice}</Row>
                                                <Row>Money in Wallet: {moneyLeft}</Row>
                                                <Row>
                                                    <Col>Quantity:</Col>
                                                    <Col>
                                                        <input type="number" id="typeNumber" className="form-control" value={stockBuyQuantity} onChange={stockBuyHandleChange}/>
                                                    </Col>
                                                    {
                                                        (moneyLeft < stockBuyQuantity*stockBuyDetails?.lastPrice)?(<div style={{ color: 'red' }}>Not enough money in wallet!</div>):(<div></div>)
                                                    }
                                                </Row>
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Row>
                                                <Col>Total: {stockBuyDetails?.lastPrice * stockBuyQuantity}</Col>
                                                <Col><Button disabled={((moneyLeft < stockBuyQuantity*stockBuyDetails?.lastPrice)||(stockBuyQuantity<=0))?true:false} onClick={() => updateBroughtData(stockBuyDetails?.lastPrice, stockBuyQuantity, stockBuyDetails?.companyCode)}>Buy</Button></Col>
                                            </Row>
                                        </Modal.Footer>
                                    </Modal>)
                            }

                            {(stockSellDetails != null) && (<Modal show={showStockSellModal} onHide={closeSellStockModal}>
                                        <Modal.Header closeButton>
                                        <Modal.Title>{stockSellDetails?.companyCode}</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div style={{marginLeft:'20px'}}>
                                                <Row>Current Price: {stockSellDetails?.lastPrice}</Row>
                                                <Row>Money in Wallet: {moneyLeft}</Row>
                                                <Row>
                                                    <Col>Quantity:</Col>
                                                    <Col>
                                                        <input type="number" id="typeNumber" className="form-control" value={stockSellQuantity} onChange={stockSellHandleChange}/>
                                                    </Col>
                                                    {
                                                        (stocksPurchasedQuantity < stockSellQuantity)?(<div style={{ color: 'red' }}>You cannot sell the stocks that you don't have!</div>):(<div></div>)
                                                    }
                                                </Row>
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Row>
                                                <Col>Total: {stockSellDetails?.lastPrice * stockSellQuantity}</Col>
                                                <Col><Button disabled={((stocksPurchasedQuantity < stockSellQuantity)||(stockSellQuantity<=0))?true:false} onClick={() => updateSoldData(stockSellDetails?.companyCode, stockSellQuantity, stockSellDetails?.lastPrice)}>Sell</Button></Col>
                                            </Row>
                                        </Modal.Footer>
                                    </Modal>)
                            }
                        </Row>
                    </div>
                </Col>
                <Col xs={12} md={4} className="text-center">
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                        <Row>
                            <img src={stockOverviewDetails?.companyLogo} alt="Stock Logo" style={{ maxHeight: '100px' }} />
                        </Row>
                        <Row style={{ paddingTop: '60px', fontWeight: 'strong' }} className={stockOverviewDetails?.marketStatus ? 'text-success' : 'text-danger'}>
                            {stockOverviewDetails?.marketStatus ? "Market is Open" : "Market closed on " + convertUnixTimeStampToYYYYMMDD(stockOverviewDetails?.stockLastUpdatedTimestamp) + ""}
                        </Row>
                    </div>
                </Col>
                <Col xs={12} md={4} className="text-center">
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                        <Row style={{ color: (stockOverviewDetails?.change != null) ? (( Number((stockOverviewDetails.change*1).toFixed(2)) > 0 )?'green': 'red') :'black' }} className="mb-2 infoBar-row1">{stockOverviewDetails?.lastPrice}</Row>
                        <Row style={{ color: (stockOverviewDetails?.change != null) ? (( Number((stockOverviewDetails.change*1).toFixed(2)) > 0 )?'green': 'red') :'black' }} className="mb-2 infoBar-row2">
                            <div className="d-flex align-content-center">
                                {(stockOverviewDetails?.change != null) ? ((stockOverviewDetails.change>0)?<CaretUpFill style={{ marginTop: '5px' , paddingTop: '2px' }}/>:<CaretDownFill style={{ marginTop: '5px' , paddingTop: '2px' }}/>) : <div/>}&nbsp;{stockOverviewDetails?.change}&nbsp;({stockOverviewDetails?.changePercent}%)
                            </div>
                        </Row>
                        <Row>{getCurrentTimestamp()}</Row>
                    </div>
                </Col>
            </Row>
            <div className='custom-tabs'>
                <Tabs
                    defaultActiveKey="summary"
                    id="justify-tab-example"
                    className="mb-3"
                    justify
                    activeKey={tabID== null ? "summary" : tabID}
                    onSelect={(ID) => setTabID(ID)}
                >
                    <Tab className="custom-tab-element" eventKey="summary" title="Summary">
                        <Row>
                            <Col>
                                <div>
                                    <div className='d-flex flex-column justify-content-center' style={{ paddingLeft : '50px', paddingTop : '20px' }}>
                                        <Row style={{ display: "inline"}}><b>High Price:</b> {summaryDetails?.highprice}</Row>
                                        <Row style={{ display: "inline"}}><b>Low Price:</b> {summaryDetails?.lowprice}</Row>
                                        <Row style={{ display: "inline"}}><b>Open Price:</b> {summaryDetails?.openprice}</Row>
                                        <Row style={{ display: "inline"}}><b>Prev. Close:</b> {summaryDetails?.prevclose}</Row>
                                    </div>
                                    <div className='d-flex flex-column justify-content-center align-items-center' style={{ paddingTop : '40px' }}>
                                        <Row style={{ fontSize : '30px', textDecoration : 'underline' }}>About the company</Row>
                                        <Row style={{ display: "inline", paddingTop: '10px'}}><b>IPO Start Date:</b> {summaryDetails?.ipostartdate}</Row>
                                        <Row style={{ display: "inline", paddingTop: '10px'}}><b>Industry:</b> {summaryDetails?.industry}</Row>
                                        <Row style={{ display: "inline", paddingTop: '10px'}}>
                                            <div className='d-flex align-content-center'>
                                                <b>Webpage:</b>&nbsp;{summaryDetails?.webpage && (<a href={summaryDetails.webpage} target="_blank" rel="noopener noreferrer">{summaryDetails.webpage}</a>)}
                                            </div>
                                        </Row>
                                        <Row style={{ display: "inline", paddingTop: '10px'}}>
                                            <b>Company peers:</b>
                                        </Row>
                                        <Row style={{ paddingTop: '10px' }}>
                                            {summaryDetails?.companypeers && (
                                                <span>
                                                {summaryDetails.companypeers.map((company, index) => (
                                                    <React.Fragment key={index}>
                                                    <a style={{ color:'blue', textDecoration:'underline', cursor:'pointer' }} onClick={() => { customRedirect(company) }} rel="noopener noreferrer">
                                                        {company}
                                                    </a>
                                                    {index !== summaryDetails.companypeers.length - 1 && ", "}
                                                    </React.Fragment>
                                                ))}
                                                </span>
                                            )}
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                            <Col>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={summaryChartDataOptions}
                                    ref={chartReference}
                                    {...hihhChartProperties}
                                />
                            </Col>
                        </Row>
                    </Tab>
                    <Tab title='Top news' eventKey='topNews'>
                        <div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', paddingBottom : '50px' }}>
                                {newsData?.map((item: { image: string; headline: string }, index: React.Key | null | undefined) => (
                                    <div key={index} onClick={() => openModal(item)} style={{ width: '50%', boxSizing: 'border-box', padding: '5px' }}>
                                        <Card className="flex-row" style={{ width: '100%', height : '100px', display: 'flex' }}>
                                            <Card.Img variant="left" src={item.image} style={{ width: '150px', height: '100px', paddingLeft: '10px', paddingTop: '10px', paddingBottom: '10px', paddingRight: '10px' }} />
                                            <Card.Body style={{ flex: '1' }}>
                                                <Card.Text style={{ textOverflow: 'ellipsis' }}>
                                                    {item.headline}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                ))}
                            </div>

                            {
                                (selectedNews != null ) && (
                                    <Modal show={showModal} onHide={closeModal}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>
                                                <div style={{ fontSize : '30px' }}>
                                                    {selectedNews.source}
                                                </div>
                                                <div style={{ fontSize : '15px', color: 'darkgray' }}>
                                                    {unixTimestampToFormattedDate(selectedNews.datetime)}
                                                </div>
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div style={{ fontSize: '20px', fontWeight:'bolder' }}>{selectedNews.headline}</div>
                                            <div style={{ textOverflow: 'ellipsis' }}>{selectedNews.summary}</div>
                                            <div style={{ color: 'darkgray' }}>For more details click <a href={selectedNews.url} target="_blank">here</a></div>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <div className='text-left !important'>
                                                <div style={{ marginBottom: '10px', color: 'darkgray' }}>Share</div>
                                                <div>
                                                    <TwitterShareButton
                                                        title={selectedNews.headline}
                                                        url={selectedNews.url}
                                                        style={{ paddingRight: '5px' }}
                                                    >
                                                        <TwitterIcon size={40} round />
                                                    </TwitterShareButton>
                                                    <FacebookShareButton
                                                        url={selectedNews.url}
                                                        className="Demo__some-network__share-button"
                                                    >
                                                        <FacebookIcon size={40} round />
                                                    </FacebookShareButton>
                                                </div>
                                            </div>
                                        </Modal.Footer>
                                    </Modal>
                            )
                        }
                        </div>
                    </Tab>
                    <Tab title='Chart' eventKey='chart'>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={historicalChartDataOptions}
                            ref={chartReference}
                            {...hihhChartProperties}
                        />
                    </Tab>
                    <Tab title='Insights' eventKey='insights'>
                        <div className="d-flex flex-column align-content-center" style={{ paddingBottom: '50px', width: '50%', margin: '0 auto' }}>
                            <Row style={{ fontSize: '30px', paddingBottom: '30px' }} className="d-flex flex-column align-content-center">Insider Sentiments</Row>
                            <Row className='InsightsTable'>
                                <Col className="d-flex justify-content-center" style={{ fontWeight: 'bolder' }}>{tickerValue}</Col>
                                <Col className="d-flex justify-content-center" style={{ fontWeight: 'bolder' }}>MSPR</Col>
                                <Col className="d-flex justify-content-center" style={{ fontWeight: 'bolder' }}>Change</Col>
                            </Row>
                            <Row className='InsightsTable'>
                                <Col className="d-flex justify-content-center" style={{ fontWeight: 'bolder' }}>Total</Col>
                                <Col className="d-flex justify-content-center">{insiderTrendsInfo?.MSPRTotal.toFixed(2)}</Col>
                                <Col className="d-flex justify-content-center">{insiderTrendsInfo?.ChangeTotal.toFixed(2)}</Col>
                            </Row>
                            <Row className='InsightsTable'>
                                <Col className="d-flex justify-content-center" style={{ fontWeight: 'bolder' }}>Positive</Col>
                                <Col className="d-flex justify-content-center">{insiderTrendsInfo?.MSPRPositive.toFixed(2)}</Col>
                                <Col className="d-flex justify-content-center">{insiderTrendsInfo?.ChangePositive.toFixed(2)}</Col>
                            </Row>
                            <Row className='InsightsTable'>
                                <Col className="d-flex justify-content-center" style={{ fontWeight: 'bolder' }}>Negative</Col>
                                <Col className="d-flex justify-content-center">{insiderTrendsInfo?.MSPRNegative.toFixed(2)}</Col>
                                <Col className="d-flex justify-content-center">{insiderTrendsInfo?.ChangeNegative.toFixed(2)}</Col>
                            </Row>
                        </div>
                        <div className="d-inline-flex">
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={recommendationTrends}
                                ref={chartReference}
                                {...hihhChartProperties}
                            />
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={historicalEPSChart}
                                ref={chartReference}
                                {...hihhChartProperties}
                            />
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </Container>
    )
}

export default InfoDisplayPage;