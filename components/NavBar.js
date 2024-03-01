import styles from "@/styles/NavBar.module.css"
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Image src="/logo.png" alt="Title" width={734} height={257}/>
    </nav>
  )
}