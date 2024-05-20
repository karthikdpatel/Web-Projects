import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { APIService } from "../services/api-service";
import {Button, Card, CardBody, CardFooter, CardHeader, Col, Modal, Row} from "react-bootstrap";
import {INTERFACEPortfolioOverview} from "../interfaces/PortfolioDetails";
import {AppState} from "../store/reducer";
import {addToNumber, subtractFromNumber} from "../store/actions";
import './PortfolioPage.css'

const PortfolioPage = () => {
    const apiService = new APIService();

    const [portfolioDataFlag, setPortfolioDataFlag] = useState(true)
    const [portfolioData, setPortfolioData] = useState<INTERFACEPortfolioOverview[] | undefined>()

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

    useEffect(() => {
        fetchPortfolioData()
        fetchWallet()
    },[])

    const fetchWallet = async () => {
        try {
            const data = await apiService.callInternalAPI("/api/getWalletMoney")
            setMoneyLeft(data['money'])
        } catch (error) {
            console.error('Error fetching overview data:', error);
        }
    }

    const fetchPortfolioData = async () => {
        try {
            const data = await apiService.callInternalAPI('/api/getPortfolioData')
            console.log(data)
            setPortfolioData(data)
            if (data.length != 0) {
                setPortfolioDataFlag(true)
            } else {
                setPortfolioDataFlag(false)
            }
        } catch (error) {
            console.error('Error fetching overview data:', error);
        }
    }


    const stockBuyHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setStockBuyQuantity(Number(event.target.value))
    }


    const openBuyStockModal = async (item: any) => {
        setStockBuyDetails(item)
        setShowStockBuyModal(true)
        try {
            const data = await apiService.callInternalAPI("/api/getWalletMoney")
            setMoneyLeft(data['money'])
        } catch (error) {
            console.error('Error fetching overview data:', error);
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
        fetchStockQuantity(item.tickerValue)
        try {
            const data = await apiService.callInternalAPI("/api/getWalletMoney")
            setMoneyLeft(data['money'])
        } catch (error) {
            console.error('Error fetching overview data:', error);
        }
    }

    const fetchStockQuantity = async (tickerValue: any) => {
        try {
            let params = `?tickerValue=${tickerValue}`
            const data = await apiService.callInternalAPI("/api/getStockQuantity" + params)
            if (data['stockStatus'] == true) {
                setStocksPurchasedQuantity(Number(data['quantity']))
            }
        } catch (error) {
            console.error('Error fetching overview data:', error);
        }
    }

    const closeSellStockModal = () => {
        setStockSellDetails(null)
        setShowStockSellModal(false)
        setStockSellQuantity(0)
        setStocksPurchasedQuantity(0)
    }

    const updateBroughtData = async (lastPrice: any, stockBuyQuantity: number, companyCode: any) => {
        try {
            let params = `?tickerValue=${companyCode}&quantity=${stockBuyQuantity}&costPerStock=${lastPrice}`
            const data = await apiService.callInternalAPI("/api/addPortfolio" + params)
            console.log(data)
            setMoneyLeft(data['moneyLeft'])
            setStockBuyQuantity(0)
            fetchPortfolioData()
            setPurchasedStockFlag(true)
            setPurchasedStock(companyCode)
        } catch (error) {
            console.error('Error fetching overview data:', error);
        }
    }

    const stockSellHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setStockSellQuantity(Number(event.target.value))
    }

    const updateSoldData = async (companyCode: any, stockSellQuantity: number, lastPrice: any) => {
        try {
            let params = `?tickerValue=${companyCode}&quantity=${stockSellQuantity}&currentPrice=${lastPrice}`
            const data = await apiService.callInternalAPI("/api/updatePortfolio"+params)
            console.log(data)
            setMoneyLeft(data['moneyLeft'])
            fetchStockQuantity(companyCode)
            fetchPortfolioData()
            setSoldStockFlag(true)
            setSoldStock(companyCode)
        } catch (error) {
            console.error('Error fetching overview data:', error);
        }
    }


    return(
            <div className='portfolioPage'>
                    {(purchasedStockFlag) && (<div onClick={() => {
                        setPurchasedStockFlag(false)
                    }} className='greenBar'>{purchasedStock} bought successfully<Button style={{backgroundColor: '#cae3da'}}
                                                                                        className='resetbtn'></Button></div>)}
                    {(soldStockFlag) && (<div onClick={() => {
                        setSoldStockFlag(false)
                    }} className='redBar'>{soldStock} sold successfully<Button style={{backgroundColor: '#f6d1d5'}}
                                                                               className='resetbtn'></Button></div>)}
                    <div className='portfolioHeading'>My Portfolio</div>
                    <div className='walletInfo'>Money in Wallet: ${moneyLeft}</div>
                    {
                        ((portfolioDataFlag) && (portfolioData ?? []).map((item, index) => (
                            <div key={index} className='cardCSS'>
                                <Card>
                                    <CardHeader>
                                        {item.tickerValue} {item.companyName}
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Col>Quantity:</Col>
                                            <Col>{item.quantity}</Col>
                                            <Col>Change:</Col>
                                            <Col style={{ color: ((((item.totalCost / item.quantity) - item.currentPrice).toFixed(2) !== '0.00') && (((item.totalCost / item.quantity) - item.currentPrice).toFixed(2) !== '-0.00')) ? (Number(((item.totalCost / item.quantity) - item.currentPrice).toFixed(2)) > 0 ? 'green' : 'red') : 'black' }}>{ (((item.totalCost / item.quantity) - item.currentPrice).toFixed(2)==='-0.00')?'0.00':((item.totalCost / item.quantity) - item.currentPrice).toFixed(2) }</Col>
                                        </Row>
                                        <Row>
                                            <Col>Avg. Cost / Share:</Col>
                                            <Col>{(item.totalCost / item.quantity).toFixed(2)}</Col>
                                            <Col>Current Price:</Col>
                                            <Col style={{ color: ((((item.totalCost / item.quantity) - item.currentPrice).toFixed(2) !== '0.00') && (((item.totalCost / item.quantity) - item.currentPrice).toFixed(2) !== '-0.00')) ? (Number(((item.totalCost / item.quantity) - item.currentPrice).toFixed(2)) > 0 ? 'green' : 'red') : 'black' }}>{(item.currentPrice)}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Total Cost:</Col>
                                            <Col>{(item.totalCost).toFixed(2)}</Col>
                                            <Col>Market Value:</Col>
                                            <Col style={{ color: ((((item.totalCost / item.quantity) - item.currentPrice).toFixed(2) !== '0.00') && (((item.totalCost / item.quantity) - item.currentPrice).toFixed(2) !== '-0.00')) ? (Number(((item.totalCost / item.quantity) - item.currentPrice).toFixed(2)) > 0 ? 'green' : 'red') : 'black' }}>{(item.quantity * item.currentPrice).toFixed(2)}</Col>
                                        </Row>
                                    </CardBody>
                                    <CardFooter>
                                        <Row>
                                            <Col>
                                                <Button className='buttons' color='blue' size="sm"
                                                        onClick={() => openBuyStockModal(item)}>Buy</Button>
                                                <Button className='buttons' variant="danger" size="sm"
                                                        onClick={() => openSellStockModal(item)}>Sell</Button>
                                            </Col>
                                            {(stockBuyDetails != null) && (
                                                <Modal show={showStockBuyModal} onHide={closeBuyStockModal}>
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>{stockBuyDetails?.tickerValue}</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <div style={{marginLeft: '20px'}}>
                                                            <Row>Current
                                                                Price: {(stockBuyDetails?.currentPrice * 1).toFixed(2)}</Row>
                                                            <Row>Money in Wallet: {moneyLeft}</Row>
                                                            <Row>
                                                                Quantity:&nbsp;&nbsp;<input style={{width: '300px', height: '28px'}}
                                                                                            type="number" id="typeNumber"
                                                                                            className="form-control"
                                                                                            value={stockBuyQuantity}
                                                                                            onChange={stockBuyHandleChange}/>
                                                                {
                                                                    (moneyLeft < stockBuyQuantity * stockBuyDetails?.currentPrice) ? (
                                                                        <div style={{color: 'red'}}>Not enough money in
                                                                            wallet!</div>) : (<div></div>)
                                                                }
                                                            </Row>
                                                        </div>
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <Row>
                                                            <Col>Total: {(stockBuyDetails?.currentPrice * stockBuyQuantity).toFixed(2)}</Col>
                                                            <Col><Button variant={"success"}
                                                                         disabled={((moneyLeft < stockBuyQuantity * stockBuyDetails?.currentPrice) || (stockBuyQuantity <= 0)) ? true : false}
                                                                         onClick={() => updateBroughtData(stockBuyDetails?.currentPrice, stockBuyQuantity, stockBuyDetails?.tickerValue)}>Buy</Button></Col>
                                                        </Row>
                                                    </Modal.Footer>
                                                </Modal>)
                                            }

                                            {(stockSellDetails != null) && (
                                                <Modal show={showStockSellModal} onHide={closeSellStockModal}>
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>{stockSellDetails?.tickerValue}</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <div style={{marginLeft: '20px'}}>
                                                            <Row>Current Price: {stockSellDetails?.currentPrice}</Row>
                                                            <Row>Money in Wallet: {moneyLeft}</Row>
                                                            <Row>
                                                                Quantity:&nbsp;&nbsp;<input style={{width: '300px', height: '28px'}}
                                                                                            type="number" id="typeNumber"
                                                                                            className="form-control"
                                                                                            value={stockSellQuantity}
                                                                                            onChange={stockSellHandleChange}/>
                                                                {
                                                                    (stocksPurchasedQuantity < stockSellQuantity) ? (
                                                                        <div style={{color: 'red'}}>You cannot sell the stocks that
                                                                            you don't have!</div>) : (<div></div>)
                                                                }
                                                            </Row>
                                                        </div>
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <Row>
                                                            <Col>Total: {(stockSellDetails?.currentPrice * stockSellQuantity).toFixed(2)}</Col>
                                                            <Col><Button variant={"success"}
                                                                         disabled={((stocksPurchasedQuantity < stockSellQuantity) || (stockSellQuantity <= 0)) ? true : false}
                                                                         onClick={() => updateSoldData(stockSellDetails?.tickerValue, stockSellQuantity, stockSellDetails?.currentPrice)}>Sell</Button></Col>
                                                        </Row>
                                                    </Modal.Footer>
                                                </Modal>)
                                            }
                                        </Row>
                                    </CardFooter>
                                </Card>
                            </div>
                        )))
                        || (
                            (!portfolioDataFlag) && (<div className='noDataBar'>Currently you don't have any stock.</div>)
                        )
                    }
                </div>
        )

}


export default PortfolioPage