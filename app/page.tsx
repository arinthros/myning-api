import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Myning Stats</h1>
      <Link href='/login'>Sign In</Link><br />
      <Link href='/register'>Register</Link>
    </>
  );
}
