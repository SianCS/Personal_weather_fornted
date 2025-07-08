import { createBrowserRouter, RouterProvider } from "react-router"
import Login from "../pages/Login"
import RedirectToHome from "../pages/RedirectToHome"
import Register from "../pages/Register"
import { Suspense } from "react"
import Gusets from "../pages/Gusets"
import Users from "../pages/Users"
import useUserStore from "../stores/userStore"




const guestRouter = createBrowserRouter([
  // {path : "/" , Component : Register},
  {path : "/", Component : Login },
  {path : "*" , Component : RedirectToHome},
  {path : "/guests" , Component : Gusets }
])

const userRouter = createBrowserRouter([
  {path : "/" , Component : Users},
  {path : "*", Component : RedirectToHome},
])


function AppRouter() {

  // const user = "sian"
  // const user = false
  const user = useUserStore(state => state.user)

  const finalRouter = user ? userRouter : guestRouter
  return (
    <Suspense fallback={<p>Loading...</p>}>
        <RouterProvider key={user?.id} router={finalRouter} />
    </Suspense>
  )
}
export default AppRouter