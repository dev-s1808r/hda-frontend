import "./layout.css";
import NavContent from "./NavContent";
function Layout({ children }) {
  return (
    <section className="app">
      <nav className="navbar">
        <NavContent />
      </nav>
      <main className="main">{children}</main>
    </section>
  );
}

export default Layout;
