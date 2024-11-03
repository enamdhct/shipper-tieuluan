'use client'
import React, {useState, useEffect} from "react"
import { updateOrder, getAll, getOrderWithState, searchOrder, getOrder } from "@/services/orderService"
import {Tooltip} from "@nextui-org/react";
import Icon from "@/assets/icon/icon";
import TitleTab from "@/components/TitleTab/TitleTab";
import { getUser } from '@/services/userService'
import { importProductWareHouse, getWareByProductID } from "@/services/warehouseService";
import SearchDatatable from "@/components/SearchDatatable/SearchDatatable";
import Pagination from "@/components/Pagination/Pagination";
import { alertSuccess } from "@/components/Swal/alert";
const moment = require('moment');

export default function Home() {
  const [arrOrder, setArrOrder] = useState('')
  const [arrUser, setArrUser] = useState([])

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(()=>{
      getData()
  },[currentPage])
  async function getData(){
    let data = await getAll(currentPage, JSON.stringify({"type": "shiper"}))
    setArrOrder(data.orders)
    console.log(data.orders);
    setTotalPages(data.pagination.totalPages);
    setCurrentPage(data.pagination.currentPage);
    const users = []
    for(let i = 0; i<data.orders.length;i++){
        let user = await getUser(data.orders[i].userID)
        users.push(user)
    }
    setArrUser(users)
  }

  const handlePageClick = ({ selected }) => {
    const newPage = selected + 1;
    setCurrentPage(newPage);
  };
  async function handleSuccess (id){
    let update = await updateOrder(id, JSON.stringify({"state": "Hoàn thành"}))
    if (update){
      getData()
      alertSuccess({ status: 'success', text: 'Thao tác thành công' })
    }
  }
  async function handleFail (id){
    let update = await updateOrder(id, JSON.stringify({"state": "Đã hủy"}))
    if (update){
      getData()
      alertSuccess({ status: 'success', text: 'Thao tác thành công' })
    }
  }
  async function handleSearchOrder(e){
    if (e.key === 'Enter') {
        const searchText = e.target.value;
        let rs = await searchOrder(JSON.stringify({"text": searchText}))
        console.log(rs.orders);
        const arr = []
        arr.push(rs.orders)
        setArrOrder(arr)
    }
  }
  async function handleEmptyInput (e){
    if (e.target.value === ''){
      getData()
    }
  }
  function getStateClass(state) {
    switch (state) {
      case 'Đang vận chuyển':
        return 'text-sky-500 font-bold';
      case 'Hoàn thành':
        return 'text-green-500 font-bold';
     case 'Đã hủy':
        return 'text-red-500 font-bold';
    }
  }
  async function handleChangeSelect(value){
    if (value === 'all'){
      getData()
    } else {
      let arrOrder = await getOrderWithState(JSON.stringify({"state": value}))
      if (arrOrder){
        setArrOrder(arrOrder)
      }
    }
  }
  return (
    <div className='p-8 h-[calc(100%-40px)]'>
      <TitleTab text={'Quản lý đơn hàng'} className={'text-black'}></TitleTab>
    <div className="mt-4 bg-white p-5 rounded-lg shadow-inner" style={{minHeight: "87%"}}>
      <div className='flex flex-row justify-between'>
        <select className='rounded' onChange={(e)=>{handleChangeSelect(e.target.value)}}>
            <option value="all">Tất cả</option>
            <option value="Đang vận chuyển">Đang vận chuyển</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Đã hủy">Đã hủy</option>
        </select>
        <SearchDatatable fnSearch={handleSearchOrder} fnChange={handleEmptyInput}></SearchDatatable>
      </div>
      <div className='shadow-md'>
      <table className="w-full border-collapse font-arial mt-4">
            <thead className='bg-slate-100'>
              <tr>
                <th className="border text-left p-4">Mã đơn hàng</th>
                <th className="border text-left p-4">Ngày đặt</th>
                <th className="border text-left p-4">Người đặt</th>
                <th className="border text-center p-4">Thu hộ</th>
                <th className="border text-center p-4">Trạng thái</th>
                <th className="border text-left p-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {
              arrOrder.length > 0 ? (          
                arrOrder && arrOrder.filter((item) => item.state !== 'Nháp' && item.state !== 'Đang xử lí').map((item, index)=>{
                  const user = arrUser[index]
                  return(
                    <tr key={index}>
                      <td className="border text-left p-4">{item._id}</td>
                      <td className="border text-left p-4">{moment(item.orderTime).format("DD/MM/YYYY HH:mm:ss")}</td>
                      <td className="border text-left p-4">{user && user.name}</td>
                      <td className="border text-center p-4">{item.Price.toLocaleString('vi-VN', {style: 'currency',currency: 'VND'})}</td>
                      <td className="border text-center p-4">{
                        <span className={getStateClass(item.state)}>{item.state}</span>
                      }</td>

                      <td className="border text-left p-4">
                      { item.state === "Đang vận chuyển" && 
                        <div className='flex flex-row gap-3 justify-center'>
                          <Tooltip content="Giao hàng thành công">
                            <div onClick={()=>handleSuccess(item._id)} className="cursor-pointer">
                                <Icon name={'check'} className={'text-green-600 w-6 h-6'}></Icon>
                            </div>
                          </Tooltip>
                          <Tooltip content="Giao hàng thất bại">
                            <div onClick={()=>handleFail(item._id)} className="cursor-pointer">                            
                              <Icon name={'cancel'} className={'text-red-600 w-6 h-6'}></Icon>
                            </div>
                          </Tooltip>

                      </div>
                      }
                      </td>
                    </tr>
                  )
                })
              ) : (            
                <tr >
                  <td colSpan="6" className='border text-center p-4'>Không có đơn hàng</td>
                </tr>
              )}
            </tbody> 
        </table>
        <div className='py-2 px-5'>
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageClick} />
        </div>
      </div>
    </div>
    </div>
  )
}
