import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './app.css';
import { SplitButton, MenuItem, Grid, Row, Col } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller';
import Loader from './loader';
import Smiley from './smiley';


class App extends Component {
    constructor() {
        super();

        // initial component state variables
        this.state = {
            loading: true,
            page: 1,
            products: [],
            hasMoreData: false,
            sortkey: 'Id',
            cache: [],
            currentUrl: null
        };

        // bind various functions being used to the 'this' variable
        this.sortItemsBy = this.sortItemsBy.bind(this);
        this.loadNextData = this.loadNextData.bind(this);
        this.returnSmileyData = this.returnSmileyData.bind(this);
    }

    componentDidMount() {
        // on component mount get data from server
        this.getData(`/api/products?_sort=id&_page=${this.state.page}&_limit=20`);
    }

    /* function for retrieving data from the server */
    getData(url) {
        fetch(url).then((resp) =>{
            return resp.json();
        })
        .then(data => {
            // conditionally render data or cache it for use later
            if (this.state.products.length === 0) {
                this.setState({
                    products: this.state.products.concat(data),
                    loading: false,
                    page: this.state.page + 1,
                    hasMoreData: (data.length > 0) ? true : false
                });

                this.loadNextData();
            }
            else {
                this.setState({
                    cache: data,
                    page: this.state.page + 1,
                    hasMoreData: (data.length > 0) ? true : false
                });
            }
        })
        .catch(error => {
            console.log('Error: ' + JSON.stringify(error));
        });
    }

    /* function for retrieving sorted data based on a certain key from the server */
    sortItemsBy(eventKey, event) {
        let sortkey;

        switch(eventKey) {
            case '1': {
                sortkey = 'Size';
                break;
            }
            case '2': {
                sortkey = 'Price';
                break;
            }
            default: {
                sortkey = 'Id';
            }
        }

        this.setState({
            loading: true,
            sortkey: sortkey,
            page: 1,
            products: [],
            hasMoreData: false
        });

        this.getData(`/api/products?_sort=${sortkey.toLowerCase()}&_page=1&_limit=20`);
    }

    /* funtion called to get next page data from server on infinite scroll */
    loadNextData() {
        const dataCache = this.state.cache;
        const url = `/api/products?_sort=${this.state.sortkey.toLowerCase()}&_page=${this.state.page}&_limit=20`;

        // when getting data from the server and a request is already being sent
        // reject the latter
        if (this.state.currentUrl === url) {
            return;
        }

        // check if we have cache some data and if true we render it quickly
        if (dataCache.length === 0) {
            this.getData(url);
        }
        else {
            this.setState({
                products: this.state.products.concat(dataCache),
                loading: false,
                cache: [],
                currentUrl: url
            });

            this.getData(url);
        }
    }

    /* funtion for rendering a grid of smiley products */
    returnSmileyData() {
        return this.state.products.map((product, index) => {
            if (((index + 1) % 20 === 0)) {
                // generating a unique sponsored advert with this variable from server
                const imgId = Math.floor(Math.random() * index) % index;

                return (
                    <div key={ index } >
                        <Col xs={ 12 } sm={ 6 } md={ 3 } className="col-container">
                            <Smiley product={ product } />
                        </Col>

                        <Col className="img-col-container">
                            <h3>Advertisement</h3>
                            <img src={ `/ads/?r=${imgId}` } alt={ `${index}` } />
                        </Col>
                    </div>
                )
            }
            else {
               return (
                    <Col key={ index } xs={ 12 } sm={ 6 } md={ 3 } className="col-container">
                        <Smiley product={ product } />
                    </Col>
                )
            }
        });
    }

    render() {
        return (
            <div>
                <div className="sort-container">
                    <span className="sort-label">Sort By:</span>

                    <SplitButton title={ this.state.sortkey } id="sort-dropdown" onSelect={ this.sortItemsBy }>
                        <MenuItem eventKey="1">Size</MenuItem>
                        <MenuItem eventKey="2">Price</MenuItem>
                        <MenuItem eventKey="3">Id</MenuItem>
                    </SplitButton>
                </div>

                <Grid>
                    <Row className="row-container">
                        <InfiniteScroll pageStart={ this.state.page } loadMore={ this.loadNextData } hasMore={ this.state.hasMoreData } threshold={ 50 } loader={ <Loader type="bars" color="gold" /> } >
                            { (!this.state.loading) ? this.returnSmileyData() : <Loader type="bubbles" color="green" /> }
                        </InfiniteScroll>
                    </Row>
                </Grid>

                { (!this.state.hasMoreData && this.state.page > 1) ? <h2 className="pageLoad-endLabel" >~ end of catalogue ~</h2> : null }
            </div>
        );
    }
}


export default App;
                        