import "./globals.css";
import Layout from "./components/Layout";

export const metadata = {
  title: "MST Learning Website",
  description: "Website pembelajaran Minimum Spanning Tree",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
