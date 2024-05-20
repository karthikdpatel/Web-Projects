
import { useEffect, useRef, useState } from "react";
import { APIService } from "../services/api-service";
import {INTERFACEWatchListDetails} from "../interfaces/WatchListDetails";
import {Card, CardBody, Col, Row} from "react-bootstrap";
import './WatchList.css'
import { ArrowUp, ArrowDown, CaretUpFill, CaretDownFill } from 'react-bootstrap-icons';

const WatchlistPage = () => {
    const apiService = new APIService();
    const [watchList, setWatchList] = useState<INTERFACEWatchListDetails[] | undefined>()
    const [watchListEmptyFlag, setWatchListEmptyFlag] = useState<boolean>(true)

    useEffect(() => {
        fetchWatchListData()
    }, [])

    const fetchWatchListData = async () => {
        try {
            const data = await apiService.callInternalAPI("/api/getWatchListData")
            console.log(data)
            console.log("Hello")
            console.log(data.length)
            if (data.length != 0) {
                setWatchListEmptyFlag(false)
            } else {
                setWatchListEmptyFlag(true)
            }
            console.log(watchListEmptyFlag)
            setWatchList(data)
        } catch (error) {
            console.error('Error fetching overview data:', error);
        }
    }

    const handleButtonClose = async (companyCode: String) => {
        const params = `?tickerSymbol=${companyCode}`
        const data = await apiService.callInternalAPI("/api/deleteItemWatchList" + params)
        fetchWatchListData()
    }

    return(
        <div className='watchListPage'>
            <div className='watchListPageHeading'>My Watchlist</div>
            {(watchListEmptyFlag) && (<div className='maroonBar'>Currently you don't have any stocks in your watchlist</div>)}
            {(watchList ?? []).map((item, index) =>(
                <div key={index} className='watchListCard'>
                    <Card>
                        <div className='btn-close' onClick={() => handleButtonClose(item.companyCode)}></div>
                            <CardBody>
                                <Row className='watchListTopCol'>
                                    <Col>
                                        {item.companyCode}
                                    </Col>
                                    <Col style={{ color : ((item.change*1).toFixed(2) != '0.00')?(( Number((item.change*1).toFixed(2)) > 0)?'green':'red'):'black' }}>
                                        {(item.lastPrice*1).toFixed(2)}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {item.companyName}
                                    </Col>
                                    <Col style={{ color : ((item.change*1).toFixed(2) != '0.00')?(( Number((item.change*1).toFixed(2)) > 0)?'green':'red'):'black' }}>
                                        { (Number((item.changePercent*1).toFixed(2)) > 0)?<CaretUpFill/>:<CaretDownFill/> }       {(item.change*1).toFixed(2)}  ({(item.changePercent*1).toFixed(2)}%)
                                    </Col>
                                </Row>
                            </CardBody>
                    </Card>
                </div>
            )) }
        </div>
    )
}

export default WatchlistPage
