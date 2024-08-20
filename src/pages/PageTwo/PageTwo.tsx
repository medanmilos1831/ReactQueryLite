import { Button } from 'antd';
import axios from 'axios';
import { useAction } from 'src/QueryLite/QueryLiteProvider';

const PageTwo = () => {
  const { action, loading } = useAction((payload: { fname: string }) => {
    return axios.post('https://api.escuelajs.co/api/v1/products', {
      title: 'pera',
      price: 1,
      description: 'sss',
      categoryId: 1,
      images: [
        'https://www.google.com/search?sca_esv=c2673a284c4a75c4&rlz=1C5GCEM_en&sxsrf=ADLYWIIYLwBx8LlOG-7sSva1JKf83Lhn7Q:1724146430768&q=skoda+superb&udm=2&fbs=AEQNm0Aa4sjWe7Rqy32pFwRj0UkWd8nbOJfsBGGB5IQQO6L3J_86uWOeqwdnV0yaSF-x2jo6Ttnu6iRjjgGjARfLolnBoLZZFBaghikH-Cd5D8-jDs501extcuvUVyoffiQ5rDquYr5BB7fR0vUbcc6HOfIRKuWHSQvCOjvp32EkHZihOwx56bjsiTSDWMF6Ho8RrtRGaZWI&sa=X&ved=2ahUKEwjJwq_8oYOIAxWwwAIHHeMbJzoQtKgLegQIFRAB&biw=1440&bih=778&dpr=2#vhid=eUnOlPlqz0-A-M&vssid=mosaic',
      ],
    });
  });
  console.log('loading', loading);
  return (
    <div>
      PageTwo dsdsds
      <Button
        loading={loading}
        onClick={() => {
          action({ fname: 'sss' });
        }}
      >
        update
      </Button>
    </div>
  );
};

export { PageTwo };
