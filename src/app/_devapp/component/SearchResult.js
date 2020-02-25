import React,  { Component } from 'react'
import { BrowserRouter  as Router, Route, Link } from 'react-router-dom';
import Adslider from "./Adslider";

class SearchResult extends Component{
    constructor(){
        super();
        this.state = {searchValue:'',listItems:null,batch:0,total:0,loadMore:false};
    }
    componentDidMount(){
       var _that = this;
       var {batch} = this.state;
       var p = this.props.location.search;
       
       p = p.replace('?','');
       var params = new URLSearchParams(p); 
       var searchValue = params.get('q');
       searchValue = searchValue.replace('+'," ");
       this.setState({searchValue:searchValue});
       this.fetchSearchResult(searchValue,batch);
    }
    fetchSearchResult = function(x,y){
        let searchValue = x;
        let batch = y;
        var _that = this;
        const {loadMore} = this.state;
        const {listItems} = _that.state;
                
        $.ajax({url:STATIC_URL+'/actions/',method:'POST',data:{action:'searchPeople',query:searchValue,batch:batch}}).done(function(response){
             response = JSON.parse(response);  
             if(loadMore==true)
             {
                _that.setState({loadMore:false});
                 var _temp = [...listItems,...response.data.people];
                _that.setState({listItems:_temp});
                _that.setState({total:parseInt(response.data.total)});
             }
             else
             {
                _that.setState({listItems:response.data.people});
                _that.setState({total:parseInt(response.data.total)});
             }
           });
    }
    handleChange = (e) =>{
        this.setState({searchValue:e.target.value});
        
    }

    componentDidUpdate(){
        var _that = this;
        var {batch} = this.state;
        var {searchValue} = this.state;
        var {loadMore} = this.state;
        if(loadMore==true){
            this.fetchSearchResult(searchValue,batch);
        }
     }
    loadMoreAction = (e) => {
        var _batch = this.state.batch;
        _batch = _batch + 1;;
        this.setState({batch:_batch});
        this.setState({loadMore:true});
    }
    loadMore = (e) => {
        var {batch} = this.state; 
        if((batch*9)+9 < this.state.total){
           return  <button className="form-control btn-load loadmore" type="button" onClick={this.loadMoreAction} >Load More</button>
        }

    }
    handleSearch = (e) => {
        e.preventDefault();
        const {searchValue} = this.state;
        this.setState({batch:0});
        this.fetchSearchResult(searchValue,0); 
 
    }
    render(){
        const {listItems} = this.state; 
        const {count} = this.state;
        return   <div className="main">
                <header className="searchadvance">
                    <div className="container">
                        <div className="search-result">
                            <div className="row">
                                <div className="col col-md-12 col-sm-12">
                                    <form autoComplete="off" className="form"  onSubmit={this.handleSearch}>
                                        <div className="form-group">
                                            <input type="text" value={this.state.searchValue} onChange={this.handleChange} className="form-control box-search familyname" placeholder="Search" name="q"/>
                                            <button className="form-control btn-search finderdetail" type="submit">
                                            <i className="fa fa-search"></i> Search</button> 
                                            <Link to="/advancesearch"><button className="form-control btn-search advsearch uniquesearch" type="submit">
                                            <i className="fa fa-search"></i> Advance Search</button></Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
               
                
                <Adslider/>
                <hr/>
                {
                    (listItems!=null) && 
                    <main>
                        <div className="container">
                            <div className="search-result">
                                <div className="row result-items">
                                {listItems.map((value, index) => {
                                    return  <div key={index} className="col col-md-4 col-sm-12 col-lg-4">
                                                <div className="card">
                                                    <div className="card-body fullinfo">
                                                        <h3 className="card-title detailhead">{value.fullName}</h3>
                                                        <p className="card-text detailtext">S/O {value.father} | {(value.maritalStatus=='m')?'Married':'Un-married'}</p>
                                                        <Link to={'/person/'+value.uuid} className="btn btn-show btn-sm"><i className="fa fa-tree"></i>Show Tree</Link>
                                                    </div>
                                                </div>
                                            </div>
                                    })}    
                                </div>
                            {this.loadMore()}
                            </div>
                        </div>
                    </main>
                }
            </div>
    }
}

export default SearchResult;