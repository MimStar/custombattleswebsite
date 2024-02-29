import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import {GraphQLClient, gql} from "graphql-request";
import BlogCard from "@/components/BlogCard";
import NavBar from "@/components/NavBar"
import React, { useEffect } from 'react';
import { useState } from "react";


const inter = Inter({ subsets: ["latin"] });

const graphcms = new GraphQLClient("https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/clsqe5diz0vim01w9kpbnl6wi/master");

const QUERY = gql`
  {
    posts{
      id,
      title,
      datePublished,
      youtubePreview,
      downloadLink,
      difficulty,
      gameMode,
      originalSong,
      color1,
      color2,
      slug,
      description {
        html
      }
      authors {
        name,
        avatar
      }
      coverPhoto,
    }
  }
`;

const images = ["1", "2","3","4","5","6","7","8","9","10"];

export async function getStaticProps(){
  const {posts} = await graphcms.request(QUERY);
  return {
    props: {
      posts,
    },
    revalidate: 3600,
  };
}

export default function Home({posts}) {

  useEffect(() => {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.body.style.backgroundImage = `url(/backgrounds/background${randomImage}.jpg)`;

  }, []);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const postsPerPage = 10;

  const handleSearch = (event) => {
    setSearch(event.target.value);
  }

  useEffect(() => {
    const loadMorePosts = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
      setPage(page + 1);
    };
    window.addEventListener('scroll', loadMorePosts);
    return () => window.removeEventListener('scroll', loadMorePosts);
  }, [page]);
  const filteredPosts = [...posts].filter(post => post.title.toLowerCase().includes(search.toLowerCase()));
  const sortedPosts = filteredPosts.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));
  const currentPosts = sortedPosts.slice(0, page * postsPerPage);

  return (
    <>
      <Head>
        <title>Everhood Custom Battles</title>
        <meta name="description" content="Website with all the custom battles of Everhood" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/custombattles.ico" />
      </Head>
      <NavBar />
      <input type="text" value={search} onChange={handleSearch} placeholder="Search..." className={styles.search}/>
      <main className={`${styles.main} ${inter.className}`}>
        {
          currentPosts.map((post) => (
            <BlogCard 
            title={post.title} 
            authors={post.authors} 
            coverPhoto={post.coverPhoto}
            description={post.description.html}
            datePublished={post.datePublished} 
            slug={post.slug} 
            key={post.id}
            youtubePreview={post.youtubePreview}
            downloadLink={post.downloadLink}
            difficulty={post.difficulty}
            gameMode={post.gameMode}
            originalSong={post.originalSong}
            color1={post.color1}
            color2={post.color2} />

          ))
        }        
      </main>
    </>
  );
}
