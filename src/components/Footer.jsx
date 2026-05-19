function Footer() {
    return (
        <footer className="footer">
            <h3>BlogNest</h3>

            <p>
                A full-stack social blogging platform built with Flask and React.
            </p>

            <small>
                © {new Date().getFullYear()} BlogNest. All rights reserved.
            </small>
        </footer>
    );
}

export default Footer;