import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { authConfig, backendUrl, currency, resolveProductImage } from '../config'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {

    if (!token) {
      return null;
    }

    try {

      const response = await axios.post(backendUrl + '/api/order/list', {}, authConfig(token))
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to load orders')
    }


  }

  const statusHandler = async ( event, orderId ) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, authConfig(token))
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Unable to update order')
    }
  }

  const paymentHandler = async (event, orderId) => {
    try {
      const payment = event.target.value === 'paid'
      const response = await axios.post(backendUrl + '/api/order/payment', { orderId, payment }, authConfig(token))
      if (response.data.success) {
        await fetchAllOrders()
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to update payment')
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <img className='w-12' src={assets.parcel_icon} alt="" />
                <div className='flex flex-col gap-2'>
                <div>
                  {order.items.map((item, index) => {
                    const image = resolveProductImage(Array.isArray(item.image) ? item.image[0] : item.image)
                    return <div className='flex items-center gap-2 py-1' key={index}>
                      <img
                        className='w-16 h-16 object-cover border'
                        src={image || assets.parcel_icon}
                        alt={item.name}
                        onError={(event) => { event.currentTarget.src = assets.parcel_icon }}
                      />
                      <p>{item.name} x {item.quantity} <span>{item.size}</span></p>
                    </div>
                  })}
                </div>
                <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
                <div>
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
                <p className='mt-3'>Method : {order.paymentMethod}</p>
                <p>Payment : { order.payment ? 'Paid' : 'Pending' }</p>
                <select onChange={(event) => paymentHandler(event, order._id)} value={order.payment ? 'paid' : 'pending'} className='p-2 border'>
                  <option value='pending'>Pending</option>
                  <option value='paid'>Paid / Success</option>
                </select>
                <p>Date : {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>
              <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} className='p-2 font-semibold'>
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders