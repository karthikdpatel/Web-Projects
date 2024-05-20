import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import {Spinner} from "react-bootstrap";
import React, { useEffect, useMemo, useState } from "react";
import { APIService } from "../services/api-service";
import './HomePage.css'
import {useHistory} from "react-router-dom";

export default function HomePage(){
    const [tickerSymbol, setTickerSymbol] = useState("");
    const [tickerSymbolSuggestions, setTickerSymbolSuggestions] = useState<{displayName: string; code: string }[]>([]);
    const apiService: APIService = useMemo(() => new APIService(), []);

    const [noInput, setNoInput] = useState(false)
    let typeaheadref = React.createRef<any>();

    let history = useHistory()

    useEffect(() => {
        if (tickerSymbol.length > 0) {
          apiService
            .callInternalAPI(`/api/getStockTickerSuggestion/${tickerSymbol}`)
            .then((data) => {
                console.log(data.length);
                console.log(tickerSymbol)
                setTickerSymbolSuggestions(data);
            });
        }
      }, [tickerSymbol, apiService]);


    const customRedirect = () => {
        history.push(`/search/${tickerSymbol}`)
    }

    const clearInput = () => {
        if (typeaheadref.current) {
            typeaheadref.current.clear();
            setTickerSymbol('');
            setNoInput(false);
        }
    };

    return(
        <div>
            <Container className='text-center searchContainer'>
                <div className='stockSearchTitle'>STOCK SEARCH</div>
                <Row className="productSearchRow">
                    <Col>
                        <div className='inputbar-container'>
                            <Form.Group>
                                <div className="inputbar">
                                    <Typeahead
                                            id="pincode"
                                            className="stockSearchInput"
                                            minLength={1}
                                            onInputChange={(t, e) => {
                                                setTickerSymbol(t);
                                                setNoInput(false)
                                            }}
                                            onChange={(o) => {
                                            if (o.length > 0 && o[0].length === 5)
                                                setTickerSymbol(o[0] as string);
                                            }}
                                            options={tickerSymbolSuggestions}
                                            ref={typeaheadref}
                                            labelKey="label"
                                            placeholder='Enter stock ticker symbol'
                                    ></Typeahead>
                                    {/*<Button variant="primary" className='searchbtn' onClick={(event) => {if (tickerSymbol == ""){event.preventDefault();setNoInput(true);} else {setNoInput(false);customRedirect(`/home/${tickerSymbol}`)}}}></Button>*/}
                                    <Button variant="primary" className='searchbtn' onClick={() => { customRedirect() }}></Button>
                                    <Button className='resetbtn' onClick={clearInput} ></Button>
                                </div>
                                {(noInput == true) && (<div className='errorBar'>Please enter a valid ticker</div>)}
                            </Form.Group>
                        </div>
                    </Col>
                </Row>

            </Container>
      </div>
    )
}

