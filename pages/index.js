import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import {GraphQLClient, gql} from "graphql-request";
import BlogCard from "@/components/BlogCard";
import NavBar from "@/components/NavBar"


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
      slug,
      description {
        html
      }
      author {
        name,
        avatar {
          url
        }
      }
      coverPhoto {
        url
      }
    }
  }
`;

export async function getStaticProps(){
  const {posts} = await graphcms.request(QUERY);
  return {
    props: {
      posts,
    },
    revalidate: 10,
  };
}

export default function Home({posts}) {
  return (
    <>
      <Head>
        <title>Everhood Custom Battles</title>
        <meta name="description" content="Website with all the custom battles of Everhood" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main className={`${styles.main} ${inter.className}`}>
        {
          posts.map((post) => (
            <BlogCard 
            title={post.title} 
            author={post.author} 
            coverPhoto={post.coverPhoto}
            description={post.description.html}
            datePublished={post.datePublished} 
            slug={post.slug} 
            key={post.id}
            youtubePreview={post.youtubePreview}
            downloadLink={post.downloadLink}
            difficulty={post.difficulty}
            gameMode={post.gameMode}
            originalSong={post.originalSong} />

          ))
        }        
      </main>
    </>
  );
}
