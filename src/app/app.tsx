import { Space } from 'antd';
import {
  Link,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { QueryLiteClient, QueryLiteProvider } from 'src/QueryLite';
import { PageOne, PageTwo } from 'src/pages';

export const router = () =>
  createBrowserRouter([
    {
      path: '/',
      element: (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              marginBottom: '2rem',
            }}
          >
            <Space>
              <Link to={'/'}>One</Link>
              <Link to={'/two'}>Two</Link>
            </Space>
          </div>
          <div>
            <Outlet />
          </div>
        </div>
      ),
      children: [
        {
          index: true,
          element: <PageOne />,
        },
        {
          path: '/two',
          element: <PageTwo />,
        },
      ],
    },
  ]);

const App = () => (
  <QueryLiteProvider client={new QueryLiteClient()}>
    <RouterProvider router={router()} />
  </QueryLiteProvider>
);

export { App };
