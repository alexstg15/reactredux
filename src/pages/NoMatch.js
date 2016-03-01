import React from 'react'

class NoMatch extends React.Component {

  render() {
    return (
    	<div className="error-full-page">
			<div className="container">
				<div className="row">
					<div className="col-sm-12 page-error">
						<div className="error-number text-azure">
							404
						</div>
						<div className="error-details col-sm-6 col-sm-offset-3">
							<h3>Oops! You are stuck at 404</h3>
							<p>
								Unfortunately the page you were looking for could not be found.
								<br/>
								It may be temporarily unavailable, moved or no longer exist.
								<br/>
								Check the URL you entered for any mistakes and try again.
								<br/>
								<a href="index.html" className="btn btn-red btn-return">
									Return home
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
    )
  }
}

export default NoMatch
