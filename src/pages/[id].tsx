/// <reference types="@emotion/react/types/css-prop" />
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import tw, { css } from 'twin.macro';
import useSWR from 'swr';
import { useRouter } from 'next/dist/client/router';

const container = css`
  ${tw`mx-auto m-4 p-4 rounded bg-gray-400`}
`;

export const Matome = () => {
  const router = useRouter();
  const [id, setId] = useState<string>();
  useEffect(() => {
    if (router.asPath !== router.route) {
      setId(router.query.id as string);
    }
  }, [router]);

  const { data } = useSWR(`https://api.gyazo.com/api/collections/${id}/images`);
  const sortedData = data
    ?.sort((a, b) => {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    })
    .reverse();
  return (
    <>
      <Head>
        <title>gyatome</title>
      </Head>
      <div css={container}>
        <main>
          <h1 tw='m-3 text-5xl font-bold'>gyatome</h1>
          <div tw='grid grid-cols-3'>
            {sortedData &&
              sortedData.map((image) => {
                return (
                  <div tw='m-3 max-w-3xl' key={image.image_id}>
                    <h2 tw='text-4xl font-bold'>
                      {new Date(image.created_at).toLocaleDateString()}
                    </h2>
                    <h3>{image.created_at}</h3>
                    <div>
                      <a href={`https://gyazo.com/${image.image_id}`}>
                        <img tw='h-full w-full' src={image.url} />
                      </a>
                    </div>
                  </div>
                );
              })}
          </div>
        </main>
      </div>
    </>
  );
};

export default Matome;
