import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from 'src/components/layout';
import { StoreProvider } from '@/store';
import { NextPage } from 'next';

interface IProps {
  initialValue: Record<any, any>;
  Component: NextPage;
  pageProps: any
}


export default function App({ initialValue, Component, pageProps }: IProps) {
  return (
    <StoreProvider initialValue={initialValue}>
        <Layout>
            <Component {...pageProps} />
        </Layout>
    </StoreProvider>);
}

App.getInitialProps = async ({ctx}: {ctx: any}) => {
    const {userId, nickname, avatar} = ctx?.req.cookies || {};

    return {
      initialValue: {
        user: {
          userInfo: {
            userId,
            nickname,
            avatar
          }
        }
      }
    }
}