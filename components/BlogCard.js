import { useState, useEffect } from "react"
import Link from "next/link"
import styles from "@/styles/BlogCard.module.css"

export default function BlogPost({ title, authors, coverPhoto, description, datePublished, slug, youtubePreview, downloadLink, difficulty, gameMode, originalSong, color1, color2}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (description) {
      setIsLoading(false);
    }
  }, [description]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className={styles.card} style={{'--card-hover-color1': color1 + 'cc'}}>
        <Link href={youtubePreview} target="_blank" rel="noopener noreferrer">
            <div className={styles.imgContainer}>
                <img src={coverPhoto} alt=""/>
            </div>
        </Link>
        <div className={styles.text}>
          <h2 style={{color: color1}}>{title}</h2>
          <div className={styles.descriptionContainer}>
            {description && <p dangerouslySetInnerHTML={{ __html: description }} />}
          </div>
          <div className={styles.difficulty_and_gamemode}>
            <h3>Difficulty:{difficulty}</h3>
            <h3>Game mode: {gameMode}</h3>
          </div>
          <div className={styles.buttonContainer}>
            <Link href={downloadLink} target="_blank" rel="noopener noreferrer">
              <button className={styles.downloadButton} style={{'--download-button-color1': color1, '--download-button-color2': color2}}>Download</button>
            </Link>
          </div>
          <div className={styles.details}>
            {authors.map((author, index) => (
              <div key={index} className={styles.author}>
                <img src={author.avatar.url} alt=""/>
                <h4>{author.name}</h4>
              </div>
            ))}
            <div className={styles.date}>
              <h4>{datePublished}</h4>
            </div>
          </div>
          <div className={styles.originalSong}>
              <h5>Song: {originalSong}</h5>
            </div>
        </div>
    </div>
  )
}