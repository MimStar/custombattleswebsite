import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import {GraphQLClient, gql} from "graphql-request";
import BlogCard from "@/components/BlogCard";
import NavBar from "@/components/NavBar"
import React, { useEffect } from 'react';
import { useState } from "react";

let skipNumber = 0;

const inter = Inter({ subsets: ["latin"] });

const graphcms = new GraphQLClient("ADD YOU GRAPHCMS API LINK");

const QUERY = gql`
  query Posts($skip: Int!){
    posts(first: 10, skip : $skip, orderBy: datePublished_DESC) {
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

const SEARCH_QUERY = gql`
  query SearchPosts($title: String!){
    posts(where: {title_contains: $title}) {
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
  const {posts: initialPosts} = await graphcms.request(QUERY , {skip: skipNumber});
  return {
    props: {
      initialPosts,
    },
    revalidate: 60,
  };
}

export default function Home({initialPosts}) {

  useEffect(() => {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.body.style.backgroundImage = `url(/backgrounds/background${randomImage}.jpg)`;

  }, []);

  const [search, setSearch] = useState("");
  const [allPosts, setAllPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const postsPerPage = 10;

  const[initial, setInitial] = useState(initialPosts);

  let debounceTimer;

  const handleSearch = async (event) => {
    const searchValue = event.target.value;
    setSearch(searchValue);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      if (searchValue === "") {
        const {posts} = await graphcms.request(QUERY, {skip: 0});
        setAllPosts(posts);
      } else {
        const {posts} = await graphcms.request(SEARCH_QUERY, {title: searchValue});
        setAllPosts(posts);
      }
      setPage(1); // Reset the page state
    }, 500); // delay of 500ms
  }

  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const loadMorePosts = async () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || search !== "" || isLoading) return;
      setIsLoading(true);
      setPage(page + 1);
      const {posts} = await graphcms.request(QUERY, {skip: page * postsPerPage});
      setAllPosts([...allPosts, ...posts]);
      setIsLoading(false);
    };
    window.addEventListener('scroll', loadMorePosts);
    return () => window.removeEventListener('scroll', loadMorePosts);
  }, [page, allPosts]);
  const filteredPosts = [...allPosts].filter(post => post.title.toLowerCase().includes(search.toLowerCase()));
  const currentPosts = filteredPosts.slice(0, page * postsPerPage);

  return (
    <>
      <Head>
        <title>Everhood Custom Battles</title>
        <meta name="description" content="The best place to download all the custom battles for Everhood !" />
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
