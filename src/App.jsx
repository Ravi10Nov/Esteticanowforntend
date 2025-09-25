import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import OrderCompletionPage from './components/OrderCompletionPage'
import Product from './components/Product'
import Body from './components/Body'
import Invoice from './components/Invoice'

function App() {

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Body />,
      children: [
        {
          path: "/",
          element: <Product />
        },
        {
          path: "/orderComplete",
          element: <OrderCompletionPage />
        },
        {
          path: "/invoice/:invoiceId",
          element: <Invoice />
        }
      ]
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signup",
      element: <Signup />
    }
  ])

  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  )
}

export default App
