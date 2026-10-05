import { Outlet, RouterProvider, ScrollRestoration, createBrowserRouter } from 'react-router-dom'
import SiteHeader from './components/layout/SiteHeader'
import SiteFooter from './components/layout/SiteFooter'
import SkipLink from './components/layout/SkipLink'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import PrinciplesPage from './pages/PrinciplesPage'
import CommunityPage from './pages/CommunityPage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'

function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <SkipLink />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/projects', element: <ProjectsPage /> },
      { path: '/principles', element: <PrinciplesPage /> },
      { path: '/community', element: <CommunityPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
