import styles from './paper.module.css';

export default async function Paper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
    <div className={`min-w-40 max-w-xl p-10 mt-32 bg-white rounded-lg shadow-lg ${styles.paper} ${styles.yellow}`}>
      <div className={`${styles.topTape}`}></div>
      {children}
    </div>
    </>
  )

}