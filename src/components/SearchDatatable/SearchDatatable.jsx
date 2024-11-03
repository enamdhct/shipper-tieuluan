import React from 'react'

export default function SearchDatatable({fnSearch, fnChange}) {
  return (
    <div>
        <input placeholder='TÌM KIẾM SẢN PHẨM' className='rounded p-2 border-2' onKeyDown={(e)=>{fnSearch(e)}} onChange={(e)=>{fnChange(e)}}></input>
    </div>
  )
}
