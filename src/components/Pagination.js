
import React, {Component} from 'react'


export default class Pagination extends Component {

  componentWillReceiveProps( nextProps ) {
    const items = this.props.items || 0

    if ( nextProps.items !=  items ) {

      if(this.props.onPageChange){
        this.props.onPageChange(1)
      }
    }
  }

  render() {

    const items = this.props.items || 0
    const perPage = this.props.perPage || 10
    const totalPage =  Math.ceil( items / perPage );
    const currentPage = this.props.currentPage || 1;



    const gotoPage = ( val ) => event => {
      let currentPage
      if ( val == 'prev' ) {
        currentPage = Math.max( currentPage - 1, 1 );
      }
      else if ( val == 'next' ) {
        currentPage = Math.min( totalPage, currentPage + 1 );
      }
      else {
        currentPage = val;
      }

      if(this.props.onPageChange){
        this.props.onPageChange(currentPage)
      }

      event.preventDefault();
      return false;
    }

    const paginateDetail = () => {
      var result = [];
      var pn; var classname; var flag = true;

      for ( pn = 1; pn < totalPage+1; pn ++ ) {
        if ( ( pn < 3 || pn > totalPage - 2 ) || ( pn > currentPage - 3 && pn < currentPage + 3 ) ) {
          classname = "page "
          classname += currentPage==pn?"active":"";
          result.push(
                       (<li key={pn} className={classname}>
                          <a href="#" onClick={gotoPage(pn)}>{pn}</a>
                        </li> ));
          flag = false;
        }
        else {
          if ( flag == false )
            result.push(
                         (<li key='rest' className="page">
                            <a href="javascript:void(0);">...</a>
                          </li> ))
          flag = true;
        }
      }

      return result;
    }

    const paginateTable = ( totalPage < 2 )  ?
        (<div></div>)
      : (<div className="text-right">
          <ul className="pagination-sm pagination pagination-green">
            <li className="prev">
              <a href="#" onClick={gotoPage('prev')}>&lt;</a>
            </li>
            {paginateDetail()}
            <li className="next">
              <a href="#" onClick={gotoPage('next')}>&gt;</a>
            </li>
          </ul>
        </div> )


    return paginateTable
  }
}
