import "./Navbar.css"
export default function Navbar() {
    return (
        <nav className="nav">
            <a href="/" className="site-title">DOMFOLIO</a>
            <ul>
                <li>
                    <a href="/about">About Me</a>
                </li>
                <li>
                    <a href="/experience">My Adventures</a>
                </li>
            </ul>
        </nav>
    )
}