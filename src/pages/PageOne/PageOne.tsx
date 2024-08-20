import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useClient, useFetch } from 'src/QueryLite';
const PageOne = () => {
  const [state, setState] = useState(0);
  const client = useClient();

  const { data, isLoading } = useFetch({
    key: 'pera',
    promise: () => {
      // console.log('state', state);
      return axios.get(
        `https://api.escuelajs.co/api/v1/products?limit=10&offset=${state}`
      );
    },
    dependency: state,
    onSuccess(data) {
      // console.log('SUCCESSS', data);
    },
    cacheData: true,
    showLog: true,
    // enabled: state === 4 ? true : false,
  });

  // console.log('isLoading', isLoading);
  const columns = [
    {
      title: 'title',
      dataIndex: 'title',
    },
    {
      title: 'price',
      dataIndex: 'price',
    },
  ];
  return (
    <>
      PageOne
      <button
        onClick={() => {
          setState((prev) => prev + 1);
        }}
      >
        dep change {state}
      </button>
      <button
        onClick={() => {
          client.invalidate('pera');
        }}
      >
        invalid
      </button>
      <button
        onClick={() => {
          client.getClient();
        }}
      >
        get client
      </button>
      <Table
        loading={isLoading}
        bordered
        dataSource={data ? data : []}
        columns={columns}
        pagination={{
          pageSize: 10,
          current: state,
          total: 100,
          onChange(page, pageSize) {
            setState(page);
            // console.log('page', page);
          },
        }}
      />
    </>
  );
};

export { PageOne };
