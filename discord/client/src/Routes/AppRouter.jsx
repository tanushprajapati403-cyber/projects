import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import PublicRoute from "../components/ProtectedRoute/PublicRoute";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
// import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
// import MainLayout from "../layouts/MainLayout";

const AppRouter = () => {
  let router = createBrowserRouter([
    {
      path: "/",
      element: <PublicRoute />,
      children: [
        {
          path: "",
          element: <AuthLayout />,
          children: [
            { path: "/", element: <Login /> },
            { path: "/register", element: <Register /> },
          ],
        },
      ],
    },
    // {
    //     path:'/dasbord',
    //     element:<ProtectedRoute/>,
    //     children:[
    //         {
    //             path:'',
    //             element:<MainLayout/>,
    //             children:[
      // {},{},{}
    //             ]
    //         }
    //     ]
    // }
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
