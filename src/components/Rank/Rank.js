import React from 'react';




const Rank = ({name, entries}) => {
	return (
		<div style={{paddingBottom: '00px'}}>
		  <div className='white f5'>
		    {`${name}, your current image entry is ...`}
		  </div>
		  <div className='white f3'>
		    {entries}
		  </div>
		</div>

		);
}

export default Rank;