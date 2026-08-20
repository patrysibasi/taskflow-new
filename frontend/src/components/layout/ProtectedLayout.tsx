import { Outlet } from "react-router-dom"

import Header from "./Header"

function ProtectedLayout() {
  return (
    <>
      <Header />

      <Outlet />
    </>
  )
}

export default ProtectedLayout

